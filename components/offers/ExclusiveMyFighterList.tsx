import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';

import {ShortInfoFighter} from '@/service/response';
import FighterList from "@/app/(app)/manager/fighter";
import {
    confirmFighterParticipationExclusive,
    confirmFighterParticipationMultiFight,
    getFighterByManagerId
} from "@/service/service";
import {useAuth} from "@/context/AuthContext";
import ContentLoader from "@/components/ContentLoader";
import {useRouter} from "expo-router";


interface ExclusiveMyFighterListProps {
    offerType: 'Multi-Fight Offer' | 'Private Offer',
    fighter?: ShortInfoFighter | null,
    offerId?: string | undefined
}

const ExclusiveMyFighterList = ({offerType, fighter, offerId}: ExclusiveMyFighterListProps) => {
    const [moreInfoVisible, setMoreInfoVisible] = useState(false);
    const [myFighters, setMyFighters] = useState<ShortInfoFighter[]>([]);
    const [loading, setLoading] = useState(false);
    const {entityId} = useAuth();
    const router = useRouter();
    const selectFighter = async (fighter: ShortInfoFighter) => {
        if (!offerId) return;
        setLoading(true);
        if(offerType === 'Multi-Fight Offer'){
            await confirmFighterParticipationMultiFight(offerId, fighter.id);
        }else {
            await confirmFighterParticipationExclusive(offerId, fighter.id);
        }
        setLoading(false);
        router.push(`/(app)/(tabs)/feed`);
    }

    useEffect(() => {
        if (!entityId) return;
        getFighterByManagerId(entityId).then(setMyFighters)
    }, [entityId]);
    if(loading){
        return <ContentLoader/>
    }

    const renderChosenFighter = ()=>{
        return (
            <View style={styles.detailsContainer}>
                <Text>We have already submitted fighter! Check your feed for the result.</Text>
            </View>
        )
    }

    if(fighter){
        return renderChosenFighter();
    }
    return (
        <View>
            <TouchableOpacity
                style={styles.moreInfoButton}
                onPress={() => setMoreInfoVisible(!moreInfoVisible)}>
                <Text style={styles.moreInfoButtonText}>My Fighters</Text>
                <Icon
                    name={moreInfoVisible ? 'chevron-down' : 'chevron-right'}
                    size={20}
                    color={colors.primaryGreen}
                />
            </TouchableOpacity>

            {moreInfoVisible && (
                <FighterList
                    scrollEnabled={false}
                    handleChooseFighter={selectFighter}
                    fighters={myFighters}
                />
            )}
        </View>
    );
};

export default ExclusiveMyFighterList;

const styles = StyleSheet.create({
    moreInfoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    moreInfoButtonText: {
        fontSize: 14,
        color: colors.primaryGreen,
        marginRight: 6,
    },
    greenSectionHeader: {
        paddingVertical: 10,
        borderRadius: 8,
    },
    greenSectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailsContainer: {
        borderRadius: 8,
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    zebraLight: {
        backgroundColor: colors.white,
    },
    zebraDark: {
        backgroundColor: colors.lightGray,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
});
