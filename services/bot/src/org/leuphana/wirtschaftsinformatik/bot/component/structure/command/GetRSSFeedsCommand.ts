import { Message, MessageEmbed } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class GetRSSFeedsCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.RSSFEED_LIST;
    }

    handle(parameters: string[], message: Message): void {
        BotService.getInstance().getRSSFeeds().then((rssFeeds) => {
            const messageEmbed = new MessageEmbed();

            const urls = rssFeeds.map((feed) => {
                return feed.getUrl();
            });

            messageEmbed.setDescription(`Liste aller RSS Feeds:\n${urls.join("\n")}`);

            message.channel.send(messageEmbed);
        });
    }
}
