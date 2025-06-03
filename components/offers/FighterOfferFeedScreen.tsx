import React, {useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Pressable,
} from "react-native";
import {PublicOfferFeed} from "@/components/offers/PublicOfferFeed";
import colors from "@/styles/colors";
import {OfferTab} from "@/components/offers/OfferTab";
import {useFilter} from "@/context/FilterContext";
import GoBackButton from "@/components/GoBackButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PrivateOfferFeed} from "@/components/offers/PrivateOfferFeed";
import Ionicons from "@expo/vector-icons/Ionicons";

const FighterOfferFeedScreen = () => {
    const insets = useSafeAreaInsets();
    const [selectedTab, setSelectedTab] = useState<"Public" | "Private">("Public");
    const [showMyOffers, setShowMyOffers] = useState(false);
    const [dialOpen, setDialOpen] = useState(false);
    const {setSelectedFilters} = useFilter();

    const handleSelect = (onlyMine: boolean) => {
        setShowMyOffers(onlyMine);
        setDialOpen(false);
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton specificScreen={"/(app)/(tabs)"}/>

            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <Text style={styles.title}>Fight Offers Feed</Text>

                <OfferTab
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    setSelectedFilters={setSelectedFilters}
                />

                {selectedTab === "Public" ? (
                    <PublicOfferFeed/>
                ) : (
                    <PrivateOfferFeed/>
                )}

                {dialOpen && <Pressable style={styles.backdrop} onPress={() => setDialOpen(false)}/>}

                {dialOpen && (
                    <View style={[styles.dialContainer, {bottom: insets.bottom + 96}]}>
                        <TouchableOpacity style={styles.dialItem} onPress={() => handleSelect(false)}>
                            <Ionicons name="list" size={18} color={colors.primaryBlack}/>
                            <Text style={styles.dialText}>All offers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dialItem} onPress={() => handleSelect(true)}>
                            <Ionicons name="person" size={18} color={colors.primaryBlack}/>
                            <Text style={styles.dialText}>My offers</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    accessibilityLabel="Filter my offers"
                    accessibilityRole="button"
                    onPress={() => setDialOpen((prev) => !prev)}
                    style={[styles.fab, showMyOffers && styles.fabActive]}
                >
                    <Ionicons
                        name={showMyOffers ? "person" : "list"}
                        size={24}
                        color={colors.white}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default FighterOfferFeedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        fontFamily: "Roboto",
        fontWeight: "500",
        color: colors.primaryBlack,
        marginBottom: 12,
        textAlign: "center",
    },
    /* FAB */
    fab: {
        position: "absolute",
        right: 24,
        bottom: 100,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primaryGreen,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
    },
    fabActive: {
        backgroundColor: colors.primaryBlack,
    },
    /* Backdrop */
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    /* Dial */
    dialContainer: {
        position: "absolute",
        right: 24,
        marginBottom: 30
    },
    dialItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        marginBottom: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 3,
        shadowOffset: {width: 0, height: 1},
    },
    dialText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "500",
        color: colors.primaryBlack,
    },
});
