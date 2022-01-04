import { EMOJIS } from './emojis';

export const MESSAGES = {
  WELCOME: `${EMOJIS.ZAP}${EMOJIS.ZAP} Welcome to NBlocks NPX scripts! ${EMOJIS.ZAP}${EMOJIS.ZAP}`,
  SETUP_START: 'We will setup all dependencies in a few seconds...',
  RUNNING_SETUP: 'Running SETUP...',
  PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `Adding required dependencies... ${EMOJIS.COFFEE}`,
  PACKAGE_MANAGER_INSTALLATION_FAILED: `${EMOJIS.SCREAM} Packages installation failed, see above`,
  PACKAGE_MANAGER_INSTALLATION_SUCCEED: `\n${EMOJIS.ROCKET} That\'s all! \n${EMOJIS.POINT_RIGHT} Get back to the readme`,
  PACKAGE_MANAGER_INSTALLATION_ERROR: (error: string) =>
    `\nOh oh! ${error}\nExiting...`,
  DIR_EXIST_MESSAGE: (directory: string) =>
    `Directory ${directory} already exists. This project has probably already been setup!`,
  ENV_FILE_UPDATED: (fileName: string) => `\nUPDATED: Env file ${fileName}\n`,
};
