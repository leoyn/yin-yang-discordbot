import { RSSItem } from "./RSSItem";

export class RSSFeed {
    private id: number;
    private url: string;
    private items: Array<RSSItem>;
    private channelId: string;

    constructor() {
        this.items = [];
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public setUrl(url: string): void {
        this.url = url;
    }

    public getUrl(): string {
        return this.url;
    }

    public setItems(items: Array<RSSItem>): void {
        this.items = items;
    }

    public getItems(): Array<RSSItem> {
        return this.items;
    }

    public setChannelId(channelId: string): void {
        this.channelId = channelId;
    }

    public getChannelId(): string {
        return this.channelId;
    }
}