import { Exec } from "./exec";
import * as chalk from "chalk";
import { AppConfigurator } from "./configure-app";
import * as ora from 'ora';
import { MESSAGES } from './ui/messages';
import { SPINNER } from './ui/spinner';

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
    // Dependency installation command templates
    private readonly INSTALL_DEPENDENCY_CMD = 'npm i @nebulr-group/nblocks-nestjs --silent';

    run(): void {
        const spinner = ora({
            spinner: SPINNER,
            text: MESSAGES.PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS,
        });

        try {
            console.log(chalk.green("Adding required configuration..."));
            this.checkCreateDir();
            this.addEnvFiles(this.MAIN_ENV_DEMO_KEY);
            this.addResourceMappingsFile();
            spinner.start();
            this.installDependecies().then(() => {
                spinner.succeed();
                new AppConfigurator().run(this).then(() => {
                    console.info(MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED);
                });
            });
        } catch (error) {
            spinner.fail();
            console.error(
                chalk.red(
                    MESSAGES.PACKAGE_MANAGER_INSTALLATION_ERROR((error as Error).message),
                ),
            );
            console.error(chalk.red(MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED));
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

    /**
    * This will install peer dependencies on the base of project's @angular/core version available
    */
    private async installDependecies(): Promise<void> {
        Exec.run(this.INSTALL_DEPENDENCY_CMD, true);
        return;
    }
}