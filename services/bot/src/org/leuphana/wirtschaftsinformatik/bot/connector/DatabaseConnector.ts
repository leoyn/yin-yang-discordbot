import {Client} from "pg";

export class DatabaseConnector {
    private static instance: DatabaseConnector;
    private client: Client;

    public static getInstance(): DatabaseConnector {
        if (DatabaseConnector.instance == null) {
            DatabaseConnector.instance = new DatabaseConnector();
        }

        return DatabaseConnector.instance;
    }

    public connect(hostname: string, port: number, username: string, password: string, database: string): void {
        this.client = new Client({
            user: username,
            host: hostname,
            database: database,
            password: password,
            port: port,
        });
        
        this.client.connect();
    }

    public query(sql: string, ...parameters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.query(sql, parameters, (error, results, _) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }
}
