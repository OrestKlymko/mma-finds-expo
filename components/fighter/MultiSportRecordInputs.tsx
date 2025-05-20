import React, {useCallback} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    UIManager,
} from 'react-native';
import {SportTypeResponse} from '@/service/response';
import colors from '@/styles/colors';
import {ProfessionalRecordInputs} from '@/components/ProfessionalRecordInputs';
import {AmateurRecordInputs} from '@/components/AmateurRecordInputs';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type RecordFields = {
    proWins: string;
    proLoss: string;
    proDraw: string;
    amWins: string;
    amLoss: string;
    amDraw: string;
};

export type RecordsBySport = Record<number, RecordFields>; // key = sportType.id

interface MultiSportRecordInputsProps {
    selectedSportTypes: SportTypeResponse[];
    records: RecordsBySport;
    setRecords: (newRecords: RecordsBySport) => void;
    hasSubmitted?: boolean;
}

export const MultiSportRecordInputs: React.FC<MultiSportRecordInputsProps> = ({
                                                                                  selectedSportTypes,
                                                                                  records,
                                                                                  setRecords,
                                                                                  hasSubmitted = false,
                                                                              }) => {


    const updateField = useCallback(
        (sportId: number, field: keyof RecordFields, value: string) => {
            setRecords(prev => ({
                ...prev,
                [sportId]: {...prev[sportId], [field]: value.replace(/[^0-9]/g, '')},
            }));
        },
        [setRecords],
    );

    if (!selectedSportTypes.length) return null;

    return (
        <View style={styles.container}>
            {selectedSportTypes.map(sport => {
                const id = sport.id;
                const record: RecordFields = records[id] ?? {
                    proWins: '',
                    proLoss: '',
                    proDraw: '',
                    amWins: '',
                    amLoss: '',
                    amDraw: '',
                };

                return (
                    <View key={id} style={styles.card}>
                        {/* Header */}
                        <View
                            style={styles.cardHeader}
                        >
                            <Text style={styles.cardTitle}>{sport.name}</Text>
                        </View>

                        <View style={styles.content}>
                            {/* Professional */}
                            <ProfessionalRecordInputs
                                sportType={sport.name}
                                proWins={record.proWins}
                                setProWins={val => updateField(id, 'proWins', val)}
                                proLoss={record.proLoss}
                                setProLoss={val => updateField(id, 'proLoss', val)}
                                proDraw={record.proDraw}
                                setProDraw={val => updateField(id, 'proDraw', val)}
                                hasSubmitted={hasSubmitted}
                            />

                            {/* Amateur */}
                            <AmateurRecordInputs
                                hasSubmitted={hasSubmitted}
                                sportType={sport.name}
                                amWins={record.amWins}
                                setAmWins={val => updateField(id, 'amWins', val)}
                                amLoss={record.amLoss}
                                setAmLoss={val => updateField(id, 'amLoss', val)}
                                amDraw={record.amDraw}
                                setAmDraw={val => updateField(id, 'amDraw', val)}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    card: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: colors.white,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    content: {
        paddingHorizontal: 12,
        paddingBottom: 14,
    },
});
