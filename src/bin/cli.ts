#!/usr/bin/env node
import * as chalk from "chalk";
import { AppConfigurator } from "./configure-app";
import { Setup } from "./setup";
import { MESSAGES } from './ui/messages';

console.log(chalk.cyan(MESSAGES.WELCOME));
switch (process.argv[2]) {
    case "setup":
    case "SETUP":
        new Setup().run();
        break;

    case "push-app-configuration":
        console.log(chalk.green("Running PUSH-APP-CONFIGURATION..."));
        new AppConfigurator().pushAppConfiguration()
        break;

    case "help":
    default:
        console.log(chalk.green("Usage: npx @nebulr-group/nebulr-auth-api setup | push-app-configuration | help"));
        break;
}