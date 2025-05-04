import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, TextInputProps, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import lookup from 'country-code-lookup';
import colors from "@/styles/colors";

interface FloatingLabelInputGeoProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    onChangeCountry?: (country: string) => void;
    onChangeContinent?: (continent: string) => void;
    containerStyle?: any;
    labelStyle?: any;
    error: boolean;
}

const FloatingLabelInputGeo: React.FC<FloatingLabelInputGeoProps> = ({
                                                                         label,
                                                                         value,
                                                                         onChangeText,
                                                                         onChangeCountry,
                                                                         onChangeContinent,
                                                                         containerStyle,
                                                                         error,
                                                                         labelStyle,
                                                                         ...props
                                                                     }) => {
    const [isFocused, setIsFocused] = useState(false);
    const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
    const googlePlacesRef = useRef<any>(null);

    const getCountryFromDetails = (details: any) => {
        const countryComponent = details?.address_components
            ?.find((c: any) => c.types?.includes('country'));

        return countryComponent ? countryComponent.long_name : undefined;
    };


    useEffect(() => {
        Animated.timing(labelPosition, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    // Оновлення початкового значення в GooglePlacesAutocomplete
    useEffect(() => {
        if (value && googlePlacesRef.current) {
            googlePlacesRef.current.setAddressText(value);
        }
    }, [value]);

    const getColor = (errorState: boolean) => {
        return errorState ? colors.error : colors.gray;
    };

    const animatedLabelStyle = {
        top: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [17, -8],
        }),
        fontSize: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: isFocused || value ? colors.primaryGreen : colors.gray,
    };

    const extractCountryAndContinent = (description: string) => {
        const byCountry = lookup.byCountry(description);
        if (byCountry) {
            if (onChangeContinent && onChangeCountry) {
                onChangeContinent(byCountry.continent);
                onChangeCountry(description);
            }
        }
    };

    return (
        <View
            style={[
                styles.container,
                containerStyle,
                error && {borderColor: colors.error},
            ]}>
            <Animated.Text style={[styles.label, animatedLabelStyle, labelStyle]}>
                {label}
            </Animated.Text>
            <GooglePlacesAutocomplete
                ref={googlePlacesRef}
                placeholder={label}
                predefinedPlaces={[]}
                fetchDetails={true}
                minLength={2}
                onPress={(data, details = null) => {
                    if (details) {
                        const country = getCountryFromDetails(details);
                        extractCountryAndContinent(country);
                    }
                    onChangeText(data.description);
                    setIsFocused(false);
                }}
                onFail={error => console.error(error)}
                query={{
                    key: 'AIzaSyBRYG_K4ViSn0xl8OoX4qdSo4_onmY_2DA',
                    language: 'en',
                }}
                styles={{
                    textInput: styles.textInput,
                    listView: {
                        position: 'absolute',
                        top: 56,
                        zIndex: 9999,
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        borderWidth: 1,
                        shadowOffset: {width: 0, height: 4},
                    },
                }}
                textInputProps={{
                    value,
                    onFocus: () => setIsFocused(true),
                    onBlur: () => setIsFocused(false),
                    onChangeText: text => {
                        onChangeText(text);
                    },
                    placeholderTextColor: getColor(error),
                    ...props,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        borderWidth: 1,
        zIndex: 999,
        elevation: 10,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        paddingTop: 12,
        paddingHorizontal: 1,
        paddingBottom: 8,
        height: 56,
    },
    label: {
        position: 'absolute',
        left: 12,
        backgroundColor: colors.background,
        paddingHorizontal: 4,
        fontFamily: 'Roboto',
    },
    textInput: {
        height: 28,
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },
});

export default FloatingLabelInputGeo;
