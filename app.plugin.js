// app.plugin.js
const { withAndroidManifest } = require('@expo/config-plugins');
const { AndroidConfig }       = require('@expo/config-plugins');
const { Manifest }            = AndroidConfig;
const {
    getMainApplicationOrThrow,
    addMetaDataItemToMainApplication,
} = Manifest;

const BRANCH_LIVE_KEY = 'key_live_grh585cIvSocBiDvpSS40jaizwoZP243';

module.exports = function withBranchKey(config) {
    // ————— iOS —————
    config.ios = config.ios || {};
    config.ios.infoPlist = config.ios.infoPlist || {};
    config.ios.infoPlist.NSUserActivityTypes =
        config.ios.infoPlist.NSUserActivityTypes || [];
    // Ось тут важливо передати об’єкт, а не рядок:
    config.ios.infoPlist.branch_key = {
        live: BRANCH_LIVE_KEY,
    };

    // ————— Android —————
    config = withAndroidManifest(config, cfg => {
        const mainApp = getMainApplicationOrThrow(cfg.modResults);
        addMetaDataItemToMainApplication(mainApp, {
            $: {
                'android:name':  'io.branch.sdk.BranchKey',
                // На Android SDK достатньо одного рядка:
                'android:value': BRANCH_LIVE_KEY,
            },
        });
        return cfg;
    });

    return config;
};
