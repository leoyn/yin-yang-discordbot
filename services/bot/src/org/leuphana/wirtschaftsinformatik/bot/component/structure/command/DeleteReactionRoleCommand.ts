import { Message } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class DeleteReactionRoleCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.REACTIONROLE_DELETE;
    }

    handle(parameters: string[], message: Message): void {
        if(parameters.length < 1) throw new Error("Du musst die `messasgeId` als Argument übergeben");

        const messageId = parameters[0];

        BotService.getInstance().deleteReactionRole(message, messageId);
    }
}
