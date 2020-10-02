/**
 * Overwolf type definition files for autocompletion and documentation purposes.
 * @see https://github.com/overwolf/types
 */

import "@overwolf/types";

/**
 * @name WINDOW_NAMES
 * @description object that represents the windows defined in the overwolf application manifest file, replace the values with your manifest values
 * 
 */
const WINDOW_NAMES = {
    BACKGROUND_WINDOW: 'YOUR-BACKGROUND-WINDOW-NAME',
    ANOTHER_WINDOW: 'YOUR-BACKGROUND-WINDOW-NAME',
    IN_GAME_WINDOW: 'YOUR-IN-GAME-WINDOW-NAME'
}


class MockGepMethods {

    static addListener(callback: (payload?: any) => void): void {
        //callback();
    }
    static removeListener(callback: (payload?: any) => void): void {
        //callback();
    }
}
class MockCommonMethods {
    static addListener(callback: (payload?: any) => void): void {
        callback();
    }
    static removeListener(callback: (payload?: any) => void): void {
        callback();
    }
    static simpleRequestInterval(interval: number, callback: () => void): void {
        console.info(`Callback interval ${interval}`);
        callback();
    }
}

/**
 * Overwolf Mock
 * Progress:
 * benchmarking: 100%
 * windows: 10%
 * games: 70%,
 * utils: 10%
 */

const overwolfMock: typeof overwolf = {
    version: "BROWSER DEV",
    benchmarking: {
        onFpsInfoReady: MockCommonMethods,
        onHardwareInfoReady: MockCommonMethods,
        onProcessInfoReady: MockCommonMethods,
        requestFpsInfo: MockCommonMethods.simpleRequestInterval,
        requestHardwareInfo: MockCommonMethods.simpleRequestInterval,
        requestProcessInfo: MockCommonMethods.simpleRequestInterval,
        requestPermissions: (callback: () => void) => {
            callback();
        },
        stopRequesting: () => { }
    },
    settings: {
        getCurrentOverwolfLanguage: (
            callback: (result: any) => void
        ) => {
            callback({ status: "success", language: "en" });
        }
    },
    utils: {
        openUrlInDefaultBrowser: (url: string) => {
            window.open(url);
        }
    },
    windows: {
        getCurrentWindow(callback: (result: any) => void): void {
            callback({ window: { name: WINDOW_NAMES.BACKGROUND_WINDOW }, success: true });
        },
        getMainWindow: () => ({}),
        obtainDeclaredWindow(
            windowName: string,
            callback: (response: any) => void
        ): void {
            callback({ window: { name: windowName }, success: true });
        },
        restore(windowId: string, callback: (result: any) => void): void {
            console.info("Mock restore ");
        },
        maximize(windowId: string, callback: (result: any) => void): void {
            console.info("Mock maximize");
        },
        close(windowId: string, callback: () => void): void {
            console.info("Mock close");
        },
        minimize(windowId: string, callback: (result: any) => void): void {
            console.info("Mock minimize");
        }
    },
    games: {
        events: {
            onInfoUpdates2: MockGepMethods,
            onNewEvents: MockGepMethods,
            onInfoUpdates: MockGepMethods,
            onError: MockGepMethods,
            setRequiredFeatures: (features, callback) => {
                callback({ success: true, features });
            },
            getInfo: (callback: (payload?: any) => void) => {
                callback();
            }
        },
        onGameInfoUpdated: MockGepMethods,
        inputTracking: {
            onKeyDown: MockCommonMethods,
            onKeyUp: MockCommonMethods,
            onMouseDown: MockCommonMethods,
            onMouseUp: MockCommonMethods,
            getMousePosition: (callback: () => void) => {
                callback();
            },
            getActivityInformation: (callback: () => void) => {
                callback();
            },
            getEyeTrackingInformation: (callback: () => void) => {
                callback();
            },
            getMatchActivityInformation: (
                callback: (activity: {}) => void
            ) => {
                callback({ activity: {}, status: "DEV_BROWSER" });
            },
            pauseEyeTracking: () => { },
            resumeEyeTracking: () => { }
        }
    }
};
/* define overwolf mock only production mode

export default process.env.NODE_ENV !== "production" &&
    Object.defineProperty(window, "overwolf", {
        writable: true,
        value: overwolfMock
    });
*/
export default
    Object.defineProperty(window, "overwolf", {
        writable: true,
        value: overwolfMock
    });
