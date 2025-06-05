import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {PublicOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from "@/service/response";
import {SubmittedInformationPublicOffer} from "@/models/tailoring-model";
import {useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import {ChatOfferComponent} from "@/components/offers/ChatOfferComponent";

import colors from "@/styles/colors";
import {ManagerSubmittedFighterList} from "@/components/submissions/ManagerSubmittedFighterList";
import {ManagerTailoringStatus} from "@/components/submissions/ManagerTailoringStatus";
import {DocumentTailoring} from "@/components/DocumentTailoring";


type ManagerTailoringContentProps = {
    fighters: ShortInfoFighter[];
    offer: PublicOfferInfo | null | undefined;
    submittedInformation?: SubmittedInformationOffer | undefined | null;
    chosenFighter: ShortInfoFighter | undefined;
    selectedTab:
        | 'Preselected Fighter'
        | 'Submitted Fighters'
        | 'Selected Fighter';
    previousInfo?: SubmittedInformationOffer | null;
    onRefreshFighterList: () => void;
};

export const ManagerTailoringContent = ({
                                            fighters,
                                            offer,
                                            submittedInformation,
                                            previousInfo,
                                            chosenFighter,
                                            onRefreshFighterList,
                                            selectedTab,
                                        }: ManagerTailoringContentProps) => {
    const router = useRouter();
    switch (selectedTab) {
        case 'Preselected Fighter':
            return (
                <>
                    <SubmittedFighterList
                        fighters={[chosenFighter]}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            // router.push('/')
                        }}
                    />
                    {submittedInformation?.statusResponded !== 'REJECTED' && (
                        <ChatOfferComponent
                            avatar={
                                chosenFighter?.managerAvatar
                            }
                            offer={offer}
                            receiverUserId={
                                chosenFighter?.managerId
                            }
                            senderName={
                                chosenFighter?.managerName
                            }
                            typeOffer={'Public'}
                        />
                    )}
                    <ManagerTailoringStatus
                        offer={offer}
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
                            router.push(`/manager/fighter/${item.id}/offer/select`)
                        }}
                    />
                    <ChatOfferComponent
                        avatar={
                            chosenFighter?.managerAvatar
                        }
                        offer={offer}
                        receiverUserId={
                            chosenFighter?.managerId
                        }
                        senderName={
                            chosenFighter?.managerName
                        }
                        typeOffer={'Public'}
                    />
                    <TouchableOpacity
                        style={styles.ctaButtonCancel}
                        onPress={() => {
                            if (!offer || !offer.offerId || !offer.chooseFighterId) return;
                            router.push({
                                pathname: '/offer/reject',
                                params: {
                                    offerId: offer?.offerId,
                                    fighterId: offer?.chooseFighterId,
                                    typeOffer: 'Public',
                                }
                            })
                        }}>
                        <Text style={{color: colors.darkError}}>Cancel Participation</Text>
                    </TouchableOpacity>
                    <ManagerTailoringStatus
                        offer={offer}
                        typeOffer={'Public'}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                    <DocumentTailoring kind={'public'} offer={offer}/>
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
