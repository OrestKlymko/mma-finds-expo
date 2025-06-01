import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ShortInfoFighter } from "@/service/response";
import colors from "@/styles/colors";

interface FighterCardProps {
    fighter: ShortInfoFighter;
    onPress: (fighter: ShortInfoFighter) => void;
    selectedInList?: boolean;
}

export default function FighterCard({ fighter, onPress, selectedInList }: FighterCardProps) {
    const isRejected = fighter.responseFighter === "REJECTED";
    const isPending = fighter.responseFighter === "PENDING";
    const isAccepted = fighter.responseFighter === "ACCEPTED";

    const shortCountry = () => {
        if (!fighter.country) return "";
        return fighter.country.length > 25 ? `${fighter.country.slice(0, 25)}…` : fighter.country;
    };

    const cardBg = () => (selectedInList ? colors.lightPrimaryGreen : colors.lightGray);

    return (
        <View style={styles.wrapper}>
            <Pressable
                disabled={isRejected}
                onPress={() => onPress(fighter)}
                style={({ pressed }) => [
                    styles.card,
                    { backgroundColor: cardBg(), opacity: isRejected ? 0.5 : 1 },
                    pressed && !isRejected && styles.cardPressed,
                ]}
            >
                {isRejected && <StatusBadge label="Rejected" color={colors.darkError} />}
                {isPending && <StatusBadge label="Manage participation" color={colors.orange} />}
                {isAccepted && <StatusBadge label="Accepted" color={colors.primaryGreen} />}

                {fighter.isFeatured === "true" && (
                    <View style={styles.featuredTag}>
                        <Text style={styles.featuredTagText}>Featured</Text>
                    </View>
                )}

                <Image source={{ uri: fighter.imageLink }} style={styles.avatar} />

                <View style={styles.infoBlock}>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                        {fighter.formattedName?.replace("\"\"", "").trim() || fighter.name}
                    </Text>
                    <Text style={styles.meta}>Age: <Text style={styles.metaVal}>{fighter.age}</Text></Text>
                    <Text style={styles.meta}>Based in: <Text style={styles.metaVal}>{shortCountry()}</Text></Text>
                    <Text style={styles.meta}>Style: <Text style={styles.metaVal}>{fighter.foundationStyle}</Text></Text>
                </View>
            </Pressable>
        </View>
    );
}

const StatusBadge = ({ label, color }: { label: string; color: string }) => (
    <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{label}</Text>
    </View>
);

const Overlay = ({ text }: { text: string }) => (
    <View style={styles.overlay}>
        <Text style={styles.overlayText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        width: "100%",
        marginVertical: 6,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        borderRadius: 8,
        padding: 12,
    },
    cardPressed: {
        opacity: 0.7,
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 32,
        marginRight: 16,
    },
    infoBlock: {
        flex: 1,
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.primaryGreen,
        marginBottom: 4,
    },
    meta: {
        fontSize: 12,
        fontWeight: "500",
        color: colors.primaryBlack,
    },
    metaVal: {
        fontWeight: "400",
    },
    arrowWrapper: {
        position: "absolute",
        right: 16,
        top: "50%",
        transform: [{ translateY: -14 }],
    },
    featuredTag: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: colors.yellow,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    featuredTagText: {
        fontSize: 10,
        fontWeight: "600",
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 2,
        zIndex: 2,
    },
    badgeText: {
        fontSize: 10,
        color: colors.white,
        fontWeight: "600",
    },
    overlay: {
        position: "absolute",
        top: "40%",
        left: "5%",
        right: "5%",
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 6,
        padding: 8,
    },
    overlayText: {
        fontSize: 12,
        color: colors.darkError,
        fontWeight: "600",
        textAlign: "center",
    },
});
