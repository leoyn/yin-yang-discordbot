export class HttpResponse {
    private text: string;

    public setText(text: string): void {
        this.text = text;
    }

    public getText(): string {
        return this.text;
    }

    public toJson() {
        return JSON.parse(this.text);
    }
}