import {FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {ManagerCard} from "@/components/fighter/ManagerCard";


interface FighterListProps {
    fighters?: any[];
    handleChooseFighter: (item: any) => void;
}

export default function ManagerList({fighters, handleChooseFighter}: FighterListProps) {
    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            data={fighters}
            keyExtractor={item => item.managerId}
            renderItem={({item}) => (<ManagerCard handleChooseFighter={handleChooseFighter} item={item}/>
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        marginTop: 10,
    },

});
