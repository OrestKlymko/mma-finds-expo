import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import VerificationManagerTypeDocuments from "@/components/verification/VerificationManagerTypeDocuments";
import {VerificationPromotionTypeDocuments} from "@/components/verification/VerificationPromotionTypeDocuments";

const VerifyAccountChooseDoc = () => {
    const {role} = useAuth();
    if (role === 'MANAGER') {
        return <VerificationManagerTypeDocuments/>
    }else {
        return <VerificationPromotionTypeDocuments/>
    }
};

export default VerifyAccountChooseDoc;
