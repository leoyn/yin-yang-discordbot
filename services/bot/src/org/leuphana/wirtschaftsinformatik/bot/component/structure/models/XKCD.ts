export class XKCD {
    private id: number;
    private title: string;
    private imageUrl: string;

    public setId(id: number): void {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getTitle(): string {
        return this.title;
    }

    public setImageUrl(imageUrl: string): void {
        this.imageUrl = imageUrl;
    }

    public getImageUrl(): string {
        return this.imageUrl;
    }
}