import { Client } from "discord.js";
import { CommandDispatcher } from "./CommandDispatcher";
import { EventHandler } from "./EventHandler";

export class Bot {
    private static instance: Bot;
    private client: Client;
    private commandDispatcher: CommandDispatcher;
    private eventHandler: EventHandler;

    public static getInstance(): Bot {
        if (Bot.instance == null) {
            Bot.instance = new Bot();
        }

        return Bot.instance;
    }

    constructor() {
        this.client = new Client();
        this.eventHandler = new EventHandler();
        this.commandDispatcher = new CommandDispatcher();

        this.client.on("message", this.commandDispatcher.evaluateMessage);
        this.client.on("raw", (data) => {
            this.eventHandler.emit("raw", data);
        });
    }

    public connect(token: string): Promise<any> {
        return this.client.login(token);
    }

    public getClient(): Client {
        return this.client;
    }

    public on(name: string, callback: any) {
        this.eventHandler.on(name, callback);
    }
}
