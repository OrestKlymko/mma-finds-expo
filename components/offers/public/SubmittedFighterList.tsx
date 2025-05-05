import React from 'react';
import {FlatList} from 'react-native';
import FighterCard from "@/components/FighterCard";

interface SubmittedFighterListProps {
  fighters?: any[];
  onSelectFighter: (fighter: any) => void;
  scrollEnabled?: boolean;
  submittedInformation?: any;
}

export function SubmittedFighterList({
  fighters,
  onSelectFighter,
  scrollEnabled = true,
}: SubmittedFighterListProps) {

  return (
    <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      data={fighters}
      scrollEnabled={scrollEnabled}
      keyExtractor={(item, index) => String(item?.id || index)}
      renderItem={({item}) => (
        <FighterCard fighter={item} onPress={onSelectFighter} />
      )}
    />
  );
}
