import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {getShortInfoFightersByManager} from '@/service/service';
import {PublicOfferInfo, ShortInfoFighter} from "@/service/response";
import {Image} from "expo-image";
import FighterList from "@/app/(app)/manager/fighter";
import {FeatureFighterModal} from "@/components/fighter/FeatureFighterModal";
import {useLocalSearchParams} from "expo-router";

const SubmitFighterOfferScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const offer = JSON.parse(params.offer as string) as PublicOfferInfo;
    const submittedFighters = JSON.parse(params.submittedFighters as string) as ShortInfoFighter[];
    const [offerToSubmit, setOfferToSubmit] = useState<PublicOfferInfo | null>(
        null,
    );
    const [fighterName, setFighterName] = useState<string | null>(null);
    const [fighterId, setFighterId] = useState<string | null>(null);

    const [isMainVisible, setIsMainVisible] = useState(true);
    const [isFeatureModalVisible, setFeatureModalVisible] = useState(false);
    const [isFightersModalVisible, setFightersModalVisible] = useState(false);
    const [fighters, setFighters] = useState<any[]>([]); // or a typed array if you have a Fighter interface


    useEffect(() => {
        getShortInfoFightersByManager().then(response => {
            const alreadySubmittedId = submittedFighters.map(
                (fighter: any) => fighter.id,
            );
            response = response.filter(
                (fighter: any) => !alreadySubmittedId.includes(fighter.id),
            );
            setFighters(response);
        });
    }, [submittedFighters]);

    const openFightersModal = () => {
        setFightersModalVisible(true);
    };

    const closeFightersModal = () => {
        setFightersModalVisible(false);
    };

    const selectFighter = (fighter: any) => {
        setFighterId(fighter.id);
        setFighterName(fighter.name);
        closeFightersModal();
    };

    const convertDateToNormalView = (date: string | null | undefined) => {
        if (!date) return '';
        const dateNormal = date.split('-');
        return `${dateNormal[2]}.${dateNormal[1]}.${dateNormal[0]}`;
    };

    return (
        <View style={styles.mainContainer}>
            <GoBackButton/>

            {/* MAIN CONTENT */}
            {isMainVisible && (
                <View style={styles.container}>
                    <Image
                        source={{uri: offer?.eventImageLink}}
                        style={styles.banner}
                    />
                    <Text style={styles.greateChoice}>Great Choice!</Text>
                    <Text style={styles.title}>
                        {offer?.eventName} |{' '}
                        {convertDateToNormalView(offer?.eventDate)}
                    </Text>

                    <Text style={styles.description}>
                        Please choose one of your fighters.{'\n'}
                        Note that only fighters that meet the{'\n'}
                        requirements are displayed.
                    </Text>

                    <TouchableOpacity
                        style={styles.purseOpenButton}
                        onPress={openFightersModal}>
                        <Text style={styles.purseOpenButtonText}>
                            {fighterName ? fighterName : 'Choose Fighter'}
                        </Text>
                        <Icon name="chevron-right" size={24} color={colors.primaryBlack}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            if (!fighterId) {
                                Alert.alert(
                                    'Choose a Fighter',
                                    'Please choose a fighter first.',
                                );
                                return;
                            }
                            setFeatureModalVisible(true);
                            setIsMainVisible(false);
                        }}>
                        <Text style={styles.buttonText}>Submit Fighter</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal
                transparent
                visible={isFightersModalVisible}
                animationType="slide"
                onRequestClose={closeFightersModal}>
                <View style={styles.bottomSheetOverlay}>
                    <TouchableOpacity
                        style={styles.bottomSheetBackground}
                        activeOpacity={1}
                        onPress={closeFightersModal}
                    />

                    <View style={styles.bottomSheetContainer}>
                        <FighterList
                            handleChooseFighter={selectFighter}
                            fighters={fighters}
                        />
                    </View>
                </View>
            </Modal>

            <FeatureFighterModal
                fighterId={fighterId}
                offerToSubmit={offer}
                isFeatureModalVisible={isFeatureModalVisible}
                setFeatureModalVisible={setFeatureModalVisible}
                setIsMainVisible={setIsMainVisible}
            />
        </View>
    );
};

export default SubmitFighterOfferScreen;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.background,
        flex: 1,
    },
    container: {
        marginTop: 80,
        flexGrow: 1,
        paddingHorizontal: 28,
        backgroundColor: colors.background,
    },
    banner: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    },
    greateChoice: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '400',
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.primaryGreen,
        marginBottom: 10,
    },
    description: {
        fontFamily: 'Roboto',
        fontSize: 16.5,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 20,
    },
    purseOpenButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 8,
        paddingVertical: 17,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    purseOpenButtonText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 18.75,
        color: colors.primaryBlack,
    },
    button: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 17,
        paddingHorizontal: 32,
        justifyContent: 'center',
        height: 56,
        width: '100%',
    },
    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 18.75,
        textAlign: 'center',
        color: '#FFFFFF',
    },

    /** Bottom Sheet modal overlay **/
    bottomSheetOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // dark semi-transparent background
        justifyContent: 'flex-end', // push content to bottom
    },
    bottomSheetBackground: {
        flex: 1,
    },
    bottomSheetContainer: {
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        height: '90%', // <--- covers ~90% from the bottom
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 26,
    },
});
