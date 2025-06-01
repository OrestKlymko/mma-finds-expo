import React, {useState} from "react";
import {
    View,
    StyleSheet,
    Modal,
    Text,
    TouchableOpacity, Alert, ActivityIndicator, TouchableWithoutFeedback,
} from "react-native";
import {SubmittedFighterListPrivateOffer} from "@/components/offers/exclusive-single/SubmittedFighterListPrivateOffer";
import colors from "@/styles/colors";
import {
    ExclusiveOfferInfo,
    ResponseFighterOnPrivateOfferEnum,
    ShortInfoFighter,
    SubmittedInformationOffer
} from "@/service/response";
import {responseFighterOnSubmissionPrivateOffer} from "@/service/service";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "expo-router";

interface Props {
    submittedFighters: ShortInfoFighter[],
    offer?: ExclusiveOfferInfo | null | undefined;
    onRefresh: () => void;
    submittedInformation: SubmittedInformationOffer | undefined;
}

export const SubmittedFighterPrivateOfferSection: React.FC<Props> = ({
                                                                         submittedFighters,
                                                                         submittedInformation,
                                                                         offer,
                                                                         onRefresh
                                                                     }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const {role} = useAuth();
    const [currentFighter, setCurrentFighter] = useState<ShortInfoFighter | null>(null);
    const [loading, setLoading] = useState(false);
    const handleSelectFighter = (fighter: ShortInfoFighter) => {
        if (submittedInformation?.statusResponded === 'ACCEPTED') {
            Alert.alert("Action not allowed", "You cannot select a fighter after the offer has been accepted.");
            return;
        }
        setCurrentFighter(fighter);
        setModalVisible(true);
    };

    const confirmParticipation = () => {
        if (!offer?.offerId || !currentFighter) return;
        setLoading(true);
        responseFighterOnSubmissionPrivateOffer(offer.offerId, currentFighter?.id, ResponseFighterOnPrivateOfferEnum.ACCEPTED).then(() => {
            setModalVisible(false);
            setCurrentFighter(null);
            onRefresh();
        }).catch(() => {
            Alert.alert("Oops...", " Something went wrong while confirming participation. Try again later.");
        }).finally(() => {
            setLoading(false);
        })
    };

    const cancelParticipation = () => {
        if (!offer?.offerId || !currentFighter) return;
        setLoading(true);
        responseFighterOnSubmissionPrivateOffer(offer.offerId, currentFighter?.id, ResponseFighterOnPrivateOfferEnum.REJECTED).then(() => {
            setModalVisible(false);
            setCurrentFighter(null);
            onRefresh();
        }).catch(() => {
            Alert.alert("Oops...", " Something went wrong while confirming participation. Try again later.");
        }).finally(() => {
            setLoading(false);
        })
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Submitted Fighters
            </Text>
            <SubmittedFighterListPrivateOffer
                offer={offer}
                fighters={submittedFighters}
                onSelectFighter={fighter => {
                    if (role === 'MANAGER') {
                        handleSelectFighter(fighter);
                    } else {
                        router.push(`/(app)/manager/fighter/${fighter.id}/offer`)
                    }
                }}/>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalBox}>
                                <Text style={styles.modalTitle}>Confirm Participation</Text>
                                <Text style={styles.modalMessage}>
                                    {currentFighter
                                        ? `Allow ${currentFighter.formattedName || currentFighter.name} to participate in this offer?`
                                        : ""}
                                </Text>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.confirmButton]}
                                        onPress={confirmParticipation}
                                        disabled={loading}
                                    >
                                        {loading ? <ActivityIndicator color={"white"}/> :
                                            <Text style={styles.buttonText}>Yes</Text>}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={cancelParticipation}
                                        disabled={loading}
                                    >
                                        {loading ? <ActivityIndicator color={"white"}/> :
                                            <Text style={styles.buttonText}>No</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "80%",
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: colors.primaryBlack,
    },
    modalMessage: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        color: colors.secondaryBlack,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 8,
        borderRadius: 6,
        alignItems: "center",
    },
    confirmButton: {
        backgroundColor: colors.primaryGreen,
    },
    cancelButton: {
        backgroundColor: colors.darkError,
    },
    buttonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "600",
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        color: colors.primaryGreen,
        marginBottom: 14,
    },
});
