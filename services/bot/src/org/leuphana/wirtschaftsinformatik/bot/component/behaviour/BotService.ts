import { Client, DiscordAPIError, GuildMember, Message, MessageEmbed, MessageReaction, TextChannel } from "discord.js";
import { CommandDispatcher } from "../structure/CommandDispatcher";
import { EventHandler } from "../structure/EventHandler";
import { DatabaseConnector } from "../../connector/DatabaseConnector";
import { XKCD } from "../structure/models/XKCD";
import { HttpConnector } from "../../connector/HttpConnector";
import { MealPlan } from "../structure/models/MealPlan";
import { Meal } from "../structure/models/Meal";
import { MealDay } from "../structure/models/MealDay";
import { RSSFeed } from "../structure/models/RSSFeed";
import { RSSItem } from "../structure/models/RSSItem";
import Parser = require("rss-parser");

export class BotService {
    private static instance: BotService;
    private client: Client;
    private commandDispatcher: CommandDispatcher;
    private eventHandler: EventHandler;

    public static getInstance(): BotService {
        if (BotService.instance == null) {
            BotService.instance = new BotService();
        }

        return BotService.instance;
    }

    constructor() {
        this.client = new Client();
        this.eventHandler = new EventHandler();
        this.commandDispatcher = new CommandDispatcher();

        this.client.on("message", this.commandDispatcher.evaluateMessage);
        this.client.on("raw", (data) => {
            this.eventHandler.emit("raw", data);
        });
    }

    public connect(token: string): Promise<any> {
        return this.client.login(token).then(() => {
            this.client.user.setPresence({
                activity: {
                    type: "WATCHING",
                    name: "+help",
                },
            });
        });
    }

    public getClient(): Client {
        return this.client;
    }

    public on(name: string, callback: any) {
        this.eventHandler.on(name, callback);
    }

    public createReationRole(message: Message, messageId: string, roleMention: string, emojiName: string): Promise<any> {
        const regex = /<@&(?<roleId>[0-9]+)>/;
        if (!regex.test(roleMention)) throw new Error("Du musst die Rolle @role erwähnen");

        const roleMatch = roleMention.match(regex);
        const roleId: string = roleMatch.groups.roleId;

        return message.guild.roles.fetch(roleId)
            .then((_) => {
                return message.channel.messages.fetch(messageId);
            })
            .catch(() => {
                throw new Error("Nachricht oder Rolle konnte nicht gefunden werden");
            })
            .then((reactionMessage) => {
                return DatabaseConnector.getInstance()
                    .query(
                        "INSERT INTO reactionrole (message_id, role_id, emojiname) VALUES($1, $2, $3)",
                        messageId,
                        roleId,
                        emojiName
                    )
                    .then(() => {
                        reactionMessage.react(emojiName);
                    })
                    .catch(() => {
                        throw new Error("Irgendwas ist schief gelaufen");
                    });
            });
    }

    public deleteReactionRole(message: Message, messageId: string): Promise<any> {
        return DatabaseConnector.getInstance().query(
            "DELETE FROM reactionrole WHERE message_id = $1",
            messageId,
        ).catch(() =>{
            throw new Error("Nachricht konnte nicht gefunden werden");
        }).then(() => {
            return message.channel.messages.fetch(messageId)
        }).catch(() => {
            throw new Error("Nachrichteninhalt konnte nicht geladen werden");
        }).then(message => {
            return message.reactions.removeAll();
        }).catch(() => {
            throw new Error("Reaktionen der Nachricht konnten nicht entfernt werden. Bitte entferne diese manuell.");
        })
    }

    public getNewestXKCD(id: number = null): Promise<XKCD> {
        let url = "https://xkcd.com";

        if(id !== null) url += `/${id}`;
        
        return new Promise<XKCD>((resolve, reject) => {
            HttpConnector.getInstance().get(url + "/info.0.json").then((httpResponse) => {
                const json = httpResponse.toJson();
                const xkcd = new XKCD();
                xkcd.setId(json.num);
                xkcd.setImageUrl(json.img);
                xkcd.setTitle(json.title);

                resolve(xkcd);
            }).catch(() => {
                reject();
            });
        });
    }

    public addReactionRoleAssignment(messageReaction: MessageReaction, guildMember: GuildMember): void {
        DatabaseConnector.getInstance()
            .query(
                "SELECT roleid FROM reactionrole WHERE message_id = $1 AND emojiname = $2 LIMIT 1",
                messageReaction.message.id,
                messageReaction.emoji.name
            )
            .then((result) => {
                if (result.rows.length > 0) {
                    const role = guildMember.guild.roles.cache.find((role) => role.id === result.rows[0].roleid);
                    guildMember.roles.add(role);
                }
            });
    }

    public deleteReactionAssignment(messageReaction: MessageReaction, guildMember: GuildMember): void {
        DatabaseConnector.getInstance()
            .query(
                "SELECT roleid FROM reactionrole WHERE message_id = $1 AND emojiname = $2 LIMIT 1",
                messageReaction.message.id,
                messageReaction.emoji.name
            )
            .then((result) => {
                if (result.rows.length > 0) {
                    const role = guildMember.guild.roles.cache.find((role) => role.id === result.rows[0].roleid);
                    guildMember.roles.remove(role);
                }
            });
    }

