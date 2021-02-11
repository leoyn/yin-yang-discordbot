import { Message } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class CreateReactionRoleCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.REACTIONROLE_CREATE;
    }

    handle(parameters: string[], message: Message): void {
        if (parameters.length != 3)
            throw new Error("Du musst die `messageId`, die Rolle `@role` als auch das `emoji` mitgeben.");

        const messageId: string = parameters[0];
        const roleMention: string = parameters[1];
        const emojiName: string = parameters[2];

        BotService.getInstance().createReationRole(message, messageId, roleMention, emojiName);
    }
}
