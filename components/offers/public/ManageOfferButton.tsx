import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {useRouter} from "expo-router";

interface ManageOfferButtonProps {
    offerId?: string | null;
    closedReason?: string | null;
    type?: string | null;
}

export const ManageOfferButton: React.FC<ManageOfferButtonProps> = ({
                                                                        offerId,
                                                                        closedReason,
                                                                        type,
                                                                    }) => {
    const router = useRouter();
    const handleClosedOffer = () => {
        Alert.alert('Are you sure?', 'Do you want to close this offer?', [
            {
                text: 'Yes',
                onPress: () =>
                    router.push({
                        pathname: '/offer/close', params: {
                            offerId: offerId ?? '',
                            type: type ?? '',
                        }
                    }),
            },
            {
                text: 'No',
                style: 'cancel',
            },
        ]);
    };

    if (closedReason && closedReason?.trim() !== '') {
        return (
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: '/offer/renew', params: {
                            offerId: offerId ?? '',
                            type: type ?? '',
                        }
                    })
                }}>
                <Text style={styles.renewOfferText}>Renew the Offer</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={handleClosedOffer}>
            <Text style={styles.closeOfferText}>Close the Offer</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    closeOfferText: {
        color: '#C01818',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    renewOfferText: {
        color: colors.primaryGreen,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
});
