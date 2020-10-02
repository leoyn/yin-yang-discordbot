import { Message, MessageEmbed } from "discord.js";
import { Command } from "./Command";

export class RecognizablePhraseCommand implements Command {
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
                author: "U. Hoffmann",
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
