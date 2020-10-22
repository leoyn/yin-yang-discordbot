import { Message } from "discord.js";
import { Database } from "../Database";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class DeleteReactionRoleCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.REACTIONROLE_DELETE;
    }

    handle(parameters: string[], message: Message): void {
        if(parameters.length < 1) throw new Error("Du musst die `messasgeId` als Argument übergeben");

        const messageId = parameters[0];

        Database.getInstance().query(
            "DELETE FROM reactionrole WHERE messageId = ?",
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
}
