import React from 'react';
import {Share, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import appsFlyer from "react-native-appsflyer";

import colors from '@/styles/colors';
import {ExclusiveOfferInfo, PublicOfferInfo, ShortInfoFighter,} from '@/service/response';
import {formatDateFromLocalDate} from "@/utils/utils";
import {OfferTypeEnum} from "@/models/model";
import {useAuth} from "@/context/AuthContext";

type Props = {
    offer:
        | PublicOfferInfo
        | ExclusiveOfferInfo
        | null
        | undefined;
    typeOffer: OfferTypeEnum;
    fighter?: ShortInfoFighter | null | undefined;
};


export const ShareOffer: React.FC<Props> = ({offer, typeOffer}) => {
    const {entityId} = useAuth()
    const shareOffer = async () => {
        if (!offer) return;
        await handleShareOffer(offer, typeOffer === OfferTypeEnum.PUBLIC ? 'public' : 'private', makeLink)
    };

    const makeLink = (custom: Record<string, any>) =>
        new Promise<string>((resolve, reject) => {
            const privateOfferDeepLink = `com.mmafinds.app://offers/private/${offer?.offerId}`;
            const publicOfferDeepLink = `com.mmafinds.app://offers/public/${offer?.offerId}`;
            appsFlyer.generateInviteLink(
                {
                    brandDomain: 'links.mmafinds.com',   // your custom domain
                    deeplinkPath: typeOffer === OfferTypeEnum.PUBLIC ? publicOfferDeepLink : privateOfferDeepLink,
                    channel: 'share',
                    campaign: 'offer_share',
                    userParams: {
                        ...custom,
                        entityInvite: entityId,
                        af_dp: typeOffer === OfferTypeEnum.PUBLIC ? publicOfferDeepLink : privateOfferDeepLink,
                        af_force_deeplink: 'true' //TODO Remove this when we will have a stable version of the app
                    }
                },
                url => resolve(url),
                err => reject(err)
            );
        });


    const formatOpponentDetails = (o: PublicOfferInfo | ExclusiveOfferInfo) => {
        if (o.opponentName) {
            return `Opponent - ${o.opponentName}`;
        }
        const rule = o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur';
        return `Opponent - ${o.opponentName} (${rule} ${
            o.sportType
        } Record - ${getRecord(o)})`;
    };

    const getRecord = (o: PublicOfferInfo | ExclusiveOfferInfo) => {
        const amateur = `${o.opponentAmateurWins}-${o.opponentAmateurLosses}-${o.opponentAmateurDraws}`;
        return amateur === '0-0-0'
            ? `${o.opponentProWins}-${o.opponentProLosses}-${o.opponentProDraws}`
            : amateur;
    };

    const reworkLocation = (o: PublicOfferInfo | ExclusiveOfferInfo) => {
        if (!o.eventLocation) return '';
        return o.eventLocation.length > 20
            ? `Location - ${o.eventLocation.slice(0, 20)}...`
            : `Location - ${o.eventLocation}`;
    };


    const handleShareOffer = async (
        o: ExclusiveOfferInfo | PublicOfferInfo,
        type: 'private' | 'public',
        makeLink: (p: Record<string, any>) => Promise<string>
    ) => {
        const params = {
            offerId: o.offerId,
            type: type,
        };
        const shortUrl = await makeLink(params);

        const message = `Event - ${o.eventName}
Date - ${formatDateFromLocalDate(o.eventDate)}
${reworkLocation(o)}
Sport - ${o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur'} ${o.sportType}
${formatOpponentDetails(o)}
Weight Class - ${o.weightClass}
Fighter Nationality - ${o.opponentNationality}

Full fight details are now available in the MMA Finds app. Don’t miss your chance – apply today!
    `.trim();

        await Share.share({message, title: 'New Fight Offer!', url: shortUrl});
    };

    return (
        <TouchableOpacity onPress={shareOffer} style={styles.buttonContainer}>
            <Text style={styles.featureButtonText}>Share Offer</Text>
            <Icon name="share" size={20} color={colors.white}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primaryBlack,
        paddingVertical: 8,
        height: 46,
        borderRadius: 4,
        width: '100%',
        marginBottom: 8,
    },
    featureButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 14,
        marginRight: 8,
    },
});
