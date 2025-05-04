import {useEffect} from 'react';
import {router} from 'expo-router';
import {useAuth} from '@/context/AuthContext';

export default function InfoIndex() {
    const {role} = useAuth();

    useEffect(() => {
        if (role === 'MANAGER') router.replace('/profile/settings/account/account-info/account-details/manager');
        if (role === 'PROMOTION') router.replace('/profile/settings/account/account-info/account-details/promotion');
    }, [role]);

    return null;
}
