import { EventConsumer } from "./eventconsumer/EventConsumer";
import { ReactionAddEventConsumer } from "./eventconsumer/ReactionAddEventConsumer";
import { ReactionRemoveEventConsumer } from "./eventconsumer/ReactionRemoveEventConsumer";

export class EventDispatcher {
    private static instance;

    public static getInstance(): EventDispatcher {
        if (this.instance == null) {
            this.instance = new EventDispatcher();
        }

        return this.instance;
    }

    public evaluateEvent(name: string | symbol, ...data: any): void {
        let eventConsumer: EventConsumer;

        switch (name) {
            case "message.reaction.add":
                eventConsumer = new ReactionAddEventConsumer();
                break;
            case "message.reaction.remove":
                eventConsumer = new ReactionRemoveEventConsumer();
                break;
        }

        if (eventConsumer != null) eventConsumer.consume(...data);
    }
}
