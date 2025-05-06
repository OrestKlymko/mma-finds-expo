import React from 'react';
import {Text, View, Switch, StyleSheet} from 'react-native';
import FloatingLabelInput from '../FloatingLabelInput';
import colors from "@/styles/colors";

interface Props {
    tapologyLink: string;
    setTapologyLink: (val: string) => void;
    hasSubmitted: boolean;
}

export const TapologyLinkInput = ({
                                      tapologyLink,
                                      setTapologyLink,
                                      hasSubmitted,
                                  }: Props) => {
    const [noTapologyLink, setNoTapologyLink] = React.useState(false);
    const [tapologyError, setTapologyError] = React.useState('');
    const handleChange = (text: string) => {
        setTapologyLink(text);

        if (text.trim() === '') return;

        const tapologyRegex = /^https?:\/\/(www\.)?tapology\.com\/?.*$/i;
        if (!tapologyRegex.test(text.trim())) {
            setTapologyError('Invalid Tapology link');
        }
    };

    return (
        <>
            {!noTapologyLink && (
                <FloatingLabelInput
                    label="Tapology Link*"
                    value={tapologyLink}
                    hasSubmitted={hasSubmitted}
                    isRequired={!noTapologyLink}
                    onChangeText={handleChange}
                    containerStyle={[
                        styles.inputContainer,
                        noTapologyLink && styles.disabledInput,
                    ]}
                />
            )}
            {tapologyError !== '' && !noTapologyLink && (
                <Text style={styles.errorText}>{tapologyError}</Text>
            )}

            <View style={styles.switchContainer}>
                <Switch
                    value={noTapologyLink}
                    onValueChange={setNoTapologyLink}
                    trackColor={{false: colors.gray, true: colors.primaryGreen}}
                    thumbColor={noTapologyLink ? colors.white : colors.gray}
                />
                <Text style={styles.switchLabel}>I don&#39;t have a Tapology link</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
    },
    disabledInput: {
        backgroundColor: colors.lightGray,
        borderColor: colors.gray,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginBottom: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginLeft: 10,
    },
});