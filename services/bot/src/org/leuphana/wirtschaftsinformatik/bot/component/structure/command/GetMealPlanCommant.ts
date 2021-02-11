import { Message, MessageEmbed } from "discord.js";
import { BotService } from "../../behaviour/BotService";
import { Permission } from "../Permission";
import { Command } from "./Command";

export class GetMealPlanCommand implements Command {
    handle(parameters: string[], message: Message) {
        BotService.getInstance().getMealPlan().then(mealPlan => {
            const messageEmbed = new MessageEmbed();

            mealPlan.getMealDays().forEach(mealDay => {
                let mealText = "";

                mealDay.getMeals().forEach(meal => {
                    let ratingText = "";

                    for (let i = 0; i < 5; i++) ratingText += i < meal.getRating() ? "★" : "☆";

                    mealText += `\`€ ${meal.getPrice().toFixed(2)}\` ${ratingText} ${meal.getName()}\n`;
                });

                if (mealText == "") mealText = "`---`";

                const weekDay = mealDay.getDate().toLocaleDateString("de-DE", { weekday: "long" });
                const date = mealDay.getDate().toLocaleDateString("de-DE");

                messageEmbed.addField(`${weekDay} (${date})`, mealText);
            });

            message.channel.send(messageEmbed);
        });
    }

    getRequiredPermission(): Permission {
        return Permission.MEAL_PLAN;
    }
}