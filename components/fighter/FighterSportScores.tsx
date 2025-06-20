import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@/styles/colors';

export type SportScore = {
    sportTypeId: string;
    sportTypeName: string;
    proWins: number;
    proLoss: number;
    proDraw: number;
    amWins: number;
    amLoss: number;
    amDraw: number;
};

export const FighterSportScores = ({
                                       sportScore,
                                   }: {
    sportScore: SportScore[] | null | undefined;
}) => {
    if (!sportScore || sportScore.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.row, styles.headerRow]}>
                <View style={[styles.cell, styles.firstCell]}>
                    <Text style={styles.headerText}>Sport</Text>
                </View>
                <View style={[styles.cell, styles.otherCell]}>
                    <Text style={styles.headerText}>Professional</Text>
                </View>
                <View style={[styles.cell, styles.otherCell]}>
                    <Text style={styles.headerText}>Amateur</Text>
                </View>
            </View>

            {/* Data */}
            {sportScore.map((score, idx) => {
                const proRecord = `${score.proWins}-${score.proLoss}-${score.proDraw}`;
                let amRecord = `${score.amWins}-${score.amLoss}-${score.amDraw}`;
                if(amRecord==='0-0-0') {
                    amRecord = '-';
                }
                return (
                    <View
                        key={score.sportTypeId}
                        style={[
                            styles.row,
                            idx % 2 === 0 ? styles.zebraLight : styles.zebraDark,
                        ]}>
                        {/* Sport Name */}
                        <View style={[styles.cell, styles.firstCell]}>
                            <Text style={styles.text}>{score.sportTypeName}</Text>
                        </View>
                        {/* Pro Record */}
                        <View style={[styles.cell, styles.otherCell]}>
                            <Text style={styles.text}>{proRecord}</Text>
                        </View>
                        {/* Am Record */}
                        <View style={[styles.cell, styles.otherCell]}>
                            <Text style={styles.text}>{amRecord}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRow: {
        backgroundColor: colors.primaryGreen,
    },
    zebraLight: {
        backgroundColor: colors.white,
    },
    zebraDark: {
        backgroundColor: colors.lightGray,
    },
    // базовий стиль клітинки
    cell: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    // перша колонка ширша, текст ліворуч
    firstCell: {
        flex: 2,
        alignItems: 'flex-start',
    },
    // інші колонки однакової ширини, текст по центру
    otherCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.white,
    },
    text: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
});
