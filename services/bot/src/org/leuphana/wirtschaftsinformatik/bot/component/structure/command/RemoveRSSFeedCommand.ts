import { Message } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class RemoveRSSFeedCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.RSSFEED_REMOVE;
    }

    async handle(parameters: string[], message: Message) {
        if (parameters.length != 1) throw new Error("Du musst die Adresse des RSS-Feeds angeben.")
        try {
            await BotService.getInstance().removeRSSFeed(parameters[0]);
        } catch (err) {
            throw new Error("Ein RSS-Feed mit der angegeben URL existiert nicht.");
        }
    }
}
