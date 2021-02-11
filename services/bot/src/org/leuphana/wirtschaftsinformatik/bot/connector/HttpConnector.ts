import { rejects } from "assert";
import * as https from "https";
import { HttpResponse } from "./HttpResponse";

export class HttpConnector {
    private static instance: HttpConnector;

    public static getInstance(): HttpConnector {
        if (HttpConnector.instance == null) {
            HttpConnector.instance = new HttpConnector();
        }

        return HttpConnector.instance;
    }

    public get(url): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            https.get(url, response => {
                let body = "";

                response.on("data", chunk => {
                    body += chunk;
                });

                response.on("end", () => {
                    const httpResponse = new HttpResponse();
                    httpResponse.setText(body);
                    resolve(httpResponse);
                });
            }).on("error", (err) => {
                reject(err);
            }).end();
        });
    }
}