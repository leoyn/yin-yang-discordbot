export class RSSItem {
    private id: number;
    private guid: string;
    private title: string;
    private description: string;
    private url: string;
    private image: string;
    private date: Date;
    
    public setId(id: number): void {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public setGuid(guid: string): void {
        this.guid = guid;
    }

    public getGuid(): string {
        return this.guid;
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getTitle(): string {
        return this.title;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getDescription(): string {
        return this.description;
    }

    public setUrl(url: string): void {
        this.url = url;
    }

    public getUrl(): string {
        return this.url;
    }

    public setImage(image: string): void {
        this.image = image;
    }

    public getImage(): string {
        return this.image;
    }

    public setDate(date: Date): void {
        this.date = date;
    }

    public getDate(): Date {
        return this.date;
    }
}