import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '@/styles/colors';
import React from 'react';
import {
    ExclusiveOfferInfo,
    ShortInfoFighter,
    SubmittedInformationOffer,
} from '@/service/response';
import FighterCard from "@/components/FighterCard";
import {ChatOfferComponent} from "@/components/offers/ChatOfferComponent";
import {ManagerTailoringStatus} from "@/components/submissions/ManagerTailoringStatus";
import {DocumentTailoring} from "@/components/DocumentTailoring";
import {useRouter} from "expo-router";

type ManagerTailoringContentProps = {
    fighters: ShortInfoFighter;
    offer: ExclusiveOfferInfo | null | undefined;
    submittedInformation?: SubmittedInformationOffer | undefined | null;
    previousInfo?: SubmittedInformationOffer | null;
};

export const ExclusiveManagerTailoringContent = ({
                                                     fighters,
                                                     offer,
                                                     submittedInformation,
                                                     previousInfo,
                                                 }: ManagerTailoringContentProps) => {


    const router = useRouter();
    switch (submittedInformation?.statusResponded) {
        case 'REJECTED':
            return (
                <>
                    <FighterCard
                        fighter={fighters}
                        onPress={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    <ManagerTailoringStatus
                        offer={offer}
                        typeOffer={'Exclusive'}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                </>
            );
        case 'ACCEPTED':
            return (
                <>
                    <Text style={styles.eventTitle}>Selected Fighter</Text>
                    <FighterCard
                        fighter={fighters}
                        onPress={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    {offer && (
                        <ChatOfferComponent
                            avatar={offer?.promotionAvatar}
                            offer={offer}
                            receiverUserId={offer?.promotionId}
                            senderName={offer?.promotionName}
                            typeOffer={'Exclusive'}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.ctaButtonCancel}
                        onPress={() => {
                            if (!offer || !offer.offerId || !offer.fighterId) return;
                            router.push({
                                pathname: '/offer/reject',
                                params: {
                                    offerId: offer?.offerId,
                                    fighterId: offer?.fighterId,
                                    typeOffer: 'Exclusive',
                                }
                            })
                        }}>
                        <Text style={{color: colors.darkError}}>Cancel Participation</Text>
                    </TouchableOpacity>
                    <ManagerTailoringStatus
                        offer={offer}
                        typeOffer={'Exclusive'}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                    <DocumentTailoring kind={'exclusive'} offer={offer}/>
                </>
            );
        default:
            return (
                <>
                    <FighterCard
                        fighter={fighters}
                        onPress={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    {offer && (
                        <ChatOfferComponent
                            avatar={offer?.promotionAvatar}
                            offer={offer}
                            receiverUserId={offer?.promotionId}
                            senderName={offer?.promotionName}
                            typeOffer={'Exclusive'}
                        />
                    )}
                    <ManagerTailoringStatus
                        offer={offer}
                        typeOffer={'Exclusive'}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                </>
            );
    }
};

const styles = StyleSheet.create({
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 24,
        marginTop: 10,
        color: colors.primaryGreen,
        position: 'relative',
    },
    ctaButtonCancel: {
        justifyContent: 'center',
        height: 24,
        alignItems: 'center',
    },
});
