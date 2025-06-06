import React, {useState} from 'react';
import {
    Alert,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {negotiationExclusiveOffer, negotiationPublicOffer} from '@/service/service';
import {ResponsorOfferRequest} from '@/service/request';
import {ExclusiveOfferInfo, PublicOfferInfo, SubmittedInformationOffer,} from '@/service/response';
import {getCurrencySymbol} from "@/utils/utils";
import {useLocalSearchParams, useRouter} from "expo-router";
import {PriceRow} from "@/components/PriceRow";
import {NewOfferComponent} from "@/components/NewOfferComponent";
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";

const NegotiationScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{
        fighterId?: string;
        offerId?: string;
        offer?: string; // це буде JSON як string
        submittedInformation?: string;
        previousInformation?: string;
        typeOffer?: string;
    }>();
    const fighterId = params.fighterId;
    const offerId = params.offerId;
    const typeOffer = params.typeOffer;
    const offer = params.offer ? JSON.parse(params.offer) as PublicOfferInfo | ExclusiveOfferInfo : undefined;
    const submittedInformation = params.submittedInformation ? JSON.parse(params.submittedInformation) as SubmittedInformationOffer : undefined;
    const previousInformation = params.previousInformation ? JSON.parse(params.previousInformation) as SubmittedInformationOffer : undefined;

    const [newOffer, setNewOffer] = useState({
        fightPurse: '',
        winBonus: '',
        finishBonus: '',
    });

    const [editingField, setEditingField] = useState<string | null>(null);

    const handleOfferSend = () => {

        if (!offerId || !fighterId) {
            Alert.alert('Error', 'Invalid offer or fighter ID');
            return;
        }
        const data: ResponsorOfferRequest = {
            offerId: offerId,
            fighterId: fighterId,
            negotiateRequest: {
                fightPurse: parseFloat(newOffer.fightPurse||'0'),
                winBonus: parseFloat(newOffer.winBonus||'0'),
                finishBonus: parseFloat(newOffer.finishBonus||'0'),
            },
        };
        if (typeOffer === 'Public') {
            negotiationPublicOffer(data)
                .then(() => {
                    router.push('/offer/public/success/sent');
                })
                .catch(() => {
                    Alert.alert('Error', 'Failed to send the offer');
                });
        } else {
            negotiationExclusiveOffer(data)
                .then(() => {
                    router.push('/offer/public/success/sent');
                })
                .catch(() => {
                    Alert.alert('Error', 'Failed to send the offer');
                });
        }
    };

    const renderNegotiateState = () => {
        if (previousInformation) {
            return (
                <>
                    <PriceRow
                        title="Offered Purse"
                        values={[
                            previousInformation?.fightPurse ?? '',
                            previousInformation?.winPurse ?? '',
                            previousInformation?.bonusPurse ?? '',
                        ]}
                        currency={getCurrencySymbol(previousInformation?.currency)}
                    />
                    <PriceRow
                        title="Negotiated Purse"
                        values={[
                            submittedInformation?.fightPurse ?? '',
                            submittedInformation?.winPurse ?? '',
                            submittedInformation?.bonusPurse ?? '',
                        ]}
                        currency={getCurrencySymbol(submittedInformation?.currency)}
                    />
                </>
            );
        } else {
            return (
                <PriceRow
                    title="Offered Purse"
                    values={[
                        submittedInformation?.fightPurse ?? '',
                        submittedInformation?.winPurse ?? '',
                        submittedInformation?.bonusPurse ?? '',
                    ]}
                    currency={getCurrencySymbol(submittedInformation?.currency)}
                />
            );
        }
    };
    return (
        <ScrollView style={{flex: 1, backgroundColor: colors.background}} keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag">
            <TouchableWithoutFeedback
                onPress={() => {
                    setEditingField(null);
                    Keyboard.dismiss();
                }}>
                <View>
                <EventPosterImage eventImageLink={offer?.eventImageLink}/>
                <View style={styles.container}>
                    <Text style={styles.title}>Negotiate the Offer</Text>
                    <Text style={styles.subtitle}>
                        Propose the price you can offer and send it!
                    </Text>
                    {renderNegotiateState()}
                    <NewOfferComponent
                        newOffer={newOffer}
                        setNewOffer={setNewOffer}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <TouchableOpacity style={styles.sendButton} onPress={handleOfferSend}>
                        <Text style={styles.sendButtonText}>Send Offer</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default NegotiationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 24,
        marginTop: -50
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 24,
    },

    sendButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 16,
        borderRadius: 12,
        marginHorizontal: 20,
        alignItems: 'center',
        marginBottom: 50,
    },
    sendButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
