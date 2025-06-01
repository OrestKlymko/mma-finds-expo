import React, {useState} from 'react';
import {
    StyleSheet, Text, View,
} from 'react-native';
import {PublicOfferFeed} from "@/components/offers/PublicOfferFeed";
import colors from "@/styles/colors";
import {OfferTab} from "@/components/offers/OfferTab";
import {useFilter} from "@/context/FilterContext";
import GoBackButton from "@/components/GoBackButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PrivateOfferFeed} from "@/components/offers/PrivateOfferFeed";


const FighterOfferFeedScreen = () => {
    const insets = useSafeAreaInsets();
    const [selectedTab, setSelectedTab] = useState<'Public' | 'Private'>(
        'Public',
    );
    const {setSelectedFilters} = useFilter();
    return <View style={{flex: 1, backgroundColor: colors.background}}>
        <GoBackButton specificScreen={'/(app)/(tabs)'}/>
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <Text style={styles.title}>Fight Offers Feed</Text>
            <OfferTab
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setSelectedFilters={setSelectedFilters}
            />
            {selectedTab === 'Public' ?
                <PublicOfferFeed/> : <PrivateOfferFeed/>}
        </View>
    </View>
}
export default FighterOfferFeedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 20,
    },
});
