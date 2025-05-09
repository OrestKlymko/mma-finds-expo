import React from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const FeaturedFighterList = () => {
    const insets = useSafeAreaInsets();
    const [featuredFightersList, setFeaturedFightersList] = React.useState([]);
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
                styles.container,
                {paddingBottom: insets.bottom},
            ]}>
            <GoBackButton />

            {/* Title Section */}
            <Text style={styles.title}>Featured Fighters</Text>
            {featuredFightersList.length === 0 && (
                <Text style={styles.subtitle}>None of your fighters are currently featured!</Text>
            )}
        </ScrollView>
    );
};

export default FeaturedFighterList;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },

    /** Title Section **/
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginTop: 50,
        lineHeight: 30,
        fontFamily: 'Roboto',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 40,
        marginTop: 13,
        lineHeight: 19,
    },

});
