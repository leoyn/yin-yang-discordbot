import { Message } from "discord.js";
import { Database } from "../Database";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class CreateReactionRoleCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.REACTIONROLE_CREATE;
    }

    handle(parameters: string[], message: Message): Promise<any> {
        if (parameters.length != 3)
            throw new Error("Du musst die `messageId`, die Rolle `@role` als auch das `emoji` mitgeben.");

        const messageId: string = parameters[0];
        const roleMention: string = parameters[1];
        const emojiName: string = parameters[2];
        const regex = /<@&(?<roleId>[0-9]+)>/;

        if (!regex.test(roleMention)) throw new Error("Du musst die Rolle @role mention");
        const roleMatch = roleMention.match(regex);

        const roleId: string = roleMatch.groups.roleId;

        return message.guild.roles
            .fetch(roleId)
            .then((_) => {
                return message.channel.messages.fetch(messageId);
            })
            .catch(() => {
                throw new Error("Nachricht oder Rolle konnte nicht gefunden werden");
            })
            .then((reactionMessage) => {
                return Database.getInstance()
                    .query(
                        "INSERT INTO reactionrole (messageId, roleId, emojiName) VALUES(?, ?, ?)",
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
}
