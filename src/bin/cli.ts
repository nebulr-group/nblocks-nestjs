#!/usr/bin/env node
import * as chalk from "chalk";
import { AppConfigurator } from "./configure-app";
import { Setup } from "./setup";
import { MESSAGES } from './ui/messages';
import * as dotenv from 'dotenv';

dotenv.config({ path: Setup.MAIN_ENV_FILE_NAME });
console.log(chalk.cyan(MESSAGES.WELCOME));

switch (process.argv[2]) {
    case "setup":
    case "install":
    case "SETUP":
        new Setup().run();
        break;

    case "get-app":
    case "get-app-configuration":
        //console.log(chalk.green("Running PUSH-APP-CONFIGURATION..."));
        new AppConfigurator().getAppConfiguration();
        break;

    case "push-app":
    case "push-app-configuration":
        //console.log(chalk.green("Running PUSH-APP-CONFIGURATION..."));
        new AppConfigurator().pushAppConfiguration();
        break;

    case "create-app":
    case "create-app-configuration":
        //console.log(chalk.green("Running PUSH-APP-CONFIGURATION..."));
        new AppConfigurator().runCreateApp(new Setup());
        break;

    case "help":
    default:
        console.log(chalk.green("Usage: npx @nebulr-group/nblocks-nestjs setup | get-app-configuration | push-app-configuration | create-app-configuration | help"));
        break;
}