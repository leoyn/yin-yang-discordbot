import { Client, MessageReaction, TextChannel } from "discord.js";
import { EventEmitter } from "events";
import { EventDispatcher } from "./EventDispatcher";
import { BotService } from "../behaviour/BotService";

export class EventHandler extends EventEmitter {
    constructor() {
        super();
    }

    public emit(name: string | symbol, data: any): boolean {
        let eventDispatcher = EventDispatcher.getInstance();

        if (["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(data.t)) {
            const client: Client = BotService.getInstance().getClient();

            client.channels
                .fetch(data.d.channel_id)
                .then((channel) => {
                    return (<TextChannel>channel).messages.fetch(data.d.message_id);
                })
                .then((message) => {
                    const emoji: string = data.d.emoji.id
                        ? `${data.d.emoji.name}:${data.d.emoji.id}`
                        : data.d.emoji.name;
                    const reaction: MessageReaction = message.reactions.cache.get(emoji);
                    reaction.message = message;

                    message.guild.members.fetch(data.d.user_id).then((member) => {
                        if (!member.user.bot) {
                            if (data.t === "MESSAGE_REACTION_ADD") {
                                eventDispatcher.evaluateEvent("message.reaction.add", reaction, member);
                            } else if (data.t === "MESSAGE_REACTION_REMOVE") {
                                eventDispatcher.evaluateEvent("message.reaction.remove", reaction, member);
                            }
                        }
                    });
                });
        }

        return super.emit(name, data);
    }
}
