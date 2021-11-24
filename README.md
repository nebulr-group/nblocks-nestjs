# NBlocks for NestJS

Welcome to NBlocks, the platform toolbox from Nebulr made by developers for developers. If you're new to this concept, head over to our [site](https://nblocks.dev) and check out the capabilities.

[nblocks.dev](https://nblocks.dev)

This plugin gives a plug-n-play experience for **NBlocks** on the **NestJS** platform. It enables you to faster build your app using our toolbox of features. Also it delivers all the backend / API functionality to power the NBlocks UI-plugins. If you haven't looked them in you should as it might save you a bunch of time building your app UI. See the [NBlocks download](https://nblocks.dev/download) page for a list of supported UI-plugins or Plug-n-play experiences for other technologies.

## Plug-n-play features

- User authentication
- Gatekeeping and Role based authorization (RBAC)
- User management
- Tenancy

## Install

```javascript
npm i @nebulr-group/nblocks-nestjs
```

## Quick start

1. From your project root, run

```javascript
npx @nebulr-group/nblocks-nestjs setup
```

to get the initial config structure in place. More on that later.

2. Import the `NBlocksModule` in your root App module or what you call the top most module for your project.

```javascript
import { NBlocksModule } from '@nebulr-group/nblocks-nestjs';

@Module({
  imports: [NBlocksModule],
})
export class AppModule {}
```

3. Start your app and expect it to work exactly the same as before!

## Customizing

The setup script created just the minimal configuration needed for the project to start. The configurations where placed inside a `nebulr/config` folder in your project root.

- `main.env` - Contains your unique NBlocks credentials. For now you can use the shared demo credentials.
- `app-configuration.json` - This is the current configuration of your app in the NBlocks space! You can make changes to this model and push it to NBlocks. More on that below.
- `resourceMappings.json` - Configures how each of your controller and/or GraphQL resolver entrypoints maps to a certain role privilege. More on that below.

### Setting up your own app

Already you have been granted access to our demo app, using the credentials added into `main.env` by the setup script.
With these credentials the setup script has pulled the current app configuration into `nebulr/config/app-configuration.json` which you can customize to your own needs and push it back to NBlocks.

Once you've done changing the app model you can persist the changes back to NBlocks by running:

```javascript
npx @nebulr-group/nblocks-nestjs push-app-configuration
```

### Role based authorization (RBAC)

Each role you configure for your app can grant one of many privilegues. See `roles` in `nebulr/config/app-configuration.json`. When users login NBlocks will automatically grant their set of privilegues depending the role.

The `resourceMappings.json` is the heart of the RBAC configuration. It supports both GraphQL queries/mutations as well as HTTP requests. You can use wildcards to allow or dissallow a whole controller or route. Here's how one could look.

```json
{
    "graphql/readCase":"CASE_READ",
    "graphql/createCase":"CASE_WRITE",
    "/secret": "SECRET_READ"
    "/**": "ANONYMOUS"
}
```

Above configuration will demand authenticated users to have the privilegue `CASE_READ` when calling the GraphQL query `readCase` and `SECRET_READ` when calling `HTTP GET|PUT|POST /secret`. Any HTTP call to any other controller action (/\*\*) will be treated as an anonymous call.

In the quick start part the script did just configure all endpoints to allow `ANONYMOUS` calls meaning the built in gatekeeping will not activate any authentication nor resource authorization. To activate gatekeeping, try to change the privilegues to `USER_READ`. This will have all calls that are missing auth cotext to render back `401 Unauthorized` or `403 Forbidden`. If you're already using any of our NBlocks UI plugins, you'll be redirected to the login screen immediately after making such request.

If you wish to do your own role check in your own code you'll always have access to the role data of the currentUser data via `NebulrAuthService`. See [Get the current user](get-the-current-user)

## Deep dive

This plugin is written in typescript and is published with built in types and documentation. It wraps the functionality provided from `@nblocks/core-client` together with the awesome features of NestJS into a easy to use package. We're following the semver convention for future releases.

### Get the current user

Use NebulrAuthService to get the current user, tenant information and other auth data.

```javascript
constructor(
    private readonly nebulrAuthService: NebulrAuthService
  ) {}
...
const user = this.nebulrAuthService.getCurrentUser();
console.log(`Hi, I'm ${user.fullName} with the role ${user.role} in workspace ${user.tenant.name}`)
```

### Anonymous calls

Anonymous calls will not activate gatekeeping or RBAC.
If you've configured the endpoint to be `ANONYMOUS` the currentUser will be regarded as an anonymous user without any valuable data.

### Using the NBlocks core client directly

NBlocks API comes with some powerful tools and helpers. You can always get access the NBlocks core client to issue calls straight to NBlocks API. The client is already loaded with your app credentials and ready to use.

```javascript
constructor(
    private readonly clientService: ClientService
  ) {}
...
const client = this.clientService.client;
await client.tenants.list();
```

See [nblocks-ts-client](https://github.com/nebulr-group/nblocks-ts-client) project readme for more client examples.

### Cherry picking functionality

Instead of importing `NBlocksModule` containing the full set of tools you can import key feature areas individually.

- `AuthModule`
- `UserModule`
- `TenantModule`
- `FileModule`
- `SharedModule`

## FAQ

### I already have a module named X, how can I still import your module

Let's say your project already defines a module named `SharedModule`. You can then alias the import like this `import {SharedModule as NBlocksSharedModule} from from '@nebulr-group/nblocks-nestjs';`

#TODO

- Have inline code documentation propagate to host project
- Remove GraphQL and other not used stuff
- Seems like NBlocksErrorToExceptionFilter are not registered in NW. Is NWs globals clearing this list?
- Platform-lib as peer dependency?!
