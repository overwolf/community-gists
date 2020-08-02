/*global overwolf*/

import windowPosition from "./windowPosition";

const MOVED_WINDOWS_LOCALSTORAGE_KEY = "movedWindows";
const RESIZED_WINDOWS_LOCALSTORAGE_KEY = "resizedWindows";

function _obtainWindow(name) {
  return new Promise((resolve, reject) => {
    overwolf.windows.obtainDeclaredWindow(name, (response) => {
      if (response.status !== "success") {
        return reject(response);
      }

      resolve(response);
    });
  });
}

async function getCurrentWindow() {
  return new Promise((resolve, reject) => {
    overwolf.windows.getCurrentWindow((result) => {
      if (result.status === "success") {
        resolve(result.window);
      } else {
        reject(result);
      }
    });
  });
}

function restore(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      overwolf.windows.restore(name, (result) => {
        if (result.status === "success") {
          resolve(result);
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function dragMove(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      let window = await getCurrentWindow();
      overwolf.windows.dragMove(window.id, (result) => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function minimize(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      overwolf.windows.minimize(name, (result) => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function minimizeCurrentWindow() {
  return new Promise(async (resolve, reject) => {
    try {
      var result = await getCurrentWindow();
      overwolf.windows.minimize(result.id, (result) => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function closeCurrentWindow() {
  return new Promise(async (resolve, reject) => {
    try {
      var result = await getCurrentWindow();
      overwolf.windows.close(result.id, (result) => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function close(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      overwolf.windows.close(name, (result) => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function _getOpenWindows() {
  return new Promise(async (resolve, reject) => {
    try {
      overwolf.windows.getOpenWindows((result) => {
        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function closeApp() {
  return new Promise(async (resolve, reject) => {
    var openWindows = await _getOpenWindows();
    Object.keys(openWindows).forEach((w) => {
      if (w != "background") {
        overwolf.windows.close(w);
      }
    });
    overwolf.windows.close("background");
    resolve();
  });
}

function openWindow(windowName) {
  return new Promise((resolve, reject) => {
    overwolf.windows.obtainDeclaredWindow(windowName, (declaredWindow) => {
      if (
        declaredWindow.status == "success" &&
        (declaredWindow.window.stateEx != "normal" ||
          declaredWindow.window.stateEx != "minimized")
      ) {
        overwolf.windows.restore(declaredWindow.window.id, (window) => {
          //debugger;
          overwolf.windows.obtainDeclaredWindow(
            windowName,
            (declaredWindow) => {
              resolve({
                window: window,
                declaredWindow: declaredWindow,
              });
            }
          );
        });
      } else {
        reject();
      }
    });
  });
}

async function openWindowWithOptions(windowName, options = null) {
  var defaultOptions = {
    position: windowPosition.DEFAULT,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    fullWidth: false,
    fullHeight: false,
  };

  options = Object.assign({}, defaultOptions, options);

  var openWindowResult = await openWindow(windowName);

  return new Promise((resolve, reject) => {
    if (openWindowResult.declaredWindow.status == "success") {
      var window_id = openWindowResult.declaredWindow.window.id;
      //debugger;

      overwolf.utils.getMonitorsList(function(monitors) {
        var primaryMonitor = monitors.displays.find((d) => {
          return d.is_primary;
        });

        if (primaryMonitor != undefined) {
          if (
            !checkTrackedWindow(MOVED_WINDOWS_LOCALSTORAGE_KEY, windowName)
          ) {
            moveWindow(
              options,
              primaryMonitor,
              openWindowResult.declaredWindow.window
            );
          }

          if (options.fullWidth && !checkTrackedWindow(RESIZED_WINDOWS_LOCALSTORAGE_KEY, windowName)) {
            overwolf.windows.changeSize(
              { window_id: window_id, width: primaryMonitor.width, height: openWindowResult.declaredWindow.window.height },
              function(ch) {
                if (ch.status == "success") {
                }
              }
            );
          }

          if (options.fullHeight && !checkTrackedWindow(RESIZED_WINDOWS_LOCALSTORAGE_KEY, windowName)) {
            overwolf.windows.changeSize(
              { window_id: window_id, width: openWindowResult.declaredWindow.window.width, height: primaryMonitor.height },
              function(ch) {
                if (ch.status == "success") {
                }
              }
            ); 
          }
        }
        resolve();
      });
    }
  });
}

async function moveWindow(options, primaryMonitor, window) {
  return new Promise((resolve, reject) => {
    var x = 0;
    var y = 0;

    if (options.position == windowPosition.SCREEN_CENTER) {
      x = parseInt(primaryMonitor.width / 2 - window.width / 2);
      y = parseInt(primaryMonitor.height / 2 - window.height / 2);
    }

    if (
      options.position == windowPosition.CENTER ||
      options.position == windowPosition.TOP_CENTER
    ) {
      x = parseInt(primaryMonitor.width / 2 - window.width / 2);
    }

    if (options.position == windowPosition.BOTTOM_CENTER) {
      x = parseInt(primaryMonitor.width / 2 - window.width / 2);
      y = primaryMonitor.height - window.height;
    }

    if (options.position == windowPosition.TOP_LEFT) {
      x = 0;
      y = 0;
    }

    if (options.position == windowPosition.BOTTOM_RIGHT) {
      x = parseInt(primaryMonitor.width - window.width);
      y = primaryMonitor.height - window.height;
    }

    if (
      options.position == windowPosition.BOTTOM ||
      options.position == windowPosition.BOTTOM_LEFT
    ) {
      y = primaryMonitor.height - window.height;
    }

    if (
      options.position == windowPosition.RIGHT ||
      options.position == windowPosition.TOP_RIGHT
    ) {
      x = primaryMonitor.width - window.width;
    }

    if (options.marginTop) {
      y = y + options.marginTop;
    }

    if (options.marginRight) {
      x = x - options.marginRight;
    }

    if (options.marginLeft) {
      x = x + options.marginLeft;
    }

    if (options.marginBottom) {
      y = y - options.marginBottom;
    }

    overwolf.windows.changePosition(window.id, x, y, function(ch) {
      if (ch.status == "success") {
        resolve(ch);
      } else reject(ch);
    });
  });
}

function toggleWindow(windowName, hide = false) {
  overwolf.windows.obtainDeclaredWindow(windowName, (s) => {
    if (s.status == "success") {
      overwolf.windows.getWindowState(s.window.id, (ws) => {
        //debugger;
        if (ws.window_state == "normal") {
          if (hide) overwolf.windows.hide(s.window.id);
          else overwolf.windows.close(s.window.id);
        } else overwolf.windows.restore(s.window.id);
      });
    }
  });
}

async function getOpenWindowsNames() {
  return new Promise((resolve, reject) => {
    var ret = new Array();

    overwolf.windows.getOpenWindows((result) => {
      ret = Object.keys(result).map((m) => m);
      resolve(ret);
    });
  });
}

async function movedWindows()
{
  await trackWindow(MOVED_WINDOWS_LOCALSTORAGE_KEY);  
}

async function resizedWindow()
{
  await trackWindow(RESIZED_WINDOWS_LOCALSTORAGE_KEY);
}

async function trackWindow(key)
{
  var currentWindow = await getCurrentWindow();
  var trackedWindows = localStorage.getItem(key) == null ? [] : JSON.parse(localStorage.getItem(key));

  if (!trackedWindows.includes(currentWindow.name))
  {    
    trackedWindows.push(currentWindow.name);
    localStorage.setItem(key, JSON.stringify(trackedWindows));
  }
}

function checkTrackedWindow(key, name)
{
  var trackedWindows = localStorage.getItem(key) == null ? [] : JSON.parse(localStorage.getItem(key));
  
  return trackedWindows.includes(name);
}

export default {
  restore,
  dragMove,
  minimize,
  minimizeCurrentWindow,
  closeCurrentWindow,
  close,
  closeApp,
  openWindow,
  toggleWindow,
  openWindowWithOptions,
  getOpenWindowsNames,
  getCurrentWindow,
  obtainWindow: _obtainWindow,
  moveWindow,
  movedWindows,
  resizedWindow,
  getOpenWindows: _getOpenWindows
};
