import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {getFighterByManagerId, getManagerInfoById} from '@/service/service';
import ContentLoader from '@/components/ContentLoader';
import {ManagerInformationResponse, ShortInfoFighter} from '@/service/response';
import {Image} from "expo-image";
import {useLocalSearchParams, useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";

const PromotionManagerDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [manager, setManager] = useState<ManagerInformationResponse | null>(null);
    const [fighter, setFighter] = useState<ShortInfoFighter[]>([]);
    const {id} = useLocalSearchParams<{ id: string }>();
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        Promise.all([
            getManagerInfoById(id),
            getFighterByManagerId(id),
        ])
            .then(([managerRes, fighterRes]) => {
                setManager(managerRes);
                setFighter(fighterRes);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, [id]);

    const details = [
        {
            label: 'Facebook',
            value: manager?.facebookUsername,
            link: manager?.facebookUsername ? `${manager.facebookUsername}` : null,
        },
        {
            label: 'Snapchat',
            value: manager?.snapchatUsername,
            link: manager?.snapchatUsername ? `${manager.snapchatUsername}` : null,
        },
        {
            label: 'Instagram',
            value: manager?.instagramUsername,
            link: manager?.instagramUsername ? `${manager.instagramUsername}` : null,
        },
        {
            label: 'Twitter',
            value: manager?.twitterUsername,
            link: manager?.twitterUsername ? `${manager.twitterUsername}` : null,
        },
        {
            label: 'Country',
            value: manager?.countryName,
            link: null,
        },
    ];

    if (contentLoading) {
        return <ContentLoader/>;
    }

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Manager Image та Name */}
                <View style={styles.headerContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{
                                uri: manager?.imageLink || 'https://via.placeholder.com/80x80',
                            }}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.fighterName}>{manager?.name || ''}</Text>
                    {manager?.companyName && (
                        <Text style={styles.managerName}>
                            Company:{' '}
                            <Text style={styles.managerLink}>
                                {manager?.companyName || ''}
                            </Text>
                        </Text>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => {
                            router.push({
                                pathname: '/messages/private', params: {
                                    receiverUserId: manager?.id,
                                    avatar: manager?.imageLink,
                                    senderName: manager?.name,
                                }
                            })
                        }}>
                        <Text style={styles.contactButtonText}>Contact Via Chat</Text>
                    </TouchableOpacity>
                </View>

                {/* About the Manager */}
                <Text style={styles.sectionTitle}>About the Manager</Text>
                <Text style={styles.fighterDescription}>
                    {manager?.description || 'No description provided.'}
                </Text>

                {/* Manager Details */}
                <View style={styles.detailsContainer}>
                    {details
                        .filter(
                            detail =>
                                detail.value && detail.value !== 'N/A' && detail.value !== '0',
                        )
                        .map((detail, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.detailRow,
                                    index % 2 === 1 ? styles.zebraLight : styles.zebraDark,
                                ]}>
                                <Text style={styles.detailLabel}>{detail.label}</Text>
                                {detail.link ? (
                                    <Text
                                        style={styles.linkValue}
                                        onPress={() => Linking.openURL(detail.link!)}>
                                        {detail.value}
                                    </Text>
                                ) : (
                                    <Text style={styles.detailValue}>{detail.value}</Text>
                                )}
                            </View>
                        ))}
                </View>

                <Text style={styles.eventTitle}>Fighters</Text>
                <SubmittedFighterList
                    onSelectFighter={fighterSelected => {
                        router.push(`/(app)/manager/fighter/${fighterSelected.id}`);
                    }}
                    fighters={fighter}
                    scrollEnabled={false}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PromotionManagerDetailScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    imageContainer: {
        width: 120,
        height: 120,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 60, // округлюємо, щоб вийшов круг
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 24,
    },
    fighterName: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    managerName: {
        fontWeight: '400',
        fontSize: 16,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
        marginBottom: 15,
    },
    managerLink: {
        color: colors.primaryGreen,
        fontWeight: '400',
        fontFamily: 'Roboto',
        fontSize: 16,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    selectButton: {
        flex: 1,
        backgroundColor: colors.primaryGreen,
        paddingVertical: 17,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    selectButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
    contactButton: {
        flex: 1,
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
    },
    contactButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
    sectionTitle: {
        fontSize: 12,
        marginTop: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    fighterDescription: {
        fontSize: 11,
        color: colors.gray,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 17,
        marginBottom: 16,
        textAlign: 'justify',
    },
    detailsContainer: {
        borderRadius: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 4,
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
    linkValue: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryGreen,
        textDecorationLine: 'underline',
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 6,
        marginTop: 20,
        color: colors.primaryGreen,
    },
});
