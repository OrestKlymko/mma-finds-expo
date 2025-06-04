import React, {useEffect, useRef, useState} from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    TextInput as RNTextInput
} from 'react-native';
import colors from "@/styles/colors";


interface FloatingLabelInputProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    containerStyle?: any;
    labelStyle?: any;
    isRequired?: boolean;
    hasSubmitted?: boolean;
    maxLength?: number;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
                                                                   label,
                                                                   value,
                                                                   onChangeText,
                                                                   secureTextEntry = false,
                                                                   containerStyle,
                                                                   labelStyle,
                                                                   isRequired = false,
                                                                   hasSubmitted = false,
                                                                   maxLength,
                                                                   multiline = false,
                                                                   ...props
                                                               }) => {
    const [isFocused, setIsFocused] = useState(false);
    const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
    let hasError = false;
    if (value) {
        hasError = isRequired && hasSubmitted && !value.trim();
    }

    useEffect(() => {
        Animated.timing(labelPosition, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const inputRef = useRef<RNTextInput>(null);

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    const animatedLabelStyle = {
        top: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [17, -8],
        }),
        fontSize: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: hasError ? colors.error : isFocused ? colors.primaryGreen : colors.gray,
    };

    const handleChange = (text: string) => {
        if (!maxLength || text.length <= maxLength) {
            onChangeText(text);
        }
    };

    return (
        <View style={[styles.container, containerStyle, hasError && styles.errorBorder]}>
            <Animated.Text style={[styles.label, animatedLabelStyle, labelStyle]}>
                {label}
            </Animated.Text>
            {isFocused ?
                <TextInput
                    ref={inputRef}
                    style={[styles.input, hasError && styles.errorText]}
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline={multiline && !secureTextEntry}
                    onChangeText={handleChange}
                    editable={isFocused}            // ← коли не у фокусі — просто read-only
                    selectTextOnFocus
                    secureTextEntry={secureTextEntry}
                    {...props}
                /> : <TouchableOpacity onPress={() => setIsFocused(true)}>
                    {!multiline ?
                        <Text style={[styles.input, hasError && styles.errorText]} numberOfLines={1}
                              ellipsizeMode="tail">
                            {value}
                        </Text> :
                        <Text style={[styles.input, hasError && styles.errorText]} ellipsizeMode="tail">
                            {value}
                        </Text>
                    }
                </TouchableOpacity>
            }
            {maxLength !== undefined && (
                <Text style={styles.charCount}>
                    {value.length} / {maxLength}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        paddingHorizontal: 12,
        height: 56,
    },
    label: {
        position: 'absolute',
        left: 8,
        backgroundColor: colors.background,
        paddingHorizontal: 4,
        fontFamily: 'Roboto',
    },
    input: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
        paddingTop: 0,
        paddingBottom: 0
    },
    charCount: {
        position: 'absolute',
        bottom: 4,
        right: 8,
        fontSize: 12,
        color: colors.gray,
        fontFamily: 'Roboto',
    },
    errorBorder: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
    },
});

export default FloatingLabelInput;
