# C# Plugins

## WebSocketServer

Add WebSocket feature to your app, openining a websocket on port 9977, works with socket-service.js on Overwolf side, enabling the app to receive and send messages via the socket.
On C# part uses Fleck to manage websockets connections.

Be aware socket-service.js contains specific code from my app.

## GameInstallationManager

Read Steam Library files and detecte if a game is installed or not given its name.
Uses Gameloop.Vdf nuget to parse VDF files and RegistryReader to read the registry

## RegistyReader

Simple utility to read from Windows Registry
