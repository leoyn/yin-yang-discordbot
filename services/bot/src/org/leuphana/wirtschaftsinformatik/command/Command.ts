import { Message } from "discord.js";

export interface Command {
    handle(parameters: string[], message: Message): any;
}
