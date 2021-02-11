import { Message, MessageEmbed, MessageManager } from "discord.js";
import { Permission } from "../Permission";
import { Command } from "./Command";
import { BotService } from "../../behaviour/BotService";

export class GetNewestXKCDCommand implements Command {
    handle(parameters: string[], message: Message) { 
        let id = null;

        if(parameters.length > 0) id = parseInt(parameters[0]);
        
        BotService.getInstance().getNewestXKCD(id).then((xkcd) => {
            const messageEmbed = new MessageEmbed();
            
            messageEmbed.setImage(xkcd.getImageUrl());
            messageEmbed.setTitle(xkcd.getTitle());
            messageEmbed.setURL(`https://xkcd.com/${xkcd.getId()}`);

            message.channel.send(messageEmbed);
        }).catch(() => {
            message.channel.send("Dieser XKCD existiert nicht.")
        })
    }
    getRequiredPermission(): Permission {
        return Permission.XKCD;
    }
}