/* global overwolf */

import truckyService from './trucky-service';
import windowsService from './windows-service';

class SocketService {
    constructor() {
        overwolf.extensions.current.getExtraObject("WebSocketServer", (getPluginResult) => {
            if (getPluginResult.status === "success") {
                this._plugin = getPluginResult.object;

                truckyService.writeLog('WebSocketServer plugin loaded');

                this._plugin.onMessage.addListener(this.onMessageReceived.bind(this));

                this._plugin.openServer(9977, false, (result) => {
                    if (result.status == "success") {
                        truckyService.writeLog('WebSocket server opened');
                    }
                    else {
                        truckyService.writeLog('Cannot open WebSocket server:' + result.message);
                    }
                });
            }
        });
    }

    onMessageReceived(message) {
        truckyService.writeLog('Recevied mesage from websocket server: ' + JSON.stringify(message));

        try {
            var messageContent;

            if (message.message)
                messageContent = JSON.parse(message.message);

            switch (messageContent.action) {
                case 'report':
                    window.dataService.sendReport(messageContent.content);
                    break;
                case 'feature':
                    switch (messageContent.content) {
                        case 'play-radio':
                            if (window.radioService.isPlaying) window.radioService.stopRadio();
                            else window.radioService.playRadio(window.settings.defaultRadio);
                            break;
                        case 'record-replay':
                            window.dataService.startVideoCapture();
                            break;
                    }
                    break;
                case 'window':
                    windowsService.toggleWindow(messageContent.content);
                    break;
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }

    broadcast(message) {
        this._plugin.broadcast(JSON.stringify(message), (result) => {
            //truckyService.writeLog('Message broadcast result: ' + JSON.stringify(result));
        });
    }
}

export default SocketService;