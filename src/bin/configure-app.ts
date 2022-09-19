import { Exec } from "./exec";
import * as chalk from "chalk";
import { AppModel, PlatformClient } from "@nebulr-group/nblocks-ts-client";
import { UserInterface } from "./user-interface";
import axios from 'axios';
import { Setup } from "./setup";
import { MESSAGES } from './ui/messages';
import * as ora from 'ora';
import { SPINNER } from './ui/spinner';

export class AppConfigurator {

    private readonly APP_MODEL_FILE_NAME = `${Setup.DIR}/app-configuration.json`;

    private readonly ui: UserInterface;

    constructor() {
        this.ui = new UserInterface();
    }

    async runSetup(setup: Setup): Promise<void> {
        console.log(chalk.cyan(MESSAGES.CREATE_APP_INSTRUCTION));
        const answer = await this.ui.ask("> Do you want to create a new Nblocks app? Skip this if you alread have one.", true, "y");
        if (answer === 'y') {
            await this._createApp(setup);
        } else {
            console.log(chalk.red(`No app was created. Please make sure to add your existing credentials to the ENV file located: '${Setup.MAIN_ENV_FILE_NAME}' before you start the server`));
            //await this.getAppConfiguration();
        }
        this.ui.close();
    }

    async runCreateApp(setup: Setup): Promise<void> {
        await this._createApp(setup);
        this.ui.close();
    }

    async runCreateTenant(): Promise<void> {
        await this._createTenant();
        this.ui.close();
    }

    async getAppConfiguration(): Promise<void> {
        const spinner = this.getSpinner(MESSAGES.DOWNLOADING_CONFIG);
        spinner.start();
        const model = await this.getPlatformClient().getApp();
        Exec.writeFile(this.APP_MODEL_FILE_NAME, JSON.stringify(model, null, "\t"));
        spinner.succeed();
        this.ui.close();
    }

    async pushAppConfiguration(): Promise<void> {
        console.log(chalk.green("Pushing Nblocks app model..."));
        const model: AppModel = JSON.parse(Exec.readFile(this.APP_MODEL_FILE_NAME));
        await this.getPlatformClient().updateApp(model);
        console.log(chalk.green("App model stored in Nblocks cloud. That's all!"));
        this.ui.close();
    }

    private async _createApp(setup: Setup): Promise<void> {
        const appName = await this.ui.ask("> Give your new app a name.\n  This name is what your users will see when Nblocks interacts with them through emails etc.\n  App name can be changed later", true, "My Nblocks App");
        const email = await this.ui.ask("> Enter your email", false);
        console.info('');
        const spinner = this.getSpinner(MESSAGES.CREATING_APP);
        spinner.start();
        console.log(chalk.green("Creating app..."));
        const response = await axios.post<{ apiKey: string, app: Record<string, unknown> }>(`${process.env.NBLOCKS_CORE_API_URL}/nblocks/testApp`, { name: appName, email });
        const newKey = response.data.apiKey;
        spinner.succeed();
        setup.setEnvFileContent(newKey);
        await this.getAppConfiguration();
        console.info(chalk.cyan(MESSAGES.PACKAGE_MANAGER_INSTALLATION_APP_CREATED(email)));
    }

    private async _createTenant(): Promise<void> {
        return;
    }

    private getPlatformClient(): PlatformClient {
        return new PlatformClient(process.env.NBLOCKS_API_KEY, 1, process.env.NBLOCKS_DEBUG === '*' ? true : false,);
    }

    private getSpinner(message: string) {
        return ora({
            spinner: SPINNER,
            text: message
        })
    }
}