import { DMChannel, Message, TextChannel } from "discord.js";
import { Command } from "./command/Command";
import { CreateReactionRoleCommand } from "./command/CreateReactionRoleCommand";
import { DeleteReactionRoleCommand } from "./command/DeleteReactionRoleCommand";
import { GetMealPlanCommand } from "./command/GetMealPlanCommant";
import { GetNewestXKCDCommand } from "./command/GetNewestXKCDCommand";
import { HelpCommand } from "./command/HelpCommand";
import { RecognizablePhraseCommand } from "./command/RecognizablePhraseCommand";
import { PermissionManager } from "./PermissionManager";

export class CommandDispatcher {
    public evaluateMessage(message: Message) {
        const prefix = "+";

        if (
            !message.author.bot &&
            message.content.startsWith(prefix) &&
            !(message.channel instanceof DMChannel) &&
            (message.channel instanceof TextChannel) && ((<TextChannel>message.channel).name === "bot" || message.member.hasPermission("ADMINISTRATOR"))
        ) {
            let command: Command;
            let args: string[] = message.content.substring(prefix.length).split(" ");

            switch (args[0]) {
                case "reactionrole-remove":
                    command = new DeleteReactionRoleCommand();
                    break;
                case "reactionrole-add":
                    command = new CreateReactionRoleCommand();
                    break;
                case "phrase":
                    command = new RecognizablePhraseCommand();
                    break;
                case "help":
                    command = new HelpCommand();
                    break;
                case "xkcd":
                    command = new GetNewestXKCDCommand();
                    break;
                case "mensa":
                    command = new GetMealPlanCommand();
                    break;
            }

            args.shift();
           
            try {
                if (command != null) {
                    if (PermissionManager.getInstance().checkPermission(command.getRequiredPermission(), message.member)) {
                        let promise = command.handle(args, message);

                        if (promise instanceof Promise) {
                            promise.catch((error) => {
                                message.channel.send("Error: " + error.message);
                            });
                        }
                    } else throw new Error("Du hast keine Berichtigung dieses Kommando auszuführen");
                } else throw new Error("Dies Kommando existiert nicht. Kommandoübersicht mit `+help`");
            } catch (error) {
                message.channel.send("Error: " + error.message);
            }
        }
    }
}
