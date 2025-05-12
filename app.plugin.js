// app.plugin.js
const { withAndroidManifest } = require('@expo/config-plugins');
const { AndroidConfig }       = require('@expo/config-plugins');
const { Manifest }            = AndroidConfig;
const {
    getMainApplicationOrThrow,
    addMetaDataItemToMainApplication,
    removeMetaDataItemFromMainApplication
} = Manifest;

const BRANCH_LIVE_KEY = 'key_live_grh585cIvSocBiDvpSS40jaizwoZP243';

module.exports = function withBranchKey(config) {
    // ————— iOS —————
    config.ios = config.ios || {};
    config.ios.infoPlist = config.ios.infoPlist || {};
    config.ios.infoPlist.NSUserActivityTypes =
        config.ios.infoPlist.NSUserActivityTypes || [];
    config.ios.infoPlist.branch_key = {
        live: BRANCH_LIVE_KEY,
    };

    // ————— Android —————
    return withAndroidManifest(config, (cfg) => {
        const manifest = cfg.modResults.manifest;
        const application = manifest.application?.[0];
        if (!application) {
            throw new Error("Can't find <application> in AndroidManifest");
        }

        // 1) Відфільтрувати всі елементи без потрібного value
        //    і особливо ті, що мають name="[object Object]"
        application.metaData = (application.metaData || []).filter(
            (entry) => {
                const name = entry.$['android:name'];
                const hasValue = typeof entry.$['android:value'] === 'string';
                // лишаємо лише валідні записи або ті, що не "[object Object]"
                return hasValue && name !== '[object Object]';
            }
        );

        // 2) Додаємо коректний ключ Branch
        application.metaData.push({
            $: {
                'android:name':  'io.branch.sdk.BranchKey',
                'android:value': BRANCH_LIVE_KEY,
            },
        });

        // Повертаємо оновлений cfg
        cfg.modResults.manifest = manifest;
        return cfg;
    });

    return config;
};
