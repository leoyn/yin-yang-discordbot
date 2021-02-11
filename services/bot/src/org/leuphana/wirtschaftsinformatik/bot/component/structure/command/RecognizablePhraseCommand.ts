import { Message, MessageEmbed } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class RecognizablePhraseCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.PHRASE;
    }

    handle(parameters: string[], message: Message): void {
        const recognizablePhrase = BotService.getInstance().getRandomPhrase();

        const messageEmbed = new MessageEmbed();
        messageEmbed.addField(`«${recognizablePhrase.phrase}»`, `~ \`${recognizablePhrase.author}\``);

        message.channel.send(messageEmbed);
    }
}
