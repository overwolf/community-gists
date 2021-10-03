/**
 * Overwolf type definition files for autocompletion and documentation purposes.
 * @see https://github.com/overwolf/types
 */

import '@overwolf/types'

/**
 * @name WINDOW_NAMES
 * @description object that represents the windows defined in the overwolf application manifest file, replace the values with your manifest values
 *
 */
const WINDOW_NAMES = {
  BACKGROUND_WINDOW: 'YOUR-BACKGROUND-WINDOW-NAME',
  ANOTHER_WINDOW: 'YOUR-BACKGROUND-WINDOW-NAME',
  IN_GAME_WINDOW: 'YOUR-IN-GAME-WINDOW-NAME',
}

class MockGepMethods {
  static addListener(callback: (payload?: any) => void): void {
    callback()
  }
  static removeListener(callback: (payload?: any) => void): void {
    callback()
  }
}
class MockCommonMethods {
  static addListener(callback: (payload?: any) => void): void {
    callback()
  }
  static removeListener(callback: (payload?: any) => void): void {
    callback()
  }
  static simpleRequestInterval(
    interval: number,
    callback: overwolf.CallbackFunction<overwolf.Result>,
  ): void {
    console.info(`Callback interval ${interval}`)
    callback({ success: true })
  }
}
/**
 *
 * Overwolf Mock
 *
 * Progress:
 * benchmarking: 100%
 * windows: 20%
 * games: 70%,
 * utils: 10%
 */

const overwolfMock: typeof overwolf | Record<string, any> = {
  version: 'BROWSER DEV',
  benchmarking: {
    onFpsInfoReady: MockCommonMethods,
    onHardwareInfoReady: MockCommonMethods,
    onProcessInfoReady: MockCommonMethods,
    requestFpsInfo: MockCommonMethods.simpleRequestInterval,
    requestHardwareInfo: MockCommonMethods.simpleRequestInterval,
    requestProcessInfo: MockCommonMethods.simpleRequestInterval,
    requestPermissions: (
      callback: overwolf.CallbackFunction<overwolf.Result>,
    ) => {
      callback({ success: true })
    },
    stopRequesting: () => {},
  },
  settings: {
    language: {
      get: (
        callback: (
          result: overwolf.settings.language.GetLanguageResult,
        ) => void,
      ) => {
        console.info('get language')
        callback({ language: 'en', success: true })
      },
      onLanguageChanged: {
        addListener: (
          callback: (
            payload: overwolf.settings.language.LanguageChangedEvent,
          ) => void,
        ) => {
          console.log('onLanguageChanged addListener')
          callback({ language: 'en' })
        },
        removeListener: (
          callback: (
            payload: overwolf.settings.language.LanguageChangedEvent,
          ) => void,
        ) => {
          callback({ language: 'en' })
        },
      },
    },
  },
  utils: {
    openUrlInDefaultBrowser: (url: string) => {
      window.open(url)
    },
  },
  windows: {
    getCurrentWindow(callback: (result: any) => void): void {
      callback({
        window: { name: WINDOW_NAMES.BACKGROUND_WINDOW },
        success: true,
      })
    },
    getMainWindow: () => ({ newProperty: 'newProperty' }),

    obtainDeclaredWindow(
      windowName: string,
      callback: (response: any) => void,
    ): void {
      callback({ window: { name: windowName }, success: true })
    },

    restore(windowId: string, callback: (result: any) => void): void {
      console.info('Mock restore ')
    },

    maximize(windowId: string, callback: (result: any) => void): void {
      console.info('Mock maximize')
    },

    close(windowId: string, callback: () => void): void {
      console.info('Mock close')
    },
    minimize(windowId: string, callback: (result: any) => void): void {
      console.info('Mock minimize')
    },
  },
  games: {
    events: {
      onInfoUpdates2: MockGepMethods,
      onNewEvents: MockGepMethods,
      onInfoUpdates: MockGepMethods,
      onError: MockGepMethods,
      setRequiredFeatures: (features, callback) => {
        callback({ success: true, supportedFeatures: features })
      },
      getInfo: (callback: (payload?: any) => void) => {
        callback()
      },
    },
    onGameInfoUpdated: MockGepMethods,

    inputTracking: {
      onKeyDown: MockCommonMethods,
      onKeyUp: MockCommonMethods,
      onMouseDown: MockCommonMethods,
      onMouseUp: MockCommonMethods,
      getMousePosition: (
        callback: overwolf.CallbackFunction<
          overwolf.games.inputTracking.GetActivityResult
        >,
      ) => {
        callback({
          success: true,
          activity: {
            aTime: 0,
            apm: false,
            iTime: 0,
            keyboard: {
              keys: [],
              total: 0,
            },
            mouse: {
              dist: 0,
              keys: 0,
              total: 0,
            },
          },
        })
      },
      getActivityInformation: (
        callback: overwolf.CallbackFunction<
          overwolf.games.inputTracking.GetActivityResult
        >,
      ) => {
        callback({
          success: true,
          activity: {
            aTime: 0,
            apm: false,
            iTime: 0,
            keyboard: {
              keys: [],
              total: 0,
            },
            mouse: {
              dist: 0,
              keys: 0,
              total: 0,
            },
          },
        })
      },
      getEyeTrackingInformation: (
        callback: overwolf.CallbackFunction<
          overwolf.games.inputTracking.GetActivityResult
        >,
      ) => {
        callback({
          success: true,
          activity: {
            aTime: 0,
            apm: false,
            iTime: 0,
            keyboard: {
              keys: [],
              total: 0,
            },
            mouse: {
              dist: 0,
              keys: 0,
              total: 0,
            },
          },
        })
      },
      pauseEyeTracking: () => {},
      resumeEyeTracking: () => {},
    },
  },
}
/* define overwolf mock only production mode

export default process.env.NODE_ENV !== "production" &&
    Object.defineProperty(window, "overwolf", {
        writable: true,
        value: overwolfMock
    });
*/
export default Object.defineProperty(window, 'overwolf', {
  writable: true,
  value: overwolfMock,
})
