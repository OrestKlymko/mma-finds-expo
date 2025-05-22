import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';

import FloatingLabelInput from '@/components/FloatingLabelInput';
import colors from '@/styles/colors';
import {NationalityResponse} from '@/service/response';
import {ProfessionalRecordInputs} from "@/components/ProfessionalRecordInputs";
import {AmateurRecordInputs} from "@/components/AmateurRecordInputs";
import {Gender} from "@/components/Gender";
import {NationalityDropdown} from "@/components/NationalityDropdown";
import TapologyInputComponent from "@/components/TapologyInputComponent";

interface OpponentInfoSectionProps {
    /** из стора */
    opponentTapology: string;
    opponentName: string;
    opponentGender: string;
    opponentAge: string;
    nationality: NationalityResponse | null;
    mmaRule: 'Professional' | 'Amateur' | undefined;
    title?: string;
    hasSubmitted: boolean;
    noTapologyLink: boolean;
    setNoTapologyLink: (value: boolean) => void;
    proWins: string;
    proLoss: string;
    proDraw: string;
    amWins: string;
    amLoss: string;
    amDraw: string;
    setProWins: (v: string) => void;
    setProLoss: (v: string) => void;
    setProDraw: (v: string) => void;
    setAmWins: (v: string) => void;
    setAmLoss: (v: string) => void;
    setAmDraw: (v: string) => void;
    setOpponentName: (name: string) => void;
    setOpponentTapology: (link: string) => void;
    setOpponentGender: (g: string) => void;
    setOpponentAge: (age: string) => void;
    setOpponentNationality: (n: NationalityResponse) => void;
}

const OpponentInfoSection: React.FC<OpponentInfoSectionProps> = ({
                                                                     opponentName,
                                                                     opponentGender,
                                                                     opponentAge,
                                                                     nationality,
                                                                     mmaRule,
                                                                     title,
                                                                     hasSubmitted,
                                                                     noTapologyLink,
                                                                     setNoTapologyLink,
                                                                     proWins,
                                                                     proLoss,
                                                                     proDraw,
                                                                     amWins,
                                                                     amLoss,
                                                                     amDraw,
                                                                     setProWins,
                                                                     setProLoss,
                                                                     setProDraw,
                                                                     setAmWins,
                                                                     setAmLoss,
                                                                     setAmDraw,
                                                                     setOpponentName,
                                                                     setOpponentTapology,
                                                                     setOpponentGender,
                                                                     setOpponentAge,
                                                                     setOpponentNationality,
                                                                 }) => {
    const extractNameFromTapologyLink = (url: string): string | null => {
        try {
            const regex =
                /^https:\/\/www\.tapology\.com\/fightcenter\/fighters\/\d+-[a-zA-Z-]+$/;
            if (!regex.test(url)) return null;
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1]; // e.g. "40148-islam-makhachev"
            const namePart = lastPart.split('-').slice(1).join(' ');
            return namePart
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
        } catch {
            return null;
        }
    };

    return (
        <View style={{zIndex: 10}}>
            {/* Tapology link input */}
            <TapologyInputComponent
                noTapologyLink={noTapologyLink}
                onSelectedTapologyLink={link => {
                    setOpponentTapology(link);
                    const name = extractNameFromTapologyLink(link);
                    if (name) {
                        setOpponentName(name);
                    }
                }}
                label="Opponent's Tapology Link*"
            />

            {/* Switch */}
            <View style={styles.switchContainer}>
                <Switch
                    value={noTapologyLink}
                    onValueChange={setNoTapologyLink}
                    trackColor={{false: colors.gray, true: colors.primaryGreen}}
                    thumbColor={noTapologyLink ? colors.white : colors.gray}
                />
                <Text style={styles.switchLabel}>
                    Opponent doesn&apos;t have a Tapology link
                </Text>
            </View>

            {/* Если «нет tapology», раскрываем дополнительную форму */}
            {noTapologyLink && (
                <>
                    <FloatingLabelInput
                        label="Opponent's name and surname*"
                        value={opponentName}
                        hasSubmitted={hasSubmitted}
                        containerStyle={styles.inputContainer}
                        onChangeText={text => setOpponentName(text)}
                    />

                    {mmaRule === 'Professional' && (
                        <ProfessionalRecordInputs
                            sportType={title}
                            proWins={proWins}
                            proLoss={proLoss}
                            proDraw={proDraw}
                            setProWins={setProWins}
                            setProLoss={setProLoss}
                            setProDraw={setProDraw}
                            hasSubmitted={hasSubmitted}
                        />
                    )}

                    {mmaRule === 'Amateur' && (
                        <AmateurRecordInputs
                            sportType={title}
                            amWins={amWins}
                            amLoss={amLoss}
                            amDraw={amDraw}
                            setAmWins={setAmWins}
                            setAmLoss={setAmLoss}
                            setAmDraw={setAmDraw}
                            hasSubmitted={hasSubmitted}
                        />
                    )}

                    <Gender
                        title="Opponent's gender*"
                        gender={opponentGender}
                        hasSubmitted={hasSubmitted}
                        setGender={g => setOpponentGender(g)}
                    />

                    <FloatingLabelInput
                        label="Opponent's Age*"
                        value={opponentAge}
                        hasSubmitted={hasSubmitted}
                        containerStyle={styles.inputContainer}
                        onChangeText={t => setOpponentAge(t)}
                        keyboardType="numeric"
                    />

                    <NationalityDropdown
                        title="Opponent's nationality*"
                        nationality={nationality}
                        hasSubmitted={hasSubmitted}
                        setNationality={n => setOpponentNationality(n)}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        flex: 1,
        fontSize: 14,
        color: colors.primaryBlack,
        marginLeft: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
});

export default OpponentInfoSection;
