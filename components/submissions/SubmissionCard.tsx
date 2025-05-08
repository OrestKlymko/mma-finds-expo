import { OfferSubmissionResponse } from '@/service/request';
import { useRouter } from 'expo-router';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import colors from "@/styles/colors";
import {countDaysForAcceptance} from "@/utils/utils";


type SubmissionCardProps = {
    item: OfferSubmissionResponse;
    horizontal?: boolean;
    fighterId?: string;
};
export const SubmissionCard = ({
                                   item,
                                   horizontal = false,
                                   fighterId,
                               }: SubmissionCardProps) => {
    const router = useRouter();

    const showEventName = (offerSubmissionResponse: OfferSubmissionResponse) => {
        if (!offerSubmissionResponse) return 'Unknown';
        if (
            offerSubmissionResponse.typeOfSubmission.trim() !== 'Multi-fight contract'
        ) {
            return offerSubmissionResponse.eventName || 'No Event Name';
        } else {
            return 'Multi-fight contract';
        }
    };
    const navigateToSubmissionDetail = (
        offerSubmissionResponse: OfferSubmissionResponse,
    ) => {
        switch (offerSubmissionResponse.typeOfSubmission) {
            case 'Multi-fight contract':
                // TODO: FIX NAVIGATION TO SCREENS
                router.push('/(app)/profile/manager/offer');
                // navigation.navigate('ManagerMultiFightOfferDetailsScreen', {
                //     offerId: offerSubmissionResponse.offerId,
                //     fighterId: offerSubmissionResponse.fighterId,
                // });
                break;
            case 'Public':
                router.push('/(app)/profile/manager/offer');
                // navigation.navigate('ManagerSubmissionDetailScreen', {
                //     offerId: offerSubmissionResponse.offerId,
                //     fighterId: offerSubmissionResponse.fighterId || fighterId,
                // });
                break;
            case 'Exclusive':
                router.push('/(app)/profile/manager/offer');
                // navigation.navigate('ManagerExclusiveOfferDetailsScreen', {
                //     offerId: offerSubmissionResponse.offerId,
                //     fighterId: offerSubmissionResponse.fighterId,
                // });
                break;
        }
    };

    const screenWidth = Dimensions.get('window').width;
    const CARD_WIDTH = screenWidth - 30 * 2; // 38 зліва та 38 справа
    const setWidth = React.useMemo(() => {
        return horizontal ? {width: CARD_WIDTH, marginRight: 13} : {};
    }, [CARD_WIDTH, horizontal]);
    return (
        <TouchableOpacity
            onPress={() => navigateToSubmissionDetail(item)}
            style={[
                styles.submissionCard,
                setWidth,
                {marginRight: horizontal ? 10 : 0},
            ]}>
            <Image
                source={{
                    uri:
                        item.eventImageLink ||
                        'https://via.placeholder.com/125x120?text=No+Image',
                }}
                style={{
                    width: 125,
                    height: '100%',
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                }}
            />
            <View style={styles.submissionInfo}>
                <Text style={styles.submissionTitle}>{showEventName(item)}</Text>
                <Text style={styles.submissionDetail}>
                    Fighter Applied:
                    <Text style={{color: colors.primaryGreen}}>
                        {' '}
                        {item.formattedName || 'N/A'}
                    </Text>
                </Text>
                <View style={styles.submissionDetailWrapper}>
                    <Text style={styles.submissionDetail}>Type of submission: </Text>
                    <Text style={styles.submissionDetailText}>
                        {item.typeOfSubmission}
                    </Text>
                </View>
                <View style={styles.submissionDetailWrapper}>
                    <Text style={styles.submissionDetail}>
                        Offer will be reviewed in:{' '}
                    </Text>
                    <Text style={styles.submissionDetailText}>
                        {countDaysForAcceptance(item.dueDate)} days
                    </Text>
                </View>
                <View style={styles.submissionDetailWrapper}>
                    <Text style={styles.submissionDetail}>Fighter Status: </Text>
                    <Text style={styles.submissionDetailText}>{item.statusFighter}</Text>
                </View>
            </View>
            {item.closedReason && item.closedReason.trim().length > 0 && (
                <View style={styles.closedOverlay}>
                    <Text style={styles.closedOverlayText}>{item.closedReason}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    submissionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        height: 120,
        marginBottom: 10,
    },
    submissionInfo: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    submissionTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.primaryGreen,
        marginBottom: 10,
    },
    submissionDetail: {
        fontSize: 10,
        color: colors.primaryBlack,
        fontWeight: '500',
    },
    submissionDetailText: {
        fontSize: 10,
        fontWeight: '300',
    },

    submissionDetailWrapper: {
        flexDirection: 'row',
        marginBottom: 1,
    },
    closedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        zIndex: 10,
    },
    closedOverlayText: {
        color: colors.darkError,
        zIndex: 11,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    badgeContainer: {
        width: 125,
        height: '100%',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});