import { BotService } from "./org/leuphana/wirtschaftsinformatik/bot/component/behaviour/BotService";
import { DatabaseConnector } from "./org/leuphana/wirtschaftsinformatik/bot/connector/DatabaseConnector";

DatabaseConnector.getInstance().connect(
    process.env.PGHOST,
    parseInt(process.env.PGPORT),
    process.env.PGUSER,
    process.env.PGPASSWORD,
    process.env.PGDATABASE
);

BotService.getInstance()
    .connect(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log("Bot connected!");
    });
