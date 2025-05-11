import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {ShortInfoFighter} from "@/service/response";
import colors from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Image} from "expo-image";

interface FighterCardProps {
    fighter: ShortInfoFighter;
    onPress: (fighter: ShortInfoFighter) => void;
}

const FighterCard: React.FC<FighterCardProps> = ({fighter, onPress}) => {
    const isRejected = fighter?.contractStatus === 'REJECTED';

    return (
        <View style={{position: 'relative'}}>
            <TouchableOpacity
                onPress={() => {
                    if (!isRejected) {
                        onPress(fighter);
                    }
                }}
                activeOpacity={isRejected ? 1 : 0.7}
                disabled={isRejected}
                style={[styles.fighterCard, isRejected && {opacity: 0.5}]}>
                <Ionicons
                    name="chevron-forward"
                    size={30}
                    color={colors.primaryGreen}
                    style={styles.arrowIcon}
                />

                {fighter?.isFeatured === 'true' && (
                    <View style={styles.featuredTag}>
                        <Text style={styles.featuredTagText}>Featured</Text>
                    </View>
                )}

                <Image
                    source={{uri: fighter?.imageLink}}
                    style={styles.fighterImage}
                />

                <View style={styles.fighterDetails}>
                    <Text style={styles.fighterName}>
                        {fighter?.formattedName?.replace('""', '').trim() || fighter?.name?.trim()}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fighterInfo}>Age: </Text>
                        <Text style={styles.fighterInfoValue}>{fighter?.age} Years</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fighterInfo}>Based In: </Text>
                        <Text style={styles.fighterInfoValue}>{fighter?.country}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fighterInfo}>Professional MMA Record: </Text>
                        <Text style={styles.fighterInfoValue}>{fighter?.statistics}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fighterInfo}>Foundation Style: </Text>
                        <Text style={styles.fighterInfoValue}>
                            {fighter?.foundationStyle}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {isRejected && fighter?.rejectedReason && (
                <View style={styles.rejectedOverlay}>
                    <Text style={styles.rejectedText}>{fighter?.rejectedReason}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    fighterCard: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    fighterImage: {
        width: 65,
        height: 65,
        borderRadius: 30,
        marginRight: 16,
        marginBottom: 10,
    },
    fighterDetails: {
        flex: 1,
    },
    fighterName: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
        color: colors.primaryGreen,
    },
    fighterInfo: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
    },
    fighterInfoValue: {
        fontSize: 12,
        marginBottom: 2,
    },
    featuredTag: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.yellow,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 8,
    },
    featuredTagText: {
        fontWeight: '500',
        fontSize: 10,
    },
    rejectedOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        maxWidth: '80%',
    },
    rejectedText: {
        color: colors.darkError,
        fontSize: 12,
        fontWeight: '600',
    },
    arrowIcon: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center',
    },
});

export default React.memo(FighterCard);
