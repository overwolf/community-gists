/* global OwAd */
/* global overwolf */

class AdsService {
    constructor(
        options = {
            adUnit: '', adContainer: '', enableDevelopmentAd: false,
            onComplete: null, size: null, onPlayerLoaded: null,
            onDisplayAdLoaded: null, onPlay: null, onImpression: null, onError: null,
            removeOnComplete: true, closeWindowOnAdRemoved: false,
            autoShowAd: true,
            onAdRemoved: null, onAdRefreshed: null,
            onAdReady: null
        }) {

        this.options = options;

        /*if (options.enableDevelopmentAd)
            localStorage.owAdsForceAdUnit = options.adUnit;*/

        this.owAd = null;

        // if not defined, inject SDK and wait for onload
        if (typeof OwAd == 'undefined')
            this.injectSDK();

        // if SDK is already defined show the ad
        if (typeof OwAd !== 'undefined') {
            this.onOwAdReady();
        }
    }

    injectSDK() {
        const script = document.createElement("script");

        script.src = "https://content.overwolf.com/libs/ads/latest/owads.min.js";
        script.async = true;
        script.onload = this.onOwAdReady.bind(this);

        document.body.appendChild(script);
    }

    onOwAdReady() {
        if (!OwAd) {
            // This scenario might happen if the user is running behind an ISP/public 
            // router that might have detected the library as an ad and redirected the
            // request to an error page.
            // The app should decide how to handle this scenario (trigger an event, 
            // fallback to a place holder etc...)
            return;
        }

        // The creation of an OwAd object will automatically load an ad (so no need to
        // call refreshAd here).

        var adOptions = { debugTracking: true };

        if (this.options.size)
            adOptions = Object.assign(adOptions, { size: this.options.size });

        this.owAd = new OwAd(document.getElementById(this.options.adContainer), adOptions);

        this.bindEvents();

        if (this.options.onAdReady)
            this.options.onAdReady();
    }

    bindEvents() {

        this.owAd.addEventListener('complete', () => {
            if (this.options.onComplete) {
                this.options.onComplete(this.owAd)
            }

            if (this.options.removeOnComplete) {
                this.owAd.removeAd();

                if (this.options.onAdRemoved)
                    this.options.onAdRemoved();

                if (this.options.closeWindowOnAdRemoved)
                    window.close();
            }
        });

        if (this.options.onDisplayAdLoaded) {
            this.owAd.addEventListener('display_ad_loaded', this.options.onDisplayAdLoaded(this.owAd));
        }

        if (this.options.onPlay) {
            this.owAd.addEventListener('play', this.options.onPlay(this.owAd));
        }

        this.owAd.addEventListener('impression', () => {

            if (this.options.onImpression)
                this.options.onImpression(this.owAd)
        });

        this.owAd.addEventListener('error', (error) => {

            if (this.options.onError)
                this.options.onImpression(this.owAd, error);
        });

        if (this.options.onPlayerLoaded) {
            this.owAd.addEventListener('player_loaded', this.options.onImpression(this.owAd));
        }

        overwolf.windows.onStateChanged.removeListener(this.onWindowStateChanged.bind(this));
        overwolf.windows.onStateChanged.addListener(this.onWindowStateChanged.bind(this));
    }

    removeAd() {
        this.owAd.removeAd();
    }

    refreshAd() {
        this.owAd.refreshAd();
    }

    onWindowStateChanged(state) {

        overwolf.windows.getCurrentWindow(result => {
            if (state && result.status == "success" && result.window.name == state.window_name && this.owAd != null) {

                // when state changes to minimized, call removeAd()
                if (state.window_state === "minimized") {
                    this.owAd.removeAd();

                    if (this.options.onAdRemoved)
                        this.options.onAdRemoved();
                }
                // when state changes from minimized to normal, call refreshAd()
                else if (state.window_previous_state === "minimized" && state.window_state === "normal") {
                    this.owAd.refreshAd();

                    if (this.options.onAdRefreshed)
                        this.options.onAdRefreshed();
                }
            }
        });
    }
}

export default AdsService;