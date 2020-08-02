using Fleck;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace overwolf.plugins
{
    public class WebSocketServerPlugin
    {
        public event Action<object> onMessage;
        private ConcurrentDictionary<Guid, IWebSocketConnection> sockets = new ConcurrentDictionary<Guid, IWebSocketConnection>();
        public void openServer(int port, bool secure, Action<object> callback)
        {
            try
            {
                var server = new WebSocketServer("ws://0.0.0.0:9977/dashboard");
                server.Start(socket =>
                {
                    socket.OnOpen = () =>
                    {
                        sockets.TryAdd(socket.ConnectionInfo.Id, socket);

                        sendMessageToApp("Client connected");
                    };
                    socket.OnClose = () => {

                        sockets.TryRemove(socket.ConnectionInfo.Id, out IWebSocketConnection removedSocket);

                        sendMessageToApp("Client disconnected");
                    };
                    socket.OnMessage = message =>
                    {
                        sendMessageToApp(message);
                    };
                });

                callback(new { status = "success" });            
            }
            catch (Exception ex)
            {
                callback(new { status = "error", message = ex.Message });
            }
        }

        public void broadcast(string message, Action<object> callback)
        {
            try
            {
                foreach (var socket in sockets)
                {
                    if (socket.Value.IsAvailable)
                    {
                        socket.Value.Send(message);
                    }
                }

                callback(new { status = "success" });
            }
            catch (Exception ex)
            {
                callback(new { status = "error", message = ex.Message });
            }
        }

        public void sendMessageToApp(string message)
        {
            onMessage(new { message = message });
        }
    }
}
