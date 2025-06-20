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

const DISABLED_AMATEUR_SPORTS = [
    'Bare Knuckle',
    'K1 with MMA Gloves',
    'Muay Thai with MMA Gloves',
];

export const MultiSportRecordInputs: React.FC<MultiSportRecordInputsProps> = ({
                                                                                  selectedSportTypes,
                                                                                  records,
                                                                                  setRecords,
                                                                                  hasSubmitted = false,
                                                                              }) => {
    // ✨ хелпер – чи приховувати аматорський блок для конкретного спорту
    const isAmateurDisabled = useCallback(
        (name: string) => DISABLED_AMATEUR_SPORTS.includes(name),
        [],
    );

    // ⚙️ оновлення поля
    const updateField = useCallback(
        (sportId: number, field: keyof RecordFields, value: string) => {
            // блокуємо аматорські поля, якщо тип спорту в списку
            if (
                field.startsWith('am') &&
                isAmateurDisabled(
                    selectedSportTypes.find(st => st.id === sportId)?.name ?? ''
                )
            ) {
                return; // ігноруємо ввід
            }

            setRecords(prev => ({
                ...prev,
                [sportId]: {
                    ...prev[sportId],
                    [field]: value.replace(/[^0-9]/g, ''),
                },
            }));
        },
        [setRecords, selectedSportTypes, isAmateurDisabled],
    );

    if (!selectedSportTypes.length) return null;

    return (
        <View style={styles.container}>
            {selectedSportTypes.map(sport => {
                const id = sport.id;
                const disableAmateur = isAmateurDisabled(sport.name);

                // дефолти: одразу 0 для amateur, якщо заблоковано
                const record: RecordFields = records[id] ?? {
                    proWins: '',
                    proLoss: '',
                    proDraw: '',
                    amWins: disableAmateur ? '0' : '',
                    amLoss: disableAmateur ? '0' : '',
                    amDraw: disableAmateur ? '0' : '',
                };

                // гарантовано фіксуємо 0 при кожному рендері, якщо потрібно
                if (disableAmateur) {
                    ['amWins', 'amLoss', 'amDraw'].forEach(f => {
                        if (record[f as keyof RecordFields] !== '0') {
                            record[f as keyof RecordFields] = '0';
                        }
                    });
                }

                return (
                    <View key={id} style={styles.card}>
                        {/* Header */}
                        <View style={styles.cardHeader}>
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

                            {/* Amateur (тільки якщо не заблоковано) */}
                            {!disableAmateur && (
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
                            )}
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
