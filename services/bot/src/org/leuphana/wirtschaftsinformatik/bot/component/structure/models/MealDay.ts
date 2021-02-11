import { Meal } from "./Meal";

export class MealDay {
    private date: Date;
    private meals: Array<Meal>;

    public constructor() {
        this.meals = [];
    }

    public setDate(date): void {
        this.date = date;
    }

    public getDate(): Date {
        return this.date;
    }

    public setMeals(meals): void {
        this.meals = meals;
    }

    public getMeals(): Array<Meal> {
        return this.meals;
    }
}