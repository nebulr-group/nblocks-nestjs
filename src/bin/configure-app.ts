import { Exec } from "./exec";
import * as chalk from "chalk";
import { AppModel, PlatformClient } from "@nebulr-group/nblocks-ts-client";
import { UserInterface } from "./user-interface";
import axios from 'axios';
import { Setup } from "./setup";

export class AppConfigurator {
    private readonly DIR = "nblocks/config";

    private readonly MAIN_ENV_FILE_NAME = `${this.DIR}/main.env`;
    private readonly APP_MODEL_FILE_NAME = `${this.DIR}/app-configuration.json`;

    async run(setup: Setup): Promise<void> {
        const ui = new UserInterface();
        const answer = await ui.ask("Do you want to automatically create your own app?", "y");
        if (answer === 'y') {
            const appName = await ui.ask("Give your new app a name.", "My app");
            const email = await ui.ask("Enter your email. We'll send you an onboarding email for your first demo tenant");
            const proceed = await ui.ask(`We'll create a new app named '${appName}' and email '${email}'. Is that okey?`, 'y');
            if (proceed === 'y') {
                console.log(chalk.green("Creating your app..."));
                const newKey = await this.signup(appName, email);
                setup.addEnvFiles(newKey);
                await this.getAppConfiguration();
            } else {
                console.log(chalk.green("App creation aborted. Will use demo credentials"));
                await this.getAppConfiguration();
            }

        } else {
            console.log(chalk.green("Will use demo credentials"));
            await this.getAppConfiguration();
        }
        ui.close();
    }

    async getAppConfiguration(): Promise<void> {
        console.log(chalk.green("Downloading app configuration..."));
        const client = this.getPlatformClient();
        const model = await client.getApp();
        Exec.writeFile(this.APP_MODEL_FILE_NAME, JSON.stringify(model, null, "\t"));
    }

    async pushAppConfiguration(): Promise<void> {
        console.log(chalk.green("Pushing app model..."));
        const client = this.getPlatformClient();
        const model: AppModel = JSON.parse(Exec.readFile(this.APP_MODEL_FILE_NAME));
        await client.updateApp(model);
        console.log(chalk.green("App model stored, That's all!"));
    }

    private async signup(name: string, email: string): Promise<string> {
        const fileContent = Exec.readFile(this.MAIN_ENV_FILE_NAME);
        const credentials = this.parseCredentialsFromString(fileContent);
        const response = await axios.post<{ apiKey: string, app: Record<string, unknown> }>(`${credentials.NBLOCKS_CORE_API_URL}/nblocks/testApp`, { name, email });
        return response.data.apiKey;
    }

    private getPlatformClient(): PlatformClient {
        const fileContent = Exec.readFile(this.MAIN_ENV_FILE_NAME);
        const credentials = this.parseCredentialsFromString(fileContent);
        return new PlatformClient(credentials.NBLOCKS_API_KEY, 1, false, credentials.NBLOCKS_CORE_API_URL.includes("stage") ? "STAGE" : "PROD");
    }

    private parseCredentialsFromString(content: string): AppCredentials {
        const credentials: AppCredentials = new AppCredentials();
        content.split("\n").forEach(line => {
            const data = line.split("=");
            if (data.length === 2) {
                const key = data[0].replace(/\"/g, "").trim();
                const value = data[1].replace(/\"/g, "").trim();
                switch (key) {
                    case "NBLOCKS_CORE_API_URL":
                        credentials.NBLOCKS_CORE_API_URL = value;
                        break;

                    case "NBLOCKS_API_KEY":
                        credentials.NBLOCKS_API_KEY = value;
                        break;
                }
            }
        });

        return credentials;
    }
}

class AppCredentials {
    NBLOCKS_CORE_API_URL: string;
    NBLOCKS_API_KEY: string;
}