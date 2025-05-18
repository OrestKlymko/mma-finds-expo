import React from 'react';
import {Share, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import appsFlyer from "react-native-appsflyer";

import colors from '@/styles/colors';
import {ExclusiveOfferInfo, MultiContractFullInfo, PublicOfferInfo, ShortInfoFighter,} from '@/service/response';
import {formatDateFromLocalDate} from "@/utils/utils";

type Props = {
    offer:
        | PublicOfferInfo
        | ExclusiveOfferInfo
        | MultiContractFullInfo
        | null
        | undefined;
    typeOffer: 'Public' | 'Exclusive' | 'Multi-fight contract';
    fighter?: ShortInfoFighter | null | undefined;
};


export const ShareOffer: React.FC<Props> = ({offer, typeOffer, fighter}) => {
    const shareOffer = async () => {
        if (!offer) return;
        switch (typeOffer) {
            case 'Public':
                await sharePublicOffer(offer as PublicOfferInfo, makeLink);
                break;
        }
    };

    const makeLink = (customParams: Record<string, any>) =>
        new Promise<string>((resolve, reject) => {
            appsFlyer.generateInviteLink(
                {
                    channel: 'share',
                    campaign: 'offer_share',
                    userParams: customParams,
                },
                (url) => resolve(url),
                (e) => reject(e),
            );
        });

    const formatOpponentDetails = (o: PublicOfferInfo | ExclusiveOfferInfo) => {
        if (o.opponentName) {
            return `\nOpponent: ${o.opponentName}\n`;
        }
        const rule = o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur';
        return `\nOpponent: ${o.opponentName} (${rule} ${
            o.sportType
        } Record: ${getRecord(o)})`;
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
            ? `\nLocation: ${o.eventLocation.slice(0, 20)}...`
            : `\nLocation: ${o.eventLocation}`;
    };


    // const sharePublicOffer = async (o: PublicOfferInfo) => {
    //     const control: any = {
    //         offerId: o.offerId,
    //         params: {
    //             $fallback_url: `https://api.mmafinds.com/api/share-offer/public/${o.offerId}`,
    //             $desktop_url: `https://api.mmafinds.com/api/share-offer/public/${o.offerId}`,
    //             $ios_url: `com.mmafinds.app://offer/public/${o.offerId}`,
    //             $android_url: `com.mmafinds.app://offer/public/${o.offerId}`,
    //         },
    //     };
    //
    //     const shortUrl = await createShortUrl(`public-offer/${o.offerId}`, control);
    //
    //     const message = `\nEvent: ${o.eventName}\nDate: ${formatDateFromLocalDate(
    //         o.eventDate,
    //     )}${reworkLocation(o)}\nSport: ${
    //         o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur'
    //     } ${o.sportType}${formatOpponentDetails(o)}\nWeight Class: ${
    //         o.weightClass
    //     }\nFighter Nationality: ${
    //         o.country
    //     }\n\nFull fight details are now available in the MMA Finds app. Don’t miss your chance – apply today!\n\nClick here: ${shortUrl}`.trim();
    //
    //     await Share.share({message, title: 'New Fight Offer!'});
    // };

    const sharePublicOffer = async (
        o: PublicOfferInfo,
        makeLink: (p: Record<string, any>) => Promise<string>
    ) => {
        const params = {
            offerId: o.offerId,
            type: 'public',
        };
        const shortUrl = await makeLink(params);

        const message = `
Event: ${o.eventName}
Date: ${formatDateFromLocalDate(o.eventDate)}
Location: ${o.eventLocation}
Sport: ${o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur'} ${o.sportType}
Opponent: ${o.opponentName}
Weight Class: ${o.weightClass}

Full fight details in MMA Finds app.
Click here: ${shortUrl}
    `.trim();

        await Share.share({message, title: 'New Fight Offer!'});
    };
    // const shareExclusiveOffer = async (o: ExclusiveOfferInfo) => {
    //     const control = {
    //         offerId: o.offerId,
    //         params: {
    //             $fallback_url: `https://api.mmafinds.com/api/share-offer/exclusive/${o.offerId}`,
    //             $desktop_url: `https://api.mmafinds.com/api/share-offer/exclusive/${o.offerId}`,
    //             $ios_url: `com.mmafinds.app://offer/exclusive/single/${o.offerId}`,
    //             $android_url: `com.mmafinds.app://offer/exclusive/single/${o.offerId}`,
    //         },
    //         og: {
    //             $og_title: `Fight Offer: ${o.eventName}`,
    //             $og_description: `Check out ${o.eventName} in ${o.eventLocation}.`,
    //             $og_image_url: o.eventImageLink,
    //         },
    //     };
    //
    //     const shortUrl = await createShortUrl(
    //         `exclusive-offer/${o.offerId}`,
    //         control,
    //     );
    //
    //     const message = `\nEvent: ${o.eventName}\nDate: ${formatDateFromLocalDate(
    //         o.eventDate,
    //     )}${reworkLocation(o)}\nSport: ${
    //         o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur'
    //     } ${o.sportType}${formatOpponentDetails(o)}\nWeight Class: ${
    //         o.weightClass
    //     }\n\nFull fight details are now available in the MMA Finds app.\n\nClick here: ${shortUrl}`.trim();
    //
    //     await Share.share({message, title: 'New Fight Offer!'});
    // };
    //
    // const shareMultiFightOffer = async (o: MultiContractFullInfo) => {
    //
    //     const control = {
    //         offerId: o.offerId,
    //         params: {
    //             $fallback_url: `https://api.mmafinds.com/api/share-offer/multi-fight-contract/${o.offerId}`,
    //             $desktop_url: `https://api.mmafinds.com/api/share-offer/multi-fight-contract/${o.offerId}`,
    //             $ios_url: `com.mmafinds.app://offer/exclusive/multi/${o.offerId}`,
    //             $android_url: `com.mmafinds.app://offer/exclusive/multi/${o.offerId}`,
    //         },
    //         og: null,
    //     };
    //
    //     const shortUrl = await createShortUrl(
    //         `multi-fight-contract/${o.offerId}`,
    //         control,
    //     );
    //
    //     const message = `\nPromotion: ${o.promotionName}\nYour Fighter: ${
    //         fighter?.formattedName || fighter?.name || 'Not chosen'
    //     }\nSports: ${o.sportType.join(', ')}\nWeight Class: ${
    //         o.weightClass
    //     }\nTerm: ${o.numberOfFight} Fights, ${
    //         o.durationContractMonth
    //     } Months\n\nFull fight details are now available in the MMA Finds app.\n\nClick here: ${shortUrl}`.trim();
    //
    //     await Share.share({message, title: 'New Fight Offer!'});
    // };

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
