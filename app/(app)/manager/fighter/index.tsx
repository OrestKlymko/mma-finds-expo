import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {ShortInfoFighter} from '@/service/response';
import colors from "@/styles/colors";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from 'expo-router';
import FighterCard from "@/components/FighterCard";

interface FighterListProps {
    fighters?: ShortInfoFighter[];
    handleChooseFighter: (item: any) => void;
}

const FighterList = ({fighters, handleChooseFighter}: FighterListProps) => {
    const {role} = useAuth();
    const router = useRouter();

    return (
        <FlatList
            style={styles.list}
            data={fighters}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
                <FighterCard fighter={item} onPress={handleChooseFighter}/>
            )}
            ListFooterComponent={
                <>
                    {role === 'MANAGER' && (
                        <TouchableOpacity
                            style={styles.createProfileButton}
                            onPress={() => router.push('/(app)/manager/fighter/create')}>
                            <Text style={styles.createProfileButtonText}>
                                Create Fighter’s Profile
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            }
        />
    );
}
export default FighterList
const styles = StyleSheet.create({
    list: {
        marginTop: 10,
    },
    createProfileButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    createProfileButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
        paddingVertical: 4,
    },
});
