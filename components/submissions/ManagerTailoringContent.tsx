import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {PublicOfferInfo, ShortInfoFighter} from "@/service/response";
import {SubmittedInformationPublicOffer} from "@/models/tailoring-model";
import {useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import {ChatOfferComponent} from "@/components/offers/ChatOfferComponent";

import colors from "@/styles/colors";
import {ManagerSubmittedFighterList} from "@/components/submissions/ManagerSubmittedFighterList";
import {ManagerTailoringStatus} from "@/components/submissions/ManagerTailoringStatus";



type ManagerTailoringContentProps = {
    fighters: ShortInfoFighter[];
    offer: PublicOfferInfo | null | undefined;
    submittedInformation?: SubmittedInformationPublicOffer | undefined | null;
    selectedTab:
        | 'Preselected Fighter'
        | 'Submitted Fighters'
        | 'Selected Fighter';
    previousInfo?: SubmittedInformationPublicOffer | null;
    onRefreshFighterList: () => void;
};

export const ManagerTailoringContent = ({
                                            fighters,
                                            offer,
                                            submittedInformation,
                                            previousInfo,
                                            onRefreshFighterList,
                                            selectedTab,
                                        }: ManagerTailoringContentProps) => {
    const router = useRouter();
    switch (selectedTab) {
        case 'Preselected Fighter':
            return (
                <>
                    <SubmittedFighterList
                        fighters={fighters.filter(
                            fighter => fighter.id === offer?.chooseFighterId,
                        )}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            router.push('/promotionfighterdetailofferscreen')
                        }}
                    />
                    {/*    TODO: FIX PATH*/}
                    {submittedInformation?.statusResponded !== 'REJECTED' && (
                        <ChatOfferComponent
                            avatar={
                                fighters.filter(f => f.id === offer?.chooseFighterId)[0]
                                    .managerAvatar
                            }
                            offer={offer}
                            receiverUserId={
                                fighters.filter(f => f.id === offer?.chooseFighterId)[0]
                                    .managerId
                            }
                            senderName={
                                fighters.filter(f => f.id === offer?.chooseFighterId)[0]
                                    .managerName
                            }
                            typeOffer={'Public'}
                        />
                    )}
                    <ManagerTailoringStatus
                        typeOffer={'Public'}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                </>
            );
        case 'Selected Fighter':
            return (
                <>
                    <Text style={styles.eventTitle}>Selected Fighter</Text>
                    <SubmittedFighterList
                        fighters={fighters.filter(
                            fighter => fighter.id === offer?.chooseFighterId,
                        )}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            router.push('/promotionfighterdetailofferscreen')
                        }}
                    />
                    <ChatOfferComponent
                        avatar={
                            fighters.filter(f => f.id === offer?.chooseFighterId)[0]
                                .managerAvatar
                        }
                        offer={offer}
                        receiverUserId={
                            fighters.filter(f => f.id === offer?.chooseFighterId)[0].managerId
                        }
                        senderName={
                            fighters.filter(f => f.id === offer?.chooseFighterId)[0]
                                .managerName
                        }
                        typeOffer={'Public'}
                    />
                    <TouchableOpacity
                        style={styles.ctaButtonCancel}
                        onPress={() => {
                            if (!offer || !offer.offerId || !offer.chooseFighterId) return;
                            router.navigate('RejectOffer', {
                                offerId: offer?.offerId,
                                fighterId: offer?.chooseFighterId,
                                typeOffer: 'Public',
                            });
                        }}>
                        <Text style={{color: colors.darkError}}>Cancel Participation</Text>
                    </TouchableOpacity>
                    <ManagerTailoringStatus
                        typeOffer={'Public'}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                    <DocumentTailoring kind={'public'} offer={offer} />
                </>
            );
        case 'Submitted Fighters':
            return (
                <ManagerSubmittedFighterList
                    fighters={fighters}
                    offer={offer}
                    onRefreshFighterList={onRefreshFighterList}
                />
            );
        default:
            return null;
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