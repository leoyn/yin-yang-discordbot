import { Client, GuildMember, Message, MessageReaction } from "discord.js";
import { CommandDispatcher } from "../structure/CommandDispatcher";
import { EventHandler } from "../structure/EventHandler";
import { DatabaseConnector } from "../../connector/DatabaseConnector";
import { XKCD } from "../structure/models/XKCD";
import { HttpConnector } from "../../connector/HttpConnector";
import { MealPlan } from "../structure/models/MealPlan";
import { Meal } from "../structure/models/Meal";
import { MealDay } from "../structure/models/MealDay";

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
                status: "idle",
                activity: {
                    type: "PLAYING",
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
        if (!regex.test(roleMention)) throw new Error("Du musst die Rolle @role mention");

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
                        "INSERT INTO reactionrole (messageid, roleid, emojiname) VALUES($1, $2, $3)",
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
            "DELETE FROM reactionrole WHERE messageid = $1",
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
                "SELECT roleid FROM reactionrole WHERE messageid = $1 AND emojiname = $2 LIMIT 1",
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
                "SELECT roleid FROM reactionrole WHERE messageId = $1 AND emojiname = $2 LIMIT 1",
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
                                    meal.setPrice((jsonMeal.pricing.for[0]) / 100);

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
}
