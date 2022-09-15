import { Exec } from "./exec";
import * as chalk from "chalk";
import { AppConfigurator } from "./configure-app";
import * as ora from 'ora';
import { MESSAGES } from './ui/messages';
import { SPINNER } from './ui/spinner';
import * as dotenv from 'dotenv';

/** This class setups the prerequisites for running the nblocks plugin the first time */
export class Setup {
    static readonly DIR = "nblocks/config";
    private readonly DIR_EXISTS_CMD = `test -d ${Setup.DIR}`;
    private readonly CREATE_DIR_CMD = `mkdir -p ${Setup.DIR}`;

    static readonly MAIN_ENV_FILE_NAME = `${Setup.DIR}/main.env`;

    /**
     * NBLOCKS_CORE_API_URL="http://account-api:3000" (NEW)
     * NEBULR_PLATFORM_CORE_API_URL="http://account-api:3000" (OLD, should be migrated to NEW)
     * NBLOCKS_API_KEY=
     */
    // private readonly MAIN_ENV_FILE_INITIAL_CONTENT = 'NBLOCKS_CORE_API_URL="https://account-api-stage.nebulr-core.com"\nNEBULR_PLATFORM_CORE_API_URL="https://account-api-stage.nebulr-core.com"\nNBLOCKS_API_KEY=';

    private readonly MAIN_ENV_FILE_INITIAL_CONTENT = 'NBLOCKS_CORE_API_URL="http://account-api:3000"\nNEBULR_PLATFORM_CORE_API_URL="http://account-api:3000"\nNBLOCKS_API_KEY=';

    private readonly RESOURCE_MAPPINGS_FILE_NAME = `${Setup.DIR}/resourceMappings.json`;
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
            this.addResourceMappingsFile();
            this.setEnvFileContent("EMPTY_KEY");
            spinner.start();
            this.installDependecies().then(() => {
                spinner.succeed();
                new AppConfigurator().runSetup(this).then(() => {
                    console.info(chalk.green(MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED));
                    console.info(chalk.yellow(MESSAGES.QUICKSTART_LINK_IMPORT_THE_MODULE));
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
            throw new Error(`Directory ${Setup.DIR} already exists. This project has probably already been setup!`)

        Exec.run(this.CREATE_DIR_CMD, true);
    }

    setEnvFileContent(appKey: string): void {
        const content = `${this.MAIN_ENV_FILE_INITIAL_CONTENT}${appKey}`;
        Exec.writeFile(Setup.MAIN_ENV_FILE_NAME, content);
        const result = dotenv.config({ path: Setup.MAIN_ENV_FILE_NAME });
        if (result.parsed['NBLOCKS_API_KEY'] != process.env['NBLOCKS_API_KEY']) {
            // Fixing overriding problem with dotenv
            // https://github.com/motdotla/dotenv/issues/199
            process.env['NBLOCKS_API_KEY'] = result.parsed['NBLOCKS_API_KEY'];
        }
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