import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchForSubmittedFighterListFlow} from "@/components/offers/public/SearchForSubmittedFighterListFlow";
import {useSubmittedFighter} from "@/context/SubmittedFighterContext";

const MyListSubmittedFighterScreen = () => {
    const insets = useSafeAreaInsets();
    const {store, clearStore} = useSubmittedFighter();

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton actionAfterUnmount={clearStore}/>
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                {/* Title */}
                <Text style={styles.title}>Submitted Fighters</Text>

                <SearchForSubmittedFighterListFlow
                    offerId={store.offerId}
                    currency={store.currency}
                    excludeFighterId={store.excludeFighterId}
                    eligibleToSelect={store.eligibleToSelect === 'true'}
                    offerType={store.offerType}
                />
            </View>
        </View>
    );
};

export default MyListSubmittedFighterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 20,
    },
});
