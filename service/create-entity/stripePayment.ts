import {createPaymentIntentForStripe, setDefaultPaymentMethodStripe} from "@/service/service";
import {initPaymentSheet, presentPaymentSheet} from "@stripe/stripe-react-native";
import {Alert} from "react-native";

export const payWithStripe = async (
    amountStr: string,
    currency = 'EUR'
): Promise<boolean> => {
    const cents = Math.round(parseFloat(amountStr) * 100);

    const { clientSecret } = await createPaymentIntentForStripe({
        amount:   cents.toString(),
        currency: currency.toLowerCase(),
    });

    const { error: initErr } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'MMA Finds',
    });
    if (initErr) throw new Error(initErr.message);

    const { error: presentErr } = await presentPaymentSheet();
    if (presentErr) return false;

    await setDefaultPaymentMethodStripe({ clientSecret });

    Alert.alert("Great!","We also save your card for future payments. You can remove it in the settings.");

    return true;
};
