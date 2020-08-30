class OverwolfPlugin {
  constructor(pluginName) {
    this._pluginInstance = null;
    this._pluginName = pluginName;
  }

  get instance() {
    return this._pluginInstance;
  }

  get initialized() {
    return this._pluginInstance !== null;
  }

  async initialize() {
    return new Promise(async (resolve, reject) => {
      overwolf.extensions.current.getExtraObject(this._pluginName, res => {
        if (!res.success) {
          return reject(res.error);
        }

        this._pluginInstance = res.object;
        resolve(null);
      });
    });
  }
}