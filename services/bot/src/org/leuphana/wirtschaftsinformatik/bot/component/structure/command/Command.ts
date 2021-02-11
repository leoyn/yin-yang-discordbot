import { Message } from "discord.js";
import { Permission } from "../Permission";

export interface Command {
    handle(parameters: string[], message: Message): any;
    getRequiredPermission(): Permission;
}
