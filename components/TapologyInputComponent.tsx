import React, {useState} from 'react';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';

interface TapologyInputComponentProps {
    noTapologyLink?: boolean;
    onSelectedTapologyLink: (link: string) => void;
    label?: string;
    error?: boolean;
    hasSubmitted?: boolean;
}

export const TapologyInputComponent = ({
                                           noTapologyLink,
                                           onSelectedTapologyLink,
                                           label,
                                           error,
                                           hasSubmitted,
                                       }: TapologyInputComponentProps)=> {
    const [tapologyLink, setTapologyLink] = useState('');
    const [tapologyError, setTapologyError] = useState('');

    const handleTapologyChange = (text: string) => {
        setTapologyLink(text.trim());

        if (text.trim() === '') {
            setTapologyError('');
            return;
        }

        const tapologyRegex =
            /^https?:\/\/(www\.)?tapology\.com\/fightcenter\/fighters\/\d+-[a-zA-Z0-9-]+$/i;

        if (!tapologyRegex.test(text.trim())) {
            setTapologyError(
                'Invalid Tapology link. Example: https://www.tapology.com/fightcenter/fighters/00000-firstname-lastname',
            );
        } else {
            setTapologyError('');
            onSelectedTapologyLink(text);
        }
    };

    if (noTapologyLink) return null;

    return (
        <View style={styles.inputContainer}>
            <FloatingLabelInput
                label={label || 'Tapology Link*'}
                value={tapologyLink}
                hasSubmitted={hasSubmitted}
                isRequired={error}
                onChangeText={handleTapologyChange}
                containerStyle={[
                    tapologyError && styles.errorInput,
                    noTapologyLink && styles.disabledInput,
                ]}
            />
            {tapologyError !== '' && (
                <Text style={styles.errorText}>{tapologyError}</Text>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    errorInput: {
        borderColor: colors.error,
    },
    disabledInput: {
        backgroundColor: colors.lightGray,
        borderColor: colors.gray,
    },
});

export default TapologyInputComponent;
