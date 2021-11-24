import { Exec } from "./exec";
import * as chalk from "chalk";
import { AppModel, PlatformClient } from "@nebulr-group/nblocks-ts-client";

export class AppConfigurator {
    private readonly DIR = "nebulr/config";

    private readonly MAIN_ENV_FILE_NAME = `${this.DIR}/main.env`;
    private readonly APP_MODEL_FILE_NAME = `${this.DIR}/app-configuration.json`;

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

    private getPlatformClient(): PlatformClient {
        const fileContent = Exec.readFile(this.MAIN_ENV_FILE_NAME);
        const credentials = this.parseCredentialsFromString(fileContent);
        return new PlatformClient(credentials.NEBULR_PLATFORM_API_KEY, 1, false, credentials.NEBULR_PLATFORM_CORE_API_URL.includes("stage") ? "STAGE" : "PROD");
    }

    private parseCredentialsFromString(content: string): AppCredentials {
        const credentials: AppCredentials = new AppCredentials();
        content.split("\n").forEach(line => {
            const data = line.split("=");
            if (data.length === 2) {
                const key = data[0].replace(/\"/g, "").trim();
                const value = data[1].replace(/\"/g, "").trim();
                switch (key) {
                    case "NEBULR_PLATFORM_CORE_API_URL":
                        credentials.NEBULR_PLATFORM_CORE_API_URL = value;
                        break;

                    case "NEBULR_PLATFORM_API_KEY":
                        credentials.NEBULR_PLATFORM_API_KEY = value;
                        break;
                }
            }
        });

        return credentials;
    }
}

class AppCredentials {
    NEBULR_PLATFORM_CORE_API_URL: string;
    NEBULR_PLATFORM_API_KEY: string;
}