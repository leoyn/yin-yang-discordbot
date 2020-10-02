import { Message } from "discord.js";
import { Command } from "./Command";

export class DeleteReactionRoleCommand implements Command {
    handle(parameters: string[], message: Message): void {}
}
