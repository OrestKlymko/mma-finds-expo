import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SubmittedFighterList} from './SubmittedFighterList';
import React from 'react';
import colors from '@/styles/colors';
import {useSubmittedFilterFighter} from "@/context/SubmittedFilterFighterContext";
import {useRouter} from "expo-router";

type Props = {
  fighters: any[];
  offer: any;
};

export const SubmittedFightersSection = ({fighters, offer}: Props) => {

  const {setAvailableFilters} = useSubmittedFilterFighter();
  const router = useRouter();
  return (
    <>
      <Text style={styles.eventTitle}>Submitted Fighters</Text>
      <SubmittedFighterList
        fighters={fighters.slice(0, 3)}
        scrollEnabled={false}
        onSelectFighter={item => {
          router.push({
            pathname: `/manager/fighter/${item.id}/offer/select`,
            params: {
              offerId: offer?.offerId ?? null,
              currency: offer?.currency,
              eligibleToSelect: (
                  !(offer?.closedReason && offer?.closedReason !== '')
              ).toString(),
            },
          })
        }}
      />
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => {
          setAvailableFilters(prev => ({
            ...prev,
            offerId: offer?.offerId ?? null,
          }));
          router.push({
            pathname: `/public/${offer.offerId}/fighter`,
            params: {
              currency: offer?.currency,
              eligibleToSelect: (
                  !(offer?.closedReason && offer?.closedReason !== '')
              ).toString(),
            },
          })
        }}>
        <Text style={styles.ctaButtonText}>See the List</Text>
      </TouchableOpacity>
    </>
  );
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
  ctaButton: {
    backgroundColor: colors.primaryGreen,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    height: 56,
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  eventSummaryContainer: {
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
});
