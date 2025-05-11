import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import colors from '@/styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import SearchLogo from "@/assets/searchlogo.svg";

export function CustomToast({ title, description }:{ title: string, description?: string }) {
    const insets = useSafeAreaInsets();
    const translateY = new Animated.Value(-100);

    React.useEffect(() => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.wrapper, { top: insets.top, transform: [{ translateY }] }]} pointerEvents="auto">
            <View
                style={styles.container}>
                <SearchLogo
                    height={ 42}
                    width={ 42}
                    color={colors.primaryBlack}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {description ? <Text style={styles.description}>{description}</Text> : null}
                </View>
            </View>
        </Animated.View>
    );
}
export default gestureHandlerRootHOC(CustomToast);

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 999,
        minWidth: '100%',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        alignItems: 'center',
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // для ripple
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: colors.primaryGreen,
        borderRadius: 5,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginLeft: 6,
    },
    title: {
        color: colors.primaryBlack,
        fontSize: 14,
        fontWeight: '600',
    },
    description: {
        color: colors.secondaryBlack,
        fontSize: 12,
        marginTop: 2,
    },
});
