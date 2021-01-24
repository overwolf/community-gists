using DiscordRPC;
using DiscordRPC.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace overwolf.plugins
{
    public class BaseCallbackResponse
    {
        public BaseCallbackResponse()
        {

        }

        public BaseCallbackResponse(string status, bool success)
        {
            this.status = status;
            this.success = success;
        }

        public string status { get; set; } = "success";
        public bool success { get; set; } = true;
    }

    public class SuccessCallbackResponse : BaseCallbackResponse
    {
        public SuccessCallbackResponse() : base("success", true)
        {
        }
    }

    public class ErrorCallbackResponse : BaseCallbackResponse
    {
        public ErrorCallbackResponse() : base("error", false) { }
        public string error { get; set; }
    }

    public class OnClientReadyCallbackResponse : BaseCallbackResponse
    {
        public OnClientReadyCallbackResponse() : base("success", true)
        {
        }

        public User user { get; set; }
    }

    /// <summary>
    /// 
    /// </summary>
    public class DiscordRPCPlugin
    {
        private DiscordRpcClient client = null;
        private readonly DateTime startTime = DateTime.Now;
        public event Action<object> onClientReady;
        public event Action<object> onPresenceUpdate;
        public event Action<object> onClientError;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationID"></param>
        /// <param name="callback"></param>
        public void initialize(string applicationID, Action<object> callback)
        {
            client = new DiscordRpcClient(applicationID);

            //Set the logger
            client.Logger = new ConsoleLogger() { Level = DiscordRPC.Logging.LogLevel.Warning };

            //Subscribe to events
            client.OnReady += (sender, e) =>
            {
                onClientReady?.Invoke(new OnClientReadyCallbackResponse() { user = e.User });
            };

            client.OnPresenceUpdate += (sender, e) =>
            {
                onPresenceUpdate?.Invoke(new SuccessCallbackResponse());
            };

            client.OnError += (sendere, e) =>
            {
                onClientError?.Invoke(new ErrorCallbackResponse() { error = e.Message });
            };

            //Connect to the RPC
            client.Initialize();

            callback(new SuccessCallbackResponse());
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="details"></param>
        /// <param name="state"></param>
        /// <param name="largeImageKey"></param>
        /// <param name="largeImageText"></param>
        /// <param name="smallImageKey"></param>
        /// <param name="smallImageText"></param>
        /// <param name="callback"></param>
        public void updatePresence(string details, string state, string largeImageKey, string largeImageText, string smallImageKey, string smallImageText, Action<object> callback)
        {
            if (client == null)
                callback(new ErrorCallbackResponse() { error = "Call initialize first" });

            client.SetPresence(new RichPresence()
            {
                Details = details,
                State = state,
                Assets = new Assets()
                {
                    LargeImageKey = largeImageKey,
                    SmallImageKey = smallImageKey,
                    LargeImageText = largeImageText,
                    SmallImageText = smallImageText
                },
                Timestamps = new Timestamps(startTime, DateTime.Now)              
            });

            callback(new SuccessCallbackResponse());
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="callback"></param>
        public void dispose(Action<object> callback)
        {
            if (client == null)
                callback(new ErrorCallbackResponse() { error = "Call initialize first" });

            client.Dispose();

            callback(new SuccessCallbackResponse());
        }
    }
}