    public getRandomPhrase(): any {
        const recognizablePhrases = [
            {
                phrase: "Verstehen Sie",
                author: "T. Slotos",
            },
            {
                phrase: "Yin und Yang",
                author: "T. Slotos",
            },
            {
                phrase: "Struktur und Verhalten",
                author: "T. Slotos",
            },
            {
                phrase: "Das ist Trivial.",
                author: "U. Hoffmann",
            },
            {
                phrase: "Dieser Student bekommt 110 von 100 möglichen Punkte.",
                author: "T. Slotos",
            },
            {
                phrase: "Achtung! Schwierige Frage.",
                author: "T. Slotos",
            },
            {
                phrase: "Das ist Mathematik der 9. Klasse",
                author: "J. Wilk",
            },
        ];

        return recognizablePhrases[Math.floor(Math.random() * recognizablePhrases.length)];
    }

    public getMealPlan(): Promise<MealPlan> {
        return new Promise((resolve, reject) => {
            HttpConnector.getInstance().get("https://app.mensaplan.de/api/11102/de.mensaplan.app.android.lueneburg/lbg1.json").then((httpResponse) => {
                const json = httpResponse.toJson();
                const currentDate = new Date(new Date().toISOString().split("T")[0]);

                const mealPlan = new MealPlan();
                let mealDays = [];

                json.days.forEach(day => {
                    const mealDay = new MealDay();
                    mealDay.setDate(new Date(day["iso-date"]));

                    if (mealDay.getDate() >= currentDate) {
                        let meals = [];

                        day.categories.forEach(categories => {
                            categories.meals.forEach(jsonMeal => {
                                if (jsonMeal.share === true) {
                                    const meal = new Meal();
                                    meal.setId(jsonMeal.id);
                                    meal.setName(jsonMeal.name);
                                    
                                    if("pricing" in jsonMeal) meal.setPrice((jsonMeal.pricing.for[0]) / 100);
                                    if (meal.getId() in json.ratings.menu) meal.setRating(json.ratings.menu[meal.getId()].stars);

                                    meals.push(meal);
                                }
                            });
                        });

                        mealDay.setMeals(meals);
                        mealDays.push(mealDay);
                    }
                });

                mealPlan.setMealDays(mealDays);
                resolve(mealPlan);
            });
        });
    }

    public addRSSFeed(url: string, channelId: string): Promise<RSSFeed> {
        return new Promise((resolve, reject) => {
            DatabaseConnector.getInstance().query("INSERT INTO feed (url, channel_id) VALUES($1, $2) RETURNING *", url, channelId).then((result) => {
                const rssFeed: RSSFeed = new RSSFeed();
                rssFeed.setId(result.rows[0].id);
                rssFeed.setUrl(url);
                rssFeed.setChannelId(channelId);
                resolve(rssFeed);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public getRSSFeeds(): Promise<Array<RSSFeed>> {
        return new Promise((resolve, reject) => {
            DatabaseConnector.getInstance().query("SELECT id, url, channel_id FROM feed").then((result) => {
                const rssFeeds: Object = {};

                result.rows.forEach((feed) => {
                    const rssFeed = new RSSFeed();
                    rssFeed.setId(feed.id);
                    rssFeed.setUrl(feed.url);
                    rssFeed.setChannelId(feed.channel_id);
                    
                    rssFeeds[feed.id] = rssFeed;
                });

                DatabaseConnector.getInstance().query("SELECT id, guid, title, description, url, feed_id FROM item").then((result) => {
                    result.rows.forEach((item) => {
                        const rssItem = new RSSItem();
                        rssItem.setId(item.id);
                        rssItem.setGuid(item.guid);
                        rssItem.setTitle(item.title);
                        rssItem.setDescription(item.description);
                        rssItem.setUrl(item.url);

                        rssFeeds[item.feed_id].getItems().push(rssItem);
                    });

                    resolve(Object.values(rssFeeds));
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public removeRSSFeed(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            DatabaseConnector.getInstance().query("DELETE FROM feed WHERE url = $1", url).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    private addRSSItemToRSSFeed(rssItem: RSSItem, feedId: number): Promise<RSSItem> {
        return new Promise((resolve, reject) => {
            DatabaseConnector.getInstance().query("INSERT INTO item (guid, title, description, url, feed_id) VALUES($1, $2, $3, $4, $5) RETURNING *", rssItem.getGuid(), rssItem.getTitle(), rssItem.getDescription(), rssItem.getUrl(), feedId).then((result) => {
                rssItem.setId(result.rows[0].id);
                resolve(rssItem);
            }).catch(err => {
                reject(err);
            });
        });
    }

    public synchronizeRSSFeeds(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const rssFeeds = await this.getRSSFeeds();
            const parser: Parser = new Parser();

            rssFeeds.forEach(async (rssFeed) => {
                const feed = await parser.parseURL(rssFeed.getUrl());

                feed.items.reverse().forEach(async (item) => {
                    try {
                        const rssItem: RSSItem = new RSSItem();
                        rssItem.setGuid(item.guid);
                        rssItem.setTitle(item.title);
                        rssItem.setDescription(item.contentSnippet);
                        rssItem.setUrl(item.link);
                        rssItem.setImage(feed.image.url);
                        rssItem.setDate(new Date(item.isoDate));
                    
                        await this.addRSSItemToRSSFeed(rssItem, rssFeed.getId());

                        const channel = await this.client.channels.fetch(rssFeed.getChannelId().toString());

                        if (channel instanceof TextChannel) {
                            const messageEmbed = new MessageEmbed();

                            messageEmbed.setTitle(rssItem.getTitle());
                            messageEmbed.setURL(rssItem.getUrl());
                            messageEmbed.setDescription(rssItem.getDescription());
                            messageEmbed.setImage(rssItem.getImage());
                            messageEmbed.setTimestamp(rssItem.getDate());

                            (channel as TextChannel).send(messageEmbed);
                        }
                    } catch (err) {
                        // TODO: Better logging
                    }
                });
            });

            resolve();
        });
    }
}
