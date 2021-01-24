# Prepare the Discord Application

Login into your Discord Developer account, create a new application. The application name will be the "Playing.." shown on Discord.

Each application has an Application ID, you will use it to initialize the Discord RPC Client.

Upload your assets: every image has a name, called "key" in Discord language. You can use any image as Large or Small image.

The RPC is composed by:
- Details
- State
- Large Image Key
- Large Image Text (shown as tooltip on hover)
- Small Image Key (shown on bottom right corner of the Large Image)
- Small Image Text (shown as tooltip on hover)

# Compile the project

Open the `DiscordRPCPlugin.csproj` with Visual Studio 2019, compile it and copy `DiscordRPCPlugin.dll, DiscordRPC.dll and Newtonson.Json.dll` inside your app, for example a `plugins` directory.

This plugin uses https://github.com/Lachee/discord-rpc-csharp to communicate with Discord.

# API

The callback style is the same used commonly on Overwolf API: 

```json
{ success: bool, status: "success|error" }
```

## Methods

- `initialize(discordApplicationID, callback)`: Initialize the Discord RPC Client
- `updatePresence(details, state, largeImageKey, largeImageText, 
smallImageKey, smallImageText, callback)`: Update the Rich Presence
- `dispose(callback)`: Shutdown the RPC Client

## Events

- `onClientReady`: Fired when RPC Client is read, sends the current Discord User
- `onPresenceUpdate`: Fired when RPC is updated
- `onClientError`: Fired when RPC Client has errors

# Use the Plugin

## Declare the plugin

In `manifest.json` you must declare the plugin under the `extra-objects` property:

```json
"DiscordRPCPlugin": {
    "file": "plugins/DiscordRPCPlugin.dll",
    "class": "overwolf.plugins.DiscordRPCPlugin"
}
```

## Acquire the plugin from JS

```js
const discordRPCPlugin = await pluginService.getPlugin('DiscordRPCPlugin');

discordRPCPlugin.onClientReady.addListener(console.log);
discordRPCPlugin.onPresenceUpdate.addListener(console.log);
discordRPCPlugin.onClientError.addListener(console.error);

discordRPCPlugin.initialize('YOUR APPLICATION ID', console.log);
```

## Update the Rich Presence

```js
discordRPCPlugin.updatePresence('My Details', 'My state', 'large_image_key', 'Large image', 'small_image_key', 'Small image', console.log);
```