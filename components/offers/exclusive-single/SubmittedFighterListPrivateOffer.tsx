import React from 'react';
import {FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PrivateOfferFighterCard from "@/components/offers/exclusive-single/PrivateOfferFighterCard";
import {OfferTypeEnum} from "@/models/model";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

interface SubmittedFighterListProps {
    fighters?: any[];
    onSelectFighter: (fighter: any) => void;
    scrollEnabled?: boolean;
    submittedInformation?: any;
    offer?: any;
}

export function SubmittedFighterListPrivateOffer({
                                                     fighters,
                                                     offer,
                                                     onSelectFighter
                                                 }: SubmittedFighterListProps) {
    const router = useRouter();
    return (
        <>
            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={fighters}
                scrollEnabled={false}
                keyExtractor={(item, index) => String(item?.id || index)}
                renderItem={({item}) => (
                    <PrivateOfferFighterCard fighter={item} onPress={onSelectFighter}/>
                )}
            />
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                    if (!offer) return;
                    router.push({
                        pathname: '/manager/submissions/submit', params: {
                            offer: JSON.stringify(offer),
                            submittedFighters: JSON.stringify(fighters),
                            offerType: JSON.stringify(OfferTypeEnum.EXCLUSIVE),
                        }
                    })
                }}>
                <Text style={styles.submitText}>Submit Fighter</Text>
            </TouchableOpacity></>
    );
}

const styles = StyleSheet.create({
    submitText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
})
