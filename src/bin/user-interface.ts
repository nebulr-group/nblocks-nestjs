import { createInterface, Interface } from 'readline';
import * as chalk from "chalk";

export class UserInterface {

    private interface: Interface;

    constructor() {
        this.interface = createInterface({
            input: process.stdin,
            output: process.stdout
        }
        )
    }

    close(): void {
        this.interface.close();
    }

    async ask(question: string, defaultAnswer?: string): Promise<string> {
        const q = defaultAnswer ? `${question} (${defaultAnswer})` : question;
        return new Promise((resolve, reject) => {
            this.interface.question(chalk.green(`${q}: `), (answer) => {
                if (!answer || answer.length === 0)
                    resolve(defaultAnswer);
                else
                    resolve(answer);
            });
        });
    }
}