import { Message } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class AddRSSFeedCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.RSSFEED_ADD;
    }

    async handle(parameters: string[], message: Message) {
        if (parameters.length != 1) throw new Error("Du musst die Adresse des RSS-Feeds angeben");

        try {
            await BotService.getInstance().addRSSFeed(parameters[0], message.channel.id);
        } catch(err) {
            throw new Error("Es gab einen Fehler beim Hinzufügen. Achte darauf, dass die URL noch nicht existiert.");
        }
    }
}
