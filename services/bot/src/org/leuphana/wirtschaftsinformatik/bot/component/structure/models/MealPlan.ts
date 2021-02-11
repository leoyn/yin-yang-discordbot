import { MealDay } from "./MealDay";

export class MealPlan {
    private mealDays: Array<MealDay>;

    public constructor() {
        this.mealDays = [];
    }

    public setMealDays(mealDays): void {
        this.mealDays = mealDays;
    }

    public getMealDays(): Array<MealDay> {
        return this.mealDays;
    }
}