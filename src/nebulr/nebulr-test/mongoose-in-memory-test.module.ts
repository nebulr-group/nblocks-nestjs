import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      // The plugin (6.9.6) is unable to identify the docker linux version, therefore we override the config in package.json. Use below for setting for ENV Vars
      // export MONGOMS_VERSION=4.4.6
      // export MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.4.6.tgz
      mongod = new MongoMemoryServer();
      const uri = await mongod.getUri();
      console.log(`Running local in-memory MongoDB on uri: ${uri}`);
      // const port = await mongod.getPort();
      // const dbPath = await mongod.getDbPath();
      // const dbName = await mongod.getDbName();
      return {
        uri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) {
    await disconnect();
    await mongod.stop();
  }
};

// Allow for dynamic require from NebulrConfigModule
module.exports = {
  rootMongooseTestModule,
  closeInMongodConnection,
};
