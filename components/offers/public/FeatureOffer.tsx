import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import colors from '@/styles/colors';
import React from 'react';
import {featureYourOffer} from '@/service/service';
import {PublicOfferInfo} from '@/service/response';
import {useRouter} from "expo-router";

type Props = {
  offer: PublicOfferInfo | null | undefined;
};

export const FeatureOffer = ({offer}: Props) => {
  const [featureOfferLoading, setFeatureOfferLoading] = React.useState(false);
  const router =useRouter();
  const handleFeatureOffer = () => {
    setFeatureOfferLoading(true);
    if (!offer?.offerId) {
      Alert.alert('Error', 'Invalid offer ID');
      setFeatureOfferLoading(false);
      return;
    }
    featureYourOffer(offer?.offerId)
      .then(() => {
        router.push('/offer/public/success/top');
      })
      .catch(error => {
        if (error.response.status === 406) {
          router.push({
            pathname:'/profile/settings/payment/credit',
            params: {
              offerId: offer?.offerId,
              fighterId: undefined,
            },
          })
        }
      })
      .finally(() => {
        setFeatureOfferLoading(false);
      });
  };

  return (
    <>
      {offer && (!offer?.closedReason || offer?.closedReason === '') && (
        <>
          {!offer.isOfferFeatured ? (
            <TouchableOpacity
              style={styles.featureButton}
              onPress={handleFeatureOffer}
              disabled={featureOfferLoading}>
              {featureOfferLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.featureButtonText}>Feature This Offer</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.summaryRowCenteredFeatured}>
              <Text style={styles.summaryLabel}>Featured Offer</Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  featureButton: {
    backgroundColor: colors.primaryGreen,
    paddingVertical: 8,
    height: 46,
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryRowCenteredFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 4,
    paddingVertical: 12,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.primaryBlack,
  },
});
