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
});

BotService.getInstance()
    .connect(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log("Bot connected!");
        server.listen(8080);
    });
