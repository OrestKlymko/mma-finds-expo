import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';

import React from 'react';
import colors from '@/styles/colors';
import {Image} from "expo-image";

type NewFeatureSectionProps = {
    newFeatures: any[];
};

export const NewFeatureSection = ({newFeatures}: NewFeatureSectionProps) => {
    return (
        <View style={[styles.section]}>
            <Text style={styles.sectionTitle}>Upcoming Features</Text>
            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={newFeatures}
                keyExtractor={(item, index) => `feature-${index}`}
                horizontal
                renderItem={({item}) => (
                    <View style={[styles.banner, styles.newFeatureBanner]}>
                        <Image
                            source={require('@/assets/NewFeature.png')}
                            style={[StyleSheet.absoluteFill, {borderRadius: 10}]}
                        />
                        <View style={styles.newFeatureContent}>
                            <Text style={styles.bannerText}>{item.title}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};
const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth - 30 * 2; // 38 зліва та 38 справа
const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    banner: {
        position: 'relative',
        borderRadius: 10,
        padding: 16,
        paddingVertical: 40,
        marginBottom: 16,
        justifyContent: 'center',
    },
    newFeatureBanner: {
        height: 150,
        width: CARD_WIDTH,
        marginRight: 10,
    },
    bannerText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
        textAlign: 'left',
        lineHeight: 24,
        fontWeight: '400',
    },
    newFeatureContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
});
