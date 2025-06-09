import React, {useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {ExclusiveOfferInfo, PublicOfferInfo} from '@/service/response';

type Props = {
    offer: PublicOfferInfo |ExclusiveOfferInfo | null;
};

const OpponentDetailsSection: React.FC<Props> = ({offer}) => {
    const [expanded, setExpanded] = useState(false);
    if (!offer?.opponentName) {
        return null;
    }

    const proRecord =
        offer.opponentProWins || offer.opponentProLosses || offer.opponentProDraws
            ? `${offer.opponentProWins ?? 0}-${offer.opponentProLosses ?? 0}-${
                offer.opponentProDraws ?? 0
            }`
            : null;

    const amateurRecord =
        offer.opponentAmateurWins ||
        offer.opponentAmateurLosses ||
        offer.opponentAmateurDraws
            ? `${offer.opponentAmateurWins ?? 0}-${
                offer.opponentAmateurLosses ?? 0
            }-${offer.opponentAmateurDraws ?? 0}`
            : null;

    const details = [
        {label: 'Name', value: offer.opponentName},
        {label: 'Nationality', value: offer.opponentNationality},
        {label: 'Age', value: offer.opponentAge},
        {label: 'Gender', value: offer.opponentGender},
        {label: 'Pro Record', value: proRecord},
        {label: 'Amateur Record', value: amateurRecord},
    ].filter(d => d.value && d.value !== 'N/A' && d.value !== '0-0-0');

    const openTapology = () => {
        if (offer?.opponentTapologyLink) {
            Linking.openURL(offer.opponentTapologyLink);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setExpanded(!expanded)}>
                <Text style={styles.headerText}>Opponent Information</Text>
                <Icon
                    name={expanded ? 'chevron-down' : 'chevron-right'}
                    size={24}
                    color={colors.primaryGreen}
                />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.detailsWrapper}>
                    {details.map((detail, index) => (
                        <View
                            key={index}
                            style={[
                                styles.row,
                                index % 2 === 0 ? styles.zebraLight : styles.zebraDark,
                            ]}>
                            <Text style={styles.label}>{detail.label}</Text>
                            <Text style={styles.value}>{detail.value}</Text>
                        </View>
                    ))}

                    {offer?.opponentTapologyLink && (
                        <TouchableOpacity
                            onPress={openTapology}
                            style={[
                                styles.row,
                                details.length % 2 === 0 ? styles.zebraLight : styles.zebraDark,
                            ]}>
                            <Text style={styles.label}>Tapology Profile</Text>
                            <Icon name="open-in-new" size={18} color={colors.primaryGreen} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

export default OpponentDetailsSection;

const styles = StyleSheet.create({
    container: {
        marginBottom:10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 14,
        color: colors.primaryGreen,
        marginRight: 6,
    },
    detailsWrapper: {
        borderRadius: 8,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    zebraLight: {
        backgroundColor: colors.white,
    },
    zebraDark: {
        backgroundColor: colors.lightGray,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    value: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
});
