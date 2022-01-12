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

    async ask(question: string, allowDefaultAnswer?: boolean, defaultAnswer?: string): Promise<string> {
        const q = defaultAnswer ? `${question} (${defaultAnswer})` : question;
        return new Promise((resolve, reject) => {
            this.interface.question(chalk.green(`${q}: `), async (answer) => {
                if (!answer || answer.length === 0) {
                    if (allowDefaultAnswer) {
                        resolve(defaultAnswer);
                    } else {
                        console.log(chalk.yellow("Please, provide value..."));
                        resolve(await this.ask(question, allowDefaultAnswer, defaultAnswer));
                    }
                }
                else {
                    resolve(answer);
                }
            });
        });
    }
}