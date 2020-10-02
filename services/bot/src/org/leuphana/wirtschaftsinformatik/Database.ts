import * as MySQL from "mysql";

export class Database {
    private static instance: Database;
    private connection;

    public static getInstance(): Database {
        if (Database.instance == null) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public connect(hostname: string, username: string, password: string, database: string): void {
        this.connection = MySQL.createConnection({
            host: hostname,
            user: username,
            password: password,
            database: database,
            charset: "utf8mb4",
        });
    }

    public query(sql: string, ...parameters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, parameters, (error, results, _) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }
}
