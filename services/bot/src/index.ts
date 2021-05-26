import { BotService } from "./org/leuphana/wirtschaftsinformatik/bot/component/behaviour/BotService";
import { DatabaseConnector } from "./org/leuphana/wirtschaftsinformatik/bot/connector/DatabaseConnector";
import * as http from "http";

DatabaseConnector.getInstance().connect(
    process.env.PGHOST,
    parseInt(process.env.PGPORT),
    process.env.PGUSER,
    process.env.PGPASSWORD,
    process.env.PGDATABASE
);


const server = http.createServer((request, response) => {
    response.writeHead(200);
    response.end();
});

const botService = BotService.getInstance();

botService.connect(process.env.DISCORD_TOKEN)
    .then(() => {
        console.info("Bot connected!");
        server.listen(8080);

        // sync every 60 seconds
        setInterval(() => {
            botService.synchronizeRSSFeeds();
        }, 60 * 1000);
    });
