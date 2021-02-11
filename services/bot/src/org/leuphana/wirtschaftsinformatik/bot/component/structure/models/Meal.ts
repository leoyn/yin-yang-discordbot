export class Meal {
    private id: string;
    private name: string;
    private price: number;
    private rating: number;

    public setId(id: string): void {
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setPrice(price: number): void {
        this.price = price;
    }

    public getPrice(): number {
        return this.price;
    }

    public setRating(rating: number): void {
        this.rating = rating;
    }

    public getRating(): number {
        return this.rating;
    }
}