import React from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import colors from '@/styles/colors';
import {popPrev} from "@/hooks/routeHistory";

interface GoBackButtonProps {
    specificScreen?: string;
    color?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    iconStyle?: TextStyle;
    shouldGoBack?: boolean;
    onPress?: () => void;
    actionAfterUnmount?: () => void;
}

const GoBackButton = ({
                          specificScreen,
                          color,
                          style,
                          textStyle,
                          iconStyle,
                          onPress,
                            shouldGoBack = false,
                          actionAfterUnmount,

                      }: GoBackButtonProps) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();


    const handleBack = () => {

        if(shouldGoBack){
            router.back();
        }
        if (specificScreen) {
            router.replace(specificScreen);
            return;
        }
        const prev = popPrev();
        actionAfterUnmount?.();
        if (prev) {
            router.navigate(prev);
        } else if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }

        onPress?.();
    };

    return (
        <TouchableOpacity
            style={[styles.backButton, style, {paddingTop: insets.top}]}
            onPress={handleBack}>
            <Icon
                name="chevron-left"
                size={24}
                color={color ?? colors.primaryBlack}
                style={iconStyle}
            />
            <Text
                style={[
                    styles.backText,
                    {color: color ?? colors.primaryBlack},
                    textStyle,
                ]}>
                Back
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginLeft: 10,
    },
    backText: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: '400',
        marginLeft: 4,
    },
});

export default GoBackButton;
