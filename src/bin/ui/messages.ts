import { EMOJIS } from './emojis';

export const MESSAGES = {
  WELCOME: `${EMOJIS.ZAP}${EMOJIS.ZAP} Welcome to Nblocks NPX scripts! ${EMOJIS.ZAP}${EMOJIS.ZAP}`,
  SETUP_START: 'We will setup all dependencies in a few seconds...',
  RUNNING_SETUP: 'Running SETUP...',
  PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `Adding required dependencies... ${EMOJIS.COFFEE}`,
  CREATE_APP_INSTRUCTION: '\n- Now you can create your brand new own Nblocks App and get the new credentials. \n- Or you can choose to use our Demo Nblocks App playground which is shared accross all testers.',
  PACKAGE_MANAGER_INSTALLATION_FAILED: `${EMOJIS.SCREAM} Packages installation failed, see above`,
  PACKAGE_MANAGER_INSTALLATION_EMAIL_SENT: (email: string) => `\n${EMOJIS.MAILBOX_WITH_EMAIL} We sent you an onboarding email for your first demo user to ${email}.\nThere's no point clicking it now before you've completed the plugin installation.\nDon't worry :) the Quick start will go through this step later.`,
  PACKAGE_MANAGER_INSTALLATION_SUCCEED: `\n${EMOJIS.ROCKET} That\'s all! \n${EMOJIS.PRAY} Thanks for installing Nblocks! \n${EMOJIS.POINT_RIGHT} Get back to the backend installation part of the Quick start: `,
  QUICKSTART_LINK_IMPORT_THE_MODULE: '> https://nebulr-group.github.io/nblocks-docs/docs/quickstart#backend',
  PACKAGE_MANAGER_INSTALLATION_ERROR: (error: string) =>
    `\nOh oh! ${error}\nExiting...`,
  DIR_EXIST_MESSAGE: (directory: string) =>
    `Directory ${directory} already exists. This project has probably already been setup!`,
  ENV_FILE_UPDATED: (fileName: string) => `\nUPDATED: Env file ${fileName}\n`,
  CREATING_APP: `Creating your Nblocks app... ${EMOJIS.COFFEE}`,
  DOWNLOADING_CONFIG: `Downloading Nblocks app configuration..." ${EMOJIS.COFFEE}`,
};
