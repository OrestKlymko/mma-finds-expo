import React, {useEffect, useRef, useState} from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import colors from '@/styles/colors';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import CountryPicker from 'react-native-country-picker-modal';
import {Country, CurrencyCode} from 'react-native-country-picker-modal';
import {BenefitsSelection} from "@/service/response";

interface BenefitModalProps {
    onConfirm: (selectedBenefits: BenefitsSelection) => void;
    benefitsChoosen?: any;
}

const BenefitBottomSheet = ({
                                benefitsChoosen,
                                onConfirm,
                            }: BenefitModalProps) => {
    const [customOption, setCustomOption] = useState('');
    const [visible, setVisible] = useState(false);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<Country | null>(
        null,
    );
    const [currency, setCurrency] = useState<CurrencyCode>('EUR');
    const [benefits, setBenefits] = useState<BenefitsSelection>({
        peopleCovered: null,
        additionalTeamMembers: 0,
        travelSupport: {
            isOn: false,
            expensesPerKm: '',
            flightTickets: false,
            expensesChecked: false,
            maxKmCovered: '',
        },
        hotelAccommodation: {
            isOn: false,
            rooms: ['', '', ''], // Пусті поля за замовчуванням
            roomsActive: [false, false, false], // Чекбокси не позначені за замовчуванням
            numberOfNights: '',
        },
        food: {
            isOn: false,
            breakfast: false,
            halfBoard: false,
            fullBoard: false,
            dailyAllowanceChecked: false,
            dailyAllowance: '',
            none: true,
        },
        transportFromAirport: false,
        gymAccess: false,
        saunaAccess: false,
        hotTubAccess: false,
        customOption: '',
        currency: 'EUR',
    });
    const scrollViewRef = useRef<ScrollView>(null);
    const customOptionsRef = useRef<View>(null);

    useEffect(() => {
        if (benefitsChoosen) {
            setBenefits(benefitsChoosen);
            setCustomOption(benefitsChoosen.customOption || '');
        }
    }, [benefitsChoosen]);

    /**
     * Show a snippet of selected benefits in the collapsed button
     */
    const shwoBenefitsInButton = (benefitsInButton: BenefitsSelection) => {
        let result = '';

        if (!benefitsInButton) {
            return result;
        }
        if (benefitsInButton.peopleCovered) {
            result += benefitsInButton.peopleCovered + ' people, ';
        }
        if (benefitsInButton.additionalTeamMembers) {
            result +=
                benefitsInButton.additionalTeamMembers + ' Additional Team Members, ';
        }
        if (benefitsInButton.travelSupport?.isOn) {
            result += 'Travel Support, ';
        }
        if (benefitsInButton.hotelAccommodation?.isOn) {
            result += 'Hotel Accommodation, ';
        }
        if (benefitsInButton.food?.isOn) {
            if (benefitsInButton.food.breakfast) {
                result += 'Breakfast, ';
            }
            if (benefitsInButton.food.halfBoard) {
                result += 'Half Board, ';
            }
            if (benefitsInButton.food.fullBoard) {
                result += 'Full Board, ';
            }
            if (benefitsInButton.food.dailyAllowanceChecked) {
                result +=
                    'Daily Allowance ' + benefitsInButton.food.dailyAllowance + '€, ';
            }
        }

        return result.length ? result.slice(0, 30) + '...' : 'Benefits';
    };

    const getCurrencySymbol = (currencyCode: CurrencyCode | undefined) => {
        if (!currencyCode) currencyCode = 'EUR';
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency: currencyCode,
        })
            .format(0)
            .replace(/\d/g, '')
            .trim()
            .replace(/\s/g, '')
            .replace('.', '');
    };

    const handleCustomOptionFocus = () => {
        setTimeout(() => {
            customOptionsRef.current?.measureLayout(
                scrollViewRef.current?.getInnerViewNode(),
                (_x, y) => {
                    scrollViewRef.current?.scrollTo({y, animated: true});
                },
            );
        }, 300);
    };

    /*****************************************************
     *        Handlers for each benefit option           *
     *****************************************************/

        // 1) People Covered
    const handlePeopleCovered = (
            value: 'Fighter+1' | 'Fighter+2' | 'Fighter+3',
        ) => {
            setBenefits(prev => ({
                ...prev,
                peopleCovered: prev.peopleCovered === value ? null : value,
            }));
        };

    // 2) Additional Team Members
    const handleAdditionalTeamMembers = (value: number) => {
        setBenefits(prev => ({
            ...prev,
            additionalTeamMembers: prev.additionalTeamMembers === value ? 0 : value,
        }));
    };

    const handleSelect = (country: Country) => {
        setSelectedCurrency(country);
        setCurrency(country.currency[0]);
        setBenefits(prev => ({...prev, currency: country.currency[0]}));
        setPickerVisible(false);
    };

    // 3) Travel Support
    const handleTravelExpenseToggle = () => {
        setBenefits(prev => ({
            ...prev,
            travelSupport: {
                ...prev.travelSupport,
                expensesChecked: !prev.travelSupport?.expensesChecked,
                expensesPerKm: !prev.travelSupport?.expensesChecked
                    ? prev.travelSupport?.expensesPerKm
                    : '',
                isOn:
                    !prev.travelSupport?.expensesChecked ||
                    prev.travelSupport?.flightTickets
                        ? true
                        : false,
            },
        }));
    };

    const handleFlightTicketsToggle = () => {
        setBenefits(prev => ({
            ...prev,
            travelSupport: {
                ...prev.travelSupport,
                flightTickets: !prev.travelSupport?.flightTickets,
                isOn:
                    !prev.travelSupport?.flightTickets ||
                    prev.travelSupport?.expensesChecked
                        ? true
                        : false,
            },
        }));
    };

    const handleTravelExpenseChange = (val: string) => {
        setBenefits(prev => ({
            ...prev,
            travelSupport: {
                ...prev.travelSupport,
                expensesPerKm: val,
            },
        }));
    };

    const handleMaxKmCoveredChange = (val: string) => {
        setBenefits(prev => ({
            ...prev,
            travelSupport: {
                ...prev.travelSupport,
                maxKmCovered: val,
            },
        }));
    };

    // 4) Hotel Accommodation
    const toggleHotelAccommodation = (val: boolean) => {
        if (!val) {
            setBenefits(prev => ({
                ...prev,
                hotelAccommodation: {
                    isOn: false,
                    rooms: ['', '', ''],
                    roomsActive: [false, false, false],
                    numberOfNights: '',
                },
            }));
        } else {
            setBenefits(prev => ({
                ...prev,
                hotelAccommodation: {
                    ...prev.hotelAccommodation,
                    isOn: true,
                },
            }));
        }
    };

    const handleRoomBedsChange = (roomIndex: number, beds: string) => {
        if (!/^\d*$/.test(beds)) return;

        setBenefits(prev => {
            const currentHotel = prev.hotelAccommodation;
            // Якщо ніяких налаштувань готелю ще не було – нічого не змінюємо
            if (!currentHotel) return prev;

            // Розпаковуємо старі значення
            const {isOn, rooms: oldRooms, roomsActive, numberOfNights} = currentHotel;

            const updatedRooms: [string, string, string] = [
                oldRooms[0],
                oldRooms[1],
                oldRooms[2],
            ];

            updatedRooms[roomIndex] = beds;

            return {
                ...prev,
                hotelAccommodation: {
                    isOn,
                    rooms: updatedRooms,
                    roomsActive,
                    numberOfNights,
                },
            };
        });
    };

    const handleNightsChange = (val: string) => {
        setBenefits(prev => ({
            ...prev,
            hotelAccommodation: {...prev.hotelAccommodation, numberOfNights: val},
        }));
    };

    const toggleRoomActive = (roomIndex: number) => {
        setBenefits(prev => {
            const currentHotel = prev.hotelAccommodation ?? {
                isOn: false,
                rooms: ['', '', ''],
                roomsActive: [false, false, false],
                numberOfNights: '',
            };

            const currentRoomsActive = currentHotel.roomsActive;
            // Spread поверне string[], але ми точно знаємо, що там 3 елементи:
            const newRoomsActive = [...currentRoomsActive] as [
                boolean,
                boolean,
                boolean,
            ];
            newRoomsActive[roomIndex] = !newRoomsActive[roomIndex];

            return {
                ...prev,
                hotelAccommodation: {
                    ...currentHotel,
                    roomsActive: newRoomsActive,
                },
            };
        });
    };

    // 5) Food
    const toggleFood = (value: boolean) => {
        if (!value) {
            setBenefits(prev => ({
                ...prev,
                food: {
                    isOn: false,
                    breakfast: false,
                    halfBoard: false,
                    fullBoard: false,
                    dailyAllowanceChecked: false,
                    dailyAllowance: '',
                    none: true,
                },
            }));
        } else {
            setBenefits(prev => ({
                ...prev,
                food: {
                    ...prev.food,
                    isOn: true,
                },
            }));
        }
    };

    const handleMealPlanSelect = (
        option: 'breakfast' | 'halfBoard' | 'fullBoard',
    ) => {
        if (!benefits.food?.isOn) return;
        setBenefits(prev => ({
            ...prev,
            food: {
                ...prev.food,
                breakfast: option === 'breakfast',
                halfBoard: option === 'halfBoard',
                fullBoard: option === 'fullBoard',
                none: false,
            },
        }));
    };

    const handleDailyAllowanceToggle = (value: boolean) => {
        setBenefits(prev => ({
            ...prev,
            food: {
                ...prev.food,
                dailyAllowanceChecked: value,
                dailyAllowance: value ? prev.food.dailyAllowance : '',
            },
        }));
    };

    const handleDailyAllowanceChange = (val: string) => {
        setBenefits(prev => ({
            ...prev,
            food: {
                ...prev.food,
                dailyAllowance: val,
            },
        }));
    };

    // 6) Transport from Airport
    const handleTransportToggle = (val: boolean) => {
        setBenefits(prev => ({...prev, transportFromAirport: val}));
    };

    // 7) Gym Access
    const handleGymToggle = (val: boolean) => {
        setBenefits(prev => ({...prev, gymAccess: val}));
    };

    // 8) Sauna Access
    const handleSaunaToggle = (val: boolean) => {
        setBenefits(prev => ({...prev, saunaAccess: val}));
    };

    // 9) Hot Tub Access
    const handleHotTubToggle = (val: boolean) => {
        setBenefits(prev => ({...prev, hotTubAccess: val}));
    };

    // Confirm & Validate
    const handleConfirm = () => {
        if (
            benefits.travelSupport?.expensesChecked &&
            !benefits.travelSupport?.expensesPerKm
        ) {
            Alert.alert('Fill all fields', 'Please enter the reimbursement per km.');
            return;
        }
        if (
            benefits.travelSupport?.expensesChecked &&
            !benefits.travelSupport?.maxKmCovered
        ) {
            Alert.alert(
                'Fill all fields',
                'Please enter the maximum km covered for Travel Support.',
            );
            return;
        }

        if (
            benefits.hotelAccommodation?.isOn &&
            (!benefits.hotelAccommodation?.numberOfNights ||
                benefits.hotelAccommodation?.roomsActive.some(
                    (active, index) =>
                        active && benefits.hotelAccommodation.rooms[index] === '',
                ))
        ) {
            Alert.alert(
                'Fill all fields',
                'Please fill in all active hotel accommodation fields.',
            );
            return;
        }

        if (
            benefits.food?.isOn &&
            benefits.food.dailyAllowanceChecked &&
            !benefits.food.dailyAllowance
        ) {
            Alert.alert(
                'Fill all fields',
                'Please enter the daily allowance amount.',
            );
            return;
        }

        const updatedBenefits = {
            ...benefits,
            customOption: customOption.trim(),
        };

        onConfirm(updatedBenefits);
        setVisible(false);
    };

    const SectionCard: React.FC<{
        title: string;
        iconName: string;
        children: React.ReactNode;
    }> = ({title, iconName, children}) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Icon
                    name={iconName}
                    size={24}
                    color={colors.primaryGreen}
                    style={{marginRight: 8}}
                />
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <View style={styles.cardBody}>{children}</View>
        </View>
    );

    return (
        <>
            <TouchableOpacity
                style={[styles.inputRow]}
                onPress={() => setVisible(true)}>
                <View
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        flex: 1,
                    }}>
                    {benefits ? (
                        <Text style={[styles.inputText, {fontWeight: '400'}]}>
                            {shwoBenefitsInButton(benefits)}
                        </Text>
                    ) : (
                        <Text style={styles.inputText}>Select Benefits</Text>
                    )}
                    <Icon name="chevron-right" size={24} color={colors.primaryBlack} />
                </View>
            </TouchableOpacity>

            <Modal
                isVisible={visible}
                style={styles.modal}
                animationIn="slideInUp"
                onBackdropPress={() => setVisible(false)}
                animationOut="slideOutDown"
                backdropOpacity={0.3}>
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{flex: 1}}
                        keyboardVerticalOffset={100} // можна підрегулювати під твій UI
                    >
                        <ScrollView
                            ref={scrollViewRef}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.contentContainer}>
                            <Text style={styles.mainTitle}>Select Benefits</Text>

                            {/* 1) People Covered */}
                            <SectionCard
                                title="People Covered"
                                iconName="account-group-outline">
                                <Text style={styles.description}>
                                    Select how many people are eligible for benefits.
                                </Text>
                                <View style={styles.row}>
                                    {['Fighter+1', 'Fighter+2', 'Fighter+3'].map(opt => {
                                        const isActive = benefits.peopleCovered === (opt as any);
                                        return (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[
                                                    styles.buttonOption,
                                                    isActive && styles.buttonOptionActive,
                                                ]}
                                                onPress={() => handlePeopleCovered(opt as any)}>
                                                <Text
                                                    style={[
                                                        styles.buttonOptionText,
                                                        isActive && styles.buttonOptionTextActive,
                                                    ]}>
                                                    {opt}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </SectionCard>

                            {/* 2) Additional Team Members */}
                            <SectionCard
                                title="Additional Team Members"
                                iconName="account-multiple-plus-outline">
                                <Text style={styles.description}>
                                    Select the number of extra cornermen who can attend.
                                </Text>
                                <View style={[styles.row]}>
                                    {[1, 2, 3, 4, 5].map(num => {
                                        const isActive = benefits.additionalTeamMembers === num;
                                        return (
                                            <TouchableOpacity
                                                key={num}
                                                style={[
                                                    styles.buttonOption,
                                                    isActive && styles.buttonOptionActive,
                                                ]}
                                                onPress={() => handleAdditionalTeamMembers(num)}>
                                                <Text
                                                    style={[
                                                        styles.buttonOptionText,
                                                        isActive && styles.buttonOptionTextActive,
                                                    ]}>
                                                    {num}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </SectionCard>

                            {/* 3) Travel Support */}
                            <View style={styles.card}>
                                <View
                                    style={[
                                        styles.cardHeader,
                                        {justifyContent: 'space-between'},
                                    ]}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Icon
                                            name="airplane"
                                            size={24}
                                            color={colors.primaryGreen}
                                            style={{marginRight: 8}}
                                        />
                                        <Text style={styles.cardTitle}>Travel Support</Text>
                                    </View>
                                    <Switch
                                        value={benefits.travelSupport?.isOn}
                                        onValueChange={val =>
                                            setBenefits(prev => ({
                                                ...prev,
                                                travelSupport: {
                                                    ...prev.travelSupport,
                                                    isOn: val,
                                                    ...(val
                                                        ? {}
                                                        : {
                                                            expensesChecked: false,
                                                            expensesPerKm: '',
                                                            maxKmCovered: '',
                                                        }),
                                                },
                                            }))
                                        }
                                    />
                                </View>
                                {benefits.travelSupport?.isOn && (
                                    <View style={styles.cardBody}>
                                        <Text style={styles.description}>
                                            Choose the types of support you want to offer. In the end,
                                            only one option will apply.
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.checkRow}
                                            onPress={handleFlightTicketsToggle}>
                                            <Icon
                                                name={
                                                    benefits.travelSupport?.flightTickets
                                                        ? 'checkbox-marked'
                                                        : 'checkbox-blank-outline'
                                                }
                                                size={24}
                                                color={
                                                    benefits.travelSupport?.flightTickets
                                                        ? colors.primaryGreen
                                                        : colors.gray
                                                }
                                            />
                                            <Text style={styles.checkLabel}>Flight Tickets</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.checkRow}
                                            onPress={handleTravelExpenseToggle}>
                                            <Icon
                                                name={
                                                    benefits.travelSupport?.expensesChecked
                                                        ? 'checkbox-marked'
                                                        : 'checkbox-blank-outline'
                                                }
                                                size={24}
                                                color={
                                                    benefits.travelSupport?.expensesChecked
                                                        ? colors.primaryGreen
                                                        : colors.gray
                                                }
                                            />
                                            <Text style={styles.checkLabel}>
                                                Travel Expense Reimbursement
                                            </Text>
                                        </TouchableOpacity>
                                        {benefits.travelSupport?.expensesChecked && (
                                            <>
                                                {/* 1) Enter maximum km covered */}
                                                <View style={[styles.formRow, {flexDirection: 'row'}]}>
                                                    <Text style={[styles.label, {flex: 3}]}>
                                                        Enter maximum km covered
                                                    </Text>
                                                    <TextInput
                                                        style={[styles.input, {flex: 4}]}
                                                        keyboardType="numeric"
                                                        placeholder="E.g. 100"
                                                        placeholderTextColor="#999"
                                                        value={benefits.travelSupport?.maxKmCovered}
                                                        onChangeText={handleMaxKmCoveredChange}
                                                    />
                                                </View>

                                                {/* 2) Per km in total */}
                                                <View style={[styles.formRow, {flexDirection: 'row'}]}>
                                                    <Text style={[styles.label, {flex: 3}]}>
                                                        Per km in total:
                                                    </Text>

                                                    {/* Обгортка для TextInput + CountryPicker */}
                                                    <View style={{flex: 5, flexDirection: 'row'}}>
                                                        <TextInput
                                                            style={[styles.input, {flex: 3}]}
                                                            keyboardType="numeric"
                                                            placeholder="E.g. 0.5"
                                                            placeholderTextColor="#999"
                                                            value={benefits.travelSupport?.expensesPerKm}
                                                            onChangeText={handleTravelExpenseChange}
                                                        />

                                                        <CountryPicker
                                                            withCurrency
                                                            placeholder={
                                                                getCurrencySymbol(
                                                                    selectedCurrency?.currency?.[0],
                                                                ) ||
                                                                getCurrencySymbol(currency) ||
                                                                'Select currency'
                                                            }
                                                            withFilter
                                                            withFlag
                                                            containerButtonStyle={[
                                                                styles.input,
                                                                {
                                                                    flex: 2,
                                                                    marginLeft: 8, // Невеликий відступ між інпутом і CountryPicker
                                                                    paddingVertical: 5,
                                                                    backgroundColor: colors.grayBackground,
                                                                },
                                                            ]}
                                                            visible={isPickerVisible}
                                                            onSelect={handleSelect}
                                                            onClose={() => setPickerVisible(false)}
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* 4) Hotel Accommodation */}
                            <View style={styles.card}>
                                <View
                                    style={[
                                        styles.cardHeader,
                                        {justifyContent: 'space-between'},
                                    ]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon
                                            name="bed-double-outline"
                                            size={24}
                                            color={colors.primaryGreen}
                                            style={{marginRight: 8}}
                                        />
                                        <Text style={styles.cardTitle}>Hotel Accommodation</Text>
                                    </View>
                                    <Switch
                                        value={benefits.hotelAccommodation?.isOn}
                                        onValueChange={toggleHotelAccommodation}
                                    />
                                </View>
                                <View style={styles.cardBody}>
                                    {benefits.hotelAccommodation?.isOn && (
                                        <>
                                            <Text style={styles.description}>
                                                Please choose an options.
                                            </Text>

                                            {/* Room 1 */}
                                            <View
                                                style={[
                                                    styles.formRow,
                                                    benefits.hotelAccommodation?.roomsActive[0] && {
                                                        marginBottom: 0,
                                                    },
                                                ]}>
                                                <TouchableOpacity onPress={() => toggleRoomActive(0)}>
                                                    <Icon
                                                        name={
                                                            benefits.hotelAccommodation?.roomsActive[0]
                                                                ? 'checkbox-marked'
                                                                : 'checkbox-blank-outline'
                                                        }
                                                        size={24}
                                                        color={colors.primaryGreen}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={[styles.label, {marginLeft: 3}]}>
                                                    Room 1
                                                </Text>
                                            </View>
                                            {benefits.hotelAccommodation?.roomsActive[0] && (
                                                <View style={styles.nestedRow}>
                                                    <Text style={styles.nestedText}>
                                                        Number of beds in the room
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputShort}
                                                        keyboardType="numeric"
                                                        placeholder="E.g. 1"
                                                        placeholderTextColor="#999"
                                                        value={benefits.hotelAccommodation?.rooms[0]}
                                                        onChangeText={val => handleRoomBedsChange(0, val)}
                                                    />
                                                </View>
                                            )}

                                            {/* Room 2 */}
                                            <View
                                                style={[
                                                    styles.formRow,
                                                    benefits.hotelAccommodation?.roomsActive[1] && {
                                                        marginBottom: 0,
                                                    },
                                                ]}>
                                                <TouchableOpacity onPress={() => toggleRoomActive(1)}>
                                                    <Icon
                                                        name={
                                                            benefits.hotelAccommodation?.roomsActive[1]
                                                                ? 'checkbox-marked'
                                                                : 'checkbox-blank-outline'
                                                        }
                                                        size={24}
                                                        color={colors.primaryGreen}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={[styles.label, {marginLeft: 3}]}>
                                                    Room 2
                                                </Text>
                                            </View>
                                            {benefits.hotelAccommodation?.roomsActive[1] && (
                                                <View style={styles.nestedRow}>
                                                    <Text style={styles.nestedText}>
                                                        Number of beds in the room
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputShort}
                                                        keyboardType="numeric"
                                                        placeholder="E.g. 1"
                                                        placeholderTextColor="#999"
                                                        value={benefits.hotelAccommodation?.rooms[1]}
                                                        onChangeText={val => handleRoomBedsChange(1, val)}
                                                    />
                                                </View>
                                            )}
                                            {/* Room 3 */}
                                            <View
                                                style={[
                                                    styles.formRow,
                                                    benefits.hotelAccommodation?.roomsActive[2] && {
                                                        marginBottom: 0,
                                                    },
                                                ]}>
                                                <TouchableOpacity onPress={() => toggleRoomActive(2)}>
                                                    <Icon
                                                        name={
                                                            benefits.hotelAccommodation?.roomsActive[2]
                                                                ? 'checkbox-marked'
                                                                : 'checkbox-blank-outline'
                                                        }
                                                        size={24}
                                                        color={colors.primaryGreen}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={[styles.label, {marginLeft: 3}]}>
                                                    Room 3
                                                </Text>
                                            </View>
                                            {benefits.hotelAccommodation?.roomsActive[2] && (
                                                <View style={styles.nestedRow}>
                                                    <Text style={styles.nestedText}>
                                                        Number of beds in the room
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputShort}
                                                        keyboardType="numeric"
                                                        placeholder="E.g. 1"
                                                        placeholderTextColor="#999"
                                                        value={benefits.hotelAccommodation?.rooms[2]}
                                                        onChangeText={val => handleRoomBedsChange(2, val)}
                                                    />
                                                </View>
                                            )}
                                            {/* Number of Nights */}
                                            <View style={[styles.formRow, {marginTop: 10}]}>
                                                <Text style={styles.nestedText}>Number of nights</Text>
                                                <TextInput
                                                    style={styles.inputShort}
                                                    keyboardType="numeric"
                                                    placeholder="E.g. 2"
                                                    placeholderTextColor="#999"
                                                    value={benefits.hotelAccommodation?.numberOfNights}
                                                    onChangeText={handleNightsChange}
                                                />
                                            </View>
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* 5) Food */}
                            <View style={styles.card}>
                                <View
                                    style={[
                                        styles.cardHeader,
                                        {justifyContent: 'space-between'},
                                    ]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon
                                            name="silverware-fork-knife"
                                            size={24}
                                            color={colors.primaryGreen}
                                            style={{marginRight: 8}}
                                        />
                                        <Text style={styles.cardTitle}>Food</Text>
                                    </View>
                                    <Switch
                                        value={benefits.food?.isOn}
                                        onValueChange={toggleFood}
                                    />
                                </View>
                                {benefits.food?.isOn && (
                                    <View style={styles.cardBody}>
                                        <Text style={styles.description}>
                                            Please choose an options.
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.checkRow}
                                            onPress={() => handleMealPlanSelect('breakfast')}>
                                            <Icon
                                                name={
                                                    benefits.food.breakfast
                                                        ? 'radiobox-marked'
                                                        : 'radiobox-blank'
                                                }
                                                size={24}
                                                color={
                                                    benefits.food.breakfast
                                                        ? colors.primaryGreen
                                                        : colors.gray
                                                }
                                            />
                                            <Text style={styles.checkLabel}>Breakfast Included</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.checkRow}
                                            onPress={() => handleMealPlanSelect('halfBoard')}>
                                            <Icon
                                                name={
                                                    benefits.food.halfBoard
                                                        ? 'radiobox-marked'
                                                        : 'radiobox-blank'
                                                }
                                                size={24}
                                                color={
                                                    benefits.food.halfBoard
                                                        ? colors.primaryGreen
                                                        : colors.gray
                                                }
                                            />
                                            <Text style={styles.checkLabel}>Half Board</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.checkRow}
                                            onPress={() => handleMealPlanSelect('fullBoard')}>
                                            <Icon
                                                name={
                                                    benefits.food.fullBoard
                                                        ? 'radiobox-marked'
                                                        : 'radiobox-blank'
                                                }
                                                size={24}
                                                color={
                                                    benefits.food.fullBoard
                                                        ? colors.primaryGreen
                                                        : colors.gray
                                                }
                                            />
                                            <Text style={styles.checkLabel}>Full Board</Text>
                                        </TouchableOpacity>
                                        <View style={[styles.formRow, {marginTop: 12}]}>
                                            <Text style={[styles.label, {marginRight: 8}]}>
                                                Daily Food Allowance
                                            </Text>
                                            <Switch
                                                value={benefits.food.dailyAllowanceChecked}
                                                onValueChange={handleDailyAllowanceToggle}
                                            />
                                        </View>
                                        {benefits.food.dailyAllowanceChecked && (
                                            <View style={[styles.formRow, {marginTop: 8}]}>
                                                <Text style={styles.label}>Amount per day</Text>
                                                <TextInput
                                                    style={styles.inputShort}
                                                    keyboardType="numeric"
                                                    placeholder="E.g. 30"
                                                    placeholderTextColor="#999"
                                                    value={benefits.food.dailyAllowance}
                                                    onChangeText={handleDailyAllowanceChange}
                                                />
                                                <CountryPicker
                                                    withCurrency
                                                    placeholder={
                                                        getCurrencySymbol(selectedCurrency?.currency[0]) ||
                                                        getCurrencySymbol(currency) ||
                                                        'Select currency'
                                                    }
                                                    withFilter
                                                    withFlag
                                                    containerButtonStyle={[
                                                        styles.input,
                                                        {
                                                            paddingVertical: 5,
                                                            backgroundColor: colors.grayBackground,
                                                        },
                                                    ]}
                                                    visible={isPickerVisible}
                                                    onSelect={handleSelect}
                                                    onClose={() => setPickerVisible(false)}
                                                />
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* 6) Transport from Airport */}
                            <View
                                style={[
                                    styles.card,
                                    {flexDirection: 'row', justifyContent: 'space-between'},
                                ]}>
                                <View style={[styles.cardHeader]}>
                                    <Icon
                                        name="car"
                                        size={24}
                                        color={colors.primaryGreen}
                                        style={{marginRight: 8}}
                                    />
                                    <Text style={styles.cardTitle}>Transport from Airport</Text>
                                </View>
                                <Switch
                                    value={benefits.transportFromAirport}
                                    onValueChange={handleTransportToggle}
                                />
                            </View>

                            {/* 7) Gym Access */}
                            <View
                                style={[
                                    styles.card,
                                    {flexDirection: 'row', justifyContent: 'space-between'},
                                ]}>
                                <View style={[styles.cardHeader]}>
                                    <Icon
                                        name="dumbbell"
                                        size={24}
                                        color={colors.primaryGreen}
                                        style={{marginRight: 8}}
                                    />
                                    <Text style={styles.cardTitle}>Gym Access</Text>
                                </View>
                                <Switch
                                    value={benefits.gymAccess}
                                    onValueChange={handleGymToggle}
                                />
                            </View>

                            {/* 8) Sauna Access */}
                            <View
                                style={[
                                    styles.card,
                                    {flexDirection: 'row', justifyContent: 'space-between'},
                                ]}>
                                <View style={[styles.cardHeader]}>
                                    <Icon
                                        name="fire"
                                        size={24}
                                        color={colors.primaryGreen}
                                        style={{marginRight: 8}}
                                    />
                                    <Text style={styles.cardTitle}>Sauna Access</Text>
                                </View>
                                <Switch
                                    value={benefits.saunaAccess}
                                    onValueChange={handleSaunaToggle}
                                />
                            </View>

                            {/* 9) Hot Tub Access */}
                            <View
                                style={[
                                    styles.card,
                                    {flexDirection: 'row', justifyContent: 'space-between'},
                                ]}>
                                <View style={[styles.cardHeader]}>
                                    <Icon
                                        name="hot-tub"
                                        size={24}
                                        color={colors.primaryGreen}
                                        style={{marginRight: 8}}
                                    />
                                    <Text style={styles.cardTitle}>Hot Tub Access</Text>
                                </View>
                                <Switch
                                    value={benefits.hotTubAccess}
                                    onValueChange={handleHotTubToggle}
                                />
                            </View>

                            {/* 10) Other (Custom Option) */}
                            <View
                                ref={customOptionsRef}
                                style={[
                                    styles.card,
                                    {flexDirection: 'column', justifyContent: 'space-between'},
                                ]}>
                                <FloatingLabelInput
                                    label={'Add Other Benefits'}
                                    value={customOption}
                                    onChangeText={setCustomOption}
                                    onFocus={handleCustomOptionFocus}
                                />
                            </View>

                            {/* Confirm Button */}
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirm}>
                                <Text style={styles.confirmButtonText}>Confirm Benefits</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0, // covers the entire screen
    },
    container: {
        height: '90%',
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.primaryGreen,
        textAlign: 'center',
        marginVertical: 20,
    },
    card: {
        backgroundColor: colors.background,
        justifyContent: 'center',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    cardBody: {},
    description: {
        fontSize: 13,
        color: colors.gray,
        marginBottom: 18,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        flex: 1,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.gray,
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        height: 48,
        color: colors.primaryBlack,
        backgroundColor: '#F8F8F8',
        marginLeft: 8,
    },
    inputShort: {
        width: 100,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 6,
        fontSize: 14,
        height: 48,
        color: colors.primaryBlack,
        backgroundColor: '#F8F8F8',
        textAlign: 'center',
    },
    buttonOption: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonOptionActive: {
        backgroundColor: colors.primaryGreen,
        borderColor: colors.primaryGreen,
    },
    buttonOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    buttonOptionTextActive: {
        color: '#fff',
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    checkLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginLeft: 8,
    },
    confirmButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginVertical: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3,
        height: 56,
        justifyContent: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 20,
        height: 56,
    },
    inputText: {
        fontSize: 16,
        color: colors.gray,
    },
    nestedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nestedText: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginRight: 8,
    },

    // Додаткові стилі для Room Active checkbox (якщо потрібно)
    // Наприклад, можна додати невеликий відступ
});

export default BenefitBottomSheet;
