import { Exec } from "./exec";
import * as chalk from "chalk";
import { AppConfigurator } from "./configure-app";

/** This class setups the prerequisites for running the nblocks plugin the first time */
export class Setup {
    private readonly DIR = "nblocks/config";
    private readonly DIR_EXISTS_CMD = `test -d ${this.DIR}`;
    private readonly CREATE_DIR_CMD = `mkdir -p ${this.DIR}`;

    private readonly MAIN_ENV_FILE_NAME = `${this.DIR}/main.env`;
    private readonly MAIN_ENV_FILE_CONTENT = 'NBLOCKS_CORE_API_URL="https://account-api-stage.nebulr-core.com"\nNBLOCKS_API_KEY =';
    private readonly MAIN_ENV_DEMO_KEY = '61c462cd422c2300088d369d_8befe1319cd81f7a6a43e1a23ba5d4daf18202637710fe5511e57190f916dc41';

    private readonly RESOURCE_MAPPINGS_FILE_NAME = `${this.DIR}/resourceMappings.json`;
    private readonly RESOURCE_MAPPINGS_FILE_CONTENT = '{\n"graphql/**": "ANONYMOUS",\n"/**": "ANONYMOUS"\n}';

    run(): void {
        try {
            console.log(chalk.green("Adding required configuration..."));
            this.checkCreateDir();
            this.addEnvFiles(this.MAIN_ENV_DEMO_KEY);
            this.addResourceMappingsFile();
            new AppConfigurator().run(this).then(() => {
                console.log(chalk.green("That's all! Get back to the readme"));
            })
        } catch (error) {
            console.error(chalk.red(`Oh oh! ${(error as Error).message}\nExiting...`));
        }
    }

    private checkCreateDir(): void {
        if (Exec.run(this.DIR_EXISTS_CMD, false))
            throw new Error(`Directory ${this.DIR} already exists. This project has probably already been setup!`)

        Exec.run(this.CREATE_DIR_CMD, true);
    }

    addEnvFiles(key: string): void {
        const content = `${this.MAIN_ENV_FILE_CONTENT} ${key}`;
        Exec.writeFile(this.MAIN_ENV_FILE_NAME, content);
        console.log(chalk.green("Env file updated..."));
        return;
    }

    private addResourceMappingsFile(): void {
        Exec.writeFile(this.RESOURCE_MAPPINGS_FILE_NAME, this.RESOURCE_MAPPINGS_FILE_CONTENT);
        return;
    }
}