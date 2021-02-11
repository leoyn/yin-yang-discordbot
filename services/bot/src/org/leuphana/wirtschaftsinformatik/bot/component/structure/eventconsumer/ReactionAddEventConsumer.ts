import { GuildMember, MessageReaction } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { EventConsumer } from "./EventConsumer";

export class ReactionAddEventConsumer implements EventConsumer {
    consume(reaction: MessageReaction, member: GuildMember) {
        BotService.getInstance().addReactionRoleAssignment(reaction, member);
    }
}
