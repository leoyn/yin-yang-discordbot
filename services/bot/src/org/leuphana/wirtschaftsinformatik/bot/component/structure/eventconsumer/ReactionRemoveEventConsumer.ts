import { GuildMember, Message, MessageReaction } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { EventConsumer } from "./EventConsumer";

export class ReactionRemoveEventConsumer implements EventConsumer {
    consume(reaction: MessageReaction, member: GuildMember) {
        BotService.getInstance().deleteReactionAssignment(reaction, member);
    }
}
