import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    // начинаем с дефолтного конфига
    ...config,

    name:  'MMA Finds',
    slug:  'mma-finds-expo',
    scheme: 'com.mmafinds.app',

    ios: {
        ...config.ios,
        bundleIdentifier: 'com.mmafinds.app',
        associatedDomains: ['applinks:mmafinds.com'],
        infoPlist: {
            ...config.ios?.infoPlist,
            NSUserActivityTypes: [],
            // вот этот ключ нужно IOS-SDK Branch
            branch_key: {
                live: 'key_live_grh585cIvSocBiDvpSS40jaizwoZP243',
                // при желании можно добавить test/dev:
                // test: 'key_test_…',
            },
        },
    },

    android: {
        ...config.android,
        package: 'com.mmafinds.app',
        usesCleartextTraffic: true,
        intentFilters: [
            {
                action: 'VIEW',
                data: [
                    { scheme: 'https', host: 'mmafinds.com', pathPrefix: '/s/' },
                    { scheme: 'com.mmafinds.app' }, // fallback
                ],
                category: ['BROWSABLE', 'DEFAULT'],
            },
        ],
    },

    // вот здесь — лишь наш кастомный плагин
    plugins: [
        './app.plugin.js',
        'expo-router',
        [
            'expo-splash-screen',
            {
                image: './assets/main-logo/splash.png',
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
        ],
        'expo-secure-store',
        [
            'expo-build-properties',
            { android: { usesCleartextTraffic: true } },
        ],
    ],
});
