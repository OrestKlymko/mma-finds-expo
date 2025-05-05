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

    let offer: PublicOfferInfo | ExclusiveOfferInfo | undefined;
    let submittedInformation: SubmittedInformationOffer | undefined;
    let previousInformation: SubmittedInformationOffer | undefined;

    try {
        if (params.offer) offer = JSON.parse(params.offer);
        if (params.submittedInformation) submittedInformation = JSON.parse(params.submittedInformation);
        if (params.previousInformation) previousInformation = JSON.parse(params.previousInformation);
    } catch (e) {
        console.warn("Failed to parse JSON from params", e);
    }


    const [newOffer, setNewOffer] = useState({
        fightPurse: '',
        winBonus: '',
        finishBonus: '',
    });

    const [editingField, setEditingField] = useState<string | null>(null);

    const handleOfferSend = () => {
        if (
            !newOffer.fightPurse ||
            newOffer.fightPurse.trim() === '' ||
            !newOffer.winBonus ||
            newOffer.winBonus.trim() === '' ||
            !newOffer.finishBonus ||
            newOffer.finishBonus.trim() === ''
        ) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (!offerId || !fighterId) {
            Alert.alert('Error', 'Invalid offer or fighter ID');
            return;
        }
        const data: ResponsorOfferRequest = {
            offerId: offerId,
            fighterId: fighterId,
            negotiateRequest: {
                fightPurse: parseFloat(newOffer.fightPurse),
                winBonus: parseFloat(newOffer.winBonus),
                finishBonus: parseFloat(newOffer.finishBonus),
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
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                setEditingField(null);
                Keyboard.dismiss();
            }}>
            <ScrollView style={{flex: 1, backgroundColor: colors.background}}>
                <GoBackButton />
                <View style={styles.container}>
                    {offer?.eventImageLink && (
                        <Image
                            source={{uri: offer.eventImageLink}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}

                    <Text style={styles.title}>Negotiate the Offer</Text>
                    <Text style={styles.subtitle}>
                        Propose the price you can offer and send it!
                    </Text>

                    {previousInformation&&
                        <PriceRow
                            title="Offered Purse"
                            values={[
                                previousInformation?.fightPurse ?? '',
                                previousInformation?.winPurse ?? '',
                                previousInformation?.bonusPurse ?? '',
                            ]}
                            currency={getCurrencySymbol(previousInformation?.currency)}
                        />
                    }
                    <PriceRow
                        title="Negotiated Purse"
                        values={[
                            submittedInformation?.fightPurse ?? '',
                            submittedInformation?.winPurse ?? '',
                            submittedInformation?.bonusPurse ?? '',
                        ]}
                        currency={getCurrencySymbol(previousInformation?.currency)}
                    />

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
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default NegotiationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    image: {
        paddingHorizontal: 20,
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
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
