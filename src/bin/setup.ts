import { Exec } from "./exec";
import * as chalk from "chalk";
import { AppConfigurator } from "./configure-app";


/** This class setups the prerequisites for running the nblocks plugin the first time */
export class Setup {
    private readonly DIR = "nebulr/config";
    private readonly DIR_EXISTS_CMD = `test -d ${this.DIR}`;
    private readonly CREATE_DIR_CMD = `mkdir -p ${this.DIR}`;

    private readonly MAIN_ENV_FILE_NAME = `${this.DIR}/main.env`;
    private readonly MAIN_ENV_FILE_CONTENT = 'NEBULR_PLATFORM_CORE_API_URL="https://account-api-stage.nebulr-core.com"\nNEBULR_PLATFORM_API_KEY = "605b603cfeb49f00082686b6_b8c38307bfb6f68a586ad9f0b3548020ba6edf4c49640ab65bf6451bba05f587"';

    private readonly RESOURCE_MAPPINGS_FILE_NAME = `${this.DIR}/resourceMappings.json`;
    private readonly RESOURCE_MAPPINGS_FILE_CONTENT = '{\n"graphql/**": "ANONYMOUS",\n"/**": "ANONYMOUS"\n}';

    run(): void {
        try {
            console.log(chalk.green("Adding required configuration..."));
            this.checkCreateDir();
            this.addEnvFiles();
            this.addResourceMappingsFile();
            new AppConfigurator().getAppConfiguration().then(() => {
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

    private addEnvFiles(): void {
        Exec.writeFile(this.MAIN_ENV_FILE_NAME, this.MAIN_ENV_FILE_CONTENT);
        return;
    }

    private addResourceMappingsFile(): void {
        Exec.writeFile(this.RESOURCE_MAPPINGS_FILE_NAME, this.RESOURCE_MAPPINGS_FILE_CONTENT);
        return;
    }
}