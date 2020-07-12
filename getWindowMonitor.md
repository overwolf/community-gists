```js
/**
 * get monitor of the window
 * @returns {Promise<*>}
 */
async function getWindowMonitor(name) {
    return new Promise(async (resolve, reject) => {
        try {
            overwolf.windows.obtainDeclaredWindow(name, (result) => {
                if(result.status === 'success')
                {
                    overwolf.utils.getMonitorsList((monitors) => {
                        if(monitors.success === true)
                        {
                            for(let i = 0; i < monitors.displays.length; i++)
                            {
                                let display = monitors.displays[i];

                                let xMin    = display.x;
                                let xMax    = xMin + display.width;

                                if(result.window.left >= xMin && result.window.left <= xMax)
                                {
                                    let yMin    = display.y;
                                    let yMax    = yMin + display.height;

                                    if(result.window.top >= yMin && result.window.top <= yMax)
                                    {
                                        resolve(display);
                                        return;
                                    }
                                }
                            }
                        }

                        reject(monitors);
                    });
                }
                else
                {
                    reject(result);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}
```
