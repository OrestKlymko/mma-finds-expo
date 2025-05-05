import React from 'react';
import {Share, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
// import branch, {BranchLinkControlParams, BranchLinkProperties,} from 'react-native-branch';

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
        await sharePublicOffer(offer as PublicOfferInfo);
        break;
      case 'Exclusive':
        await shareExclusiveOffer(offer as ExclusiveOfferInfo);
        break;
      case 'Multi-fight contract':
        await shareMultiFightOffer(offer as MultiContractFullInfo);
        break;
    }
  };

  const formatOpponentDetails = (o: PublicOfferInfo | ExclusiveOfferInfo) => {
    if (o.opponentName && o.opponentTapologyLink) {
      return `\nOpponent: ${o.opponentName}\nTapology: ${o.opponentTapologyLink}`;
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

  const createShortUrl = async (
    identifier: string,
    control: any,
  ) => {
    // const linkProps: BranchLinkProperties = {feature: 'share', channel: 'app'};
    // const buo = await branch.createBranchUniversalObject(identifier, {
    //   ...(control.og
    //     ? {
    //         title: control.og.$og_title,
    //         contentDescription: control.og.$og_description,
    //         contentImageUrl: control.og.$og_image_url,
    //       }
    //     : {}),
    //   contentMetadata: {customMetadata: {offerId: control.offerId}},
    // });
    // const {url} = await buo.generateShortUrl(linkProps, control.params);
    // return url;
  };

  const sharePublicOffer = async (o: PublicOfferInfo) => {
    const control: any = {
      offerId: o.offerId,
      params: {
        $fallback_url: `https://wet-times-kneel.loca.lt/api/share-offer/public/${o.offerId}`,
        $desktop_url: `https://wet-times-kneel.loca.lt/api/share-offer/public/${o.offerId}`,
        $ios_url: `mmafinds://public-offer/${o.offerId}`,
        $android_url: `mmafinds://public-offer/${o.offerId}`,
      },
    };

    const shortUrl = await createShortUrl(`public-offer/${o.offerId}`, control);

    const message = `\nEvent: ${o.eventName}\nDate: ${formatDateFromLocalDate(
      o.eventDate,
    )}${reworkLocation(o)}\nSport: ${
      o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur'
    } ${o.sportType}${formatOpponentDetails(o)}\nWeight Class: ${
      o.weightClass
    }\nFighter Nationality: ${
      o.country
    }\n\nFull fight details are now available in the MMA Finds app. Don’t miss your chance – apply today!\n\nClick here: ${shortUrl}`.trim();

    await Share.share({message, title: 'New Fight Offer!'});
  };

  const shareExclusiveOffer = async (o: ExclusiveOfferInfo) => {
    const control = {
      offerId: o.offerId,
      params: {
        $fallback_url: `https://wet-times-kneel.loca.lt/api/share-offer/exclusive/${o.offerId}`,
        $desktop_url: `https://wet-times-kneel.loca.lt/api/share-offer/exclusive/${o.offerId}`,
        $ios_url: `mmafinds://exclusive-offer/${o.offerId}`,
        $android_url: `mmafinds://exclusive-offer/${o.offerId}`,
      },
      og: {
        $og_title: `Fight Offer: ${o.eventName}`,
        $og_description: `Check out ${o.eventName} in ${o.eventLocation}.`,
        $og_image_url: o.eventImageLink,
      },
    };

    const shortUrl = await createShortUrl(
      `exclusive-offer/${o.offerId}`,
      control,
    );

    const message = `\nEvent: ${o.eventName}\nDate: ${formatDateFromLocalDate(
      o.eventDate,
    )}${reworkLocation(o)}\nSport: ${
      o.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur'
    } ${o.sportType}${formatOpponentDetails(o)}\nWeight Class: ${
      o.weightClass
    }\n\nFull fight details are now available in the MMA Finds app.\n\nClick here: ${shortUrl}`.trim();

    await Share.share({message, title: 'New Fight Offer!'});
  };

  const shareMultiFightOffer = async (o: MultiContractFullInfo) => {
    const control = {
      offerId: o.offerId,
      params: {
        $fallback_url: `https://wet-times-kneel.loca.lt/api/share-offer/multi-fight-contract/${o.offerId}`,
        $desktop_url: `https://wet-times-kneel.loca.lt/api/share-offer/multi-fight-contract/${o.offerId}`,
        $ios_url: `mmafinds://multi-fight-contract/${o.offerId}`,
        $android_url: `mmafinds://multi-fight-contract/${o.offerId}`,
      },
      og: null,
    };

    const shortUrl = await createShortUrl(
      `multi-fight-contract/${o.offerId}`,
      control,
    );

    const message = `\nPromotion: ${o.promotionName}\nYour Fighter: ${
      fighter?.formattedName || fighter?.name || 'Not chosen'
    }\nSports: ${o.sportType.join(', ')}\nWeight Class: ${
      o.weightClass
    }\nTerm: ${o.numberOfFight} Fights, ${
      o.durationContractMonth
    } Months\n\nFull fight details are now available in the MMA Finds app.\n\nClick here: ${shortUrl}`.trim();

    await Share.share({message, title: 'New Fight Offer!'});
  };

  return (
    <TouchableOpacity onPress={shareOffer} style={styles.buttonContainer}>
      <Text style={styles.featureButtonText}>Share Offer</Text>
      <Icon name="share" size={20} color={colors.white} />
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
