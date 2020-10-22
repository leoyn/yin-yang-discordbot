import { Message, MessageEmbed } from "discord.js";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class HelpCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.HELP;
    }

    handle(parameters: string[], message: Message): void {
        const messageEmbed = new MessageEmbed();

        messageEmbed.addField("Diese Hilfe aufrufen", "`+help`");
        messageEmbed.addField("Gibt einen bekannten Spruch zurück.", "`+phrase`");

        message.channel.send(messageEmbed);
    }
}
