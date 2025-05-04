import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('screen');

const ContentLoader = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('@/assets/splash.json')}
                autoPlay
                loop
                style={styles.animation}
            />
        </View>
    );
};

export default ContentLoader;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flex: 1,
        width: '100%',
        height: '100%',
    },
    animation: {
        width: width,
        height: height,
    },
});
