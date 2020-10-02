import { Bot } from "./org/leuphana/wirtschaftsinformatik/Bot";
import { Database } from "./org/leuphana/wirtschaftsinformatik/Database";

Database.getInstance().connect(
    process.env.MYSQL_HOST,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    process.env.MYSQL_DATABASE
);

Bot.getInstance()
    .connect(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log("Bot connected!");
    });
