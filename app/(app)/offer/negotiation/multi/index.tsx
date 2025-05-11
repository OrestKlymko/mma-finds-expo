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
import {getCurrencySymbol} from "@/utils/utils";
import {MultiContractFullInfo, SubmittedInformationOffer,} from '@/service/response';
import {negotiationDocumentForMultiFightOffer} from '@/service/service';
import {CreateMultiOfferTailoringRequest} from '@/service/request';
import {useLocalSearchParams, useRouter} from "expo-router";
import {PriceRow} from "@/components/PriceRow";
import {MultiFightNewOfferComponent} from "@/components/offers/exclusive-multi/MultiFightNewOfferComponent";

const MultiFightOfferNegotiationScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const offer = JSON.parse(params.offer as string) as MultiContractFullInfo
    const submittedInformation = JSON.parse(params.submittedInformation as string) as SubmittedInformationOffer[]
    const previousInformation = JSON.parse(params.previousInformation as string) as SubmittedInformationOffer[]

    const [newOffers, setNewOffers] = useState<
        Record<number, { fightPurse: string; winBonus: string; finishBonus: string }>
    >({});


    const handleOfferSend = () => {
        if (!submittedInformation || submittedInformation.length === 0) {
            Alert.alert('Error', 'No submitted information available');
            return;
        }

        for (const info of submittedInformation) {
            const slot = newOffers[info.fightNumber!] || {};
            if (!slot.fightPurse || !slot.winBonus || !slot.finishBonus) {
                Alert.alert(
                    'Error',
                    `Please fill all fields for Fight ${info.fightNumber}`
                );
                return;
            }
        }

        // збір List<MultiFightPurse>
        const purses = submittedInformation?.map(info => {
            const {fightPurse, winBonus, finishBonus} =
                newOffers[info.fightNumber!]!;
            return {
                index: info.fightNumber!,
                values: {
                    fight: parseFloat(fightPurse),
                    win: parseFloat(winBonus),
                    bonus: parseFloat(finishBonus),
                },
            };
        });

        const data: CreateMultiOfferTailoringRequest = {
            offerId: submittedInformation[0]!.offerId!,
            fighterId: submittedInformation[0]!.fighterId!,
            purses,
        };

        negotiationDocumentForMultiFightOffer(data)
            .then(() => router.push('/(app)/(tabs)'))
            .catch(() => {
                Alert.alert('Error', 'Failed to send multi-fight negotiation');
            });
    };

    const renderMultiFightPriceState = (
        index: number,
        info: SubmittedInformationOffer,
    ) => {

        if (previousInformation && previousInformation.length > 0) {
            return (
                <>
                    <PriceRow
                        title="Offered Purse"
                        values={[
                            previousInformation?.at(index)?.fightPurse ?? '',
                            previousInformation?.at(index)?.winPurse ?? '',
                            previousInformation?.at(index)?.bonusPurse ?? '',
                        ]}
                        currency={getCurrencySymbol(offer?.currency)}
                    />

                    <PriceRow
                        title="Negotiated Purse"
                        values={[
                            info.fightPurse ?? '',
                            info.winPurse ?? '',
                            info.bonusPurse ?? '',
                        ]}
                        currency={getCurrencySymbol(info.currency)}
                    />
                </>
            );
        } else {
            return (
                <PriceRow
                    title="Offered Purse"
                    values={[
                        info.fightPurse ?? '',
                        info.winPurse ?? '',
                        info.bonusPurse ?? '',
                    ]}
                    currency={getCurrencySymbol(info.currency)}
                />
            );
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}>
            <ScrollView style={{flex: 1, backgroundColor: colors.background}}>
                <GoBackButton/>
                <View style={styles.container}>
                    {offer?.promotionAvatar && (
                        <Image
                            source={{uri: offer.promotionAvatar}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}

                    <Text style={styles.title}>Negotiate the Offer</Text>
                    <Text style={styles.subtitle}>
                        Propose the price you can offer and send it!
                    </Text>


                    {submittedInformation?.map((info, index) => {
                        const fightNum = info.fightNumber!;
                        const slot = newOffers[fightNum] || {
                            fightPurse: '',
                            winBonus: '',
                            finishBonus: '',
                        };

                        return (
                            <View key={fightNum} style={{marginBottom: 20}}>
                                {/* Назва бою */}
                                <Text style={[styles.titleFight, {marginBottom: 15}]}>
                                    Fight {fightNum}
                                </Text>
                                {renderMultiFightPriceState(index, info)}

                                <MultiFightNewOfferComponent
                                    newOffer={slot}
                                    setNewOffer={updatedSlot =>
                                        setNewOffers(prev => ({...prev, [fightNum]: updatedSlot}))
                                    }/>
                            </View>
                        );
                    })}


                    <TouchableOpacity style={styles.sendButton} onPress={handleOfferSend}>
                        <Text style={styles.sendButtonText}>Send Offer</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default MultiFightOfferNegotiationScreen;

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
    titleFight: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 8,
        textAlign: 'center',
    }
});
