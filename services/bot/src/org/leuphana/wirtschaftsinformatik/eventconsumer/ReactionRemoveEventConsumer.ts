import { GuildMember, Message, MessageReaction } from "discord.js";
import { Database } from "../Database";
import { EventConsumer } from "./EventConsumer";

export class ReactionRemoveEventConsumer implements EventConsumer {
    consume(reaction: MessageReaction, member: GuildMember) {
        Database.getInstance()
            .query(
                "SELECT roleId FROM reactionrole WHERE messageId = ? AND emojiName COLLATE utf8mb4_bin = ? LIMIT 1",
                reaction.message.id,
                reaction.emoji.name
            )
            .then((result) => {
                if (result.length > 0) {
                    const role = member.guild.roles.cache.find((role) => role.id === result[0].roleId);
                    member.roles.remove(role);
                }
            });
    }
}
