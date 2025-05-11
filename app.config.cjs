const { withBranch } = require('react-native-branch');


module.exports = ({ config }) => {
    return withBranch(config, {
        apiKey: {
            development: 'key_live_grh585cIvSocBiDvpSS40jaizwoZP243',
            production:  'key_live_grh585cIvSocBiDvpSS40jaizwoZP243'
        },
        uriScheme: 'com.mmafinds.app'
    });
};
