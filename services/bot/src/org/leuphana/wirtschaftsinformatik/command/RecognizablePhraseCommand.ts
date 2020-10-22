import { Message, MessageEmbed } from "discord.js";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class RecognizablePhraseCommand implements Command {
    getRequiredPermission(): Permission {
        return Permission.PHRASE;
    }

    handle(parameters: string[], message: Message): void {
        const recognizablePhrases = [
            {
                phrase: "Verstehen Sie",
                author: "T. Slotos",
            },
            {
                phrase: "Yin und Yang",
                author: "T. Slotos",
            },
            {
                phrase: "Struktur und Verhalten",
                author: "T. Slotos",
            },
            {
                phrase: "Das ist Trivial.",
                author: "U. Hoffmann",
            },
            {
                phrase: "Dieser Student bekommt 100 Punkte.",
                author: "T. Slotos",
            },
            {
                phrase: "Achtung! Schwierige Frage.",
                author: "T. Slotos",
            },
        ];

        const recognizablePhrase = recognizablePhrases[Math.floor(Math.random() * recognizablePhrases.length)];
        const embed = new MessageEmbed();

        embed.addField(`«${recognizablePhrase.phrase}»`, `~ \`${recognizablePhrase.author}\``);

        message.channel.send(embed);
    }
}
