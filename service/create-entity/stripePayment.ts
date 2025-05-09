import {
    initPaymentSheet,
    presentPaymentSheet,
} from '@stripe/stripe-react-native';
import {
    chargeDefault,
     createPaymentIntentForStripe,
     setDefaultPaymentMethodStripe,
} from '@/service/service';

export const payWithStripe = async (
    amountStr: string,
    currency: string = 'EUR',
): Promise<boolean> => {

    const cents = Math.round(parseFloat(amountStr) * 100); // €19.99 → 1999

    const chargeRes = await chargeDefault({
        amount: cents.toString(),
        currency: currency.toLowerCase(),
    });

    if (chargeRes.paid) return true;


    const { clientSecret } = await createPaymentIntentForStripe({
        amount: cents.toString(),
        currency: currency.toLowerCase(),
    });

    const { error: initErr } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'MMA Finds',
        style: 'automatic',
    });
    if (initErr) throw new Error(initErr.message);

    const { error: presentErr } = await presentPaymentSheet();
    if (presentErr) return false;

    await setDefaultPaymentMethodStripe({clientSecret});

    const secondTry = await chargeDefault({
        amount: cents.toString(),
        currency: currency.toLowerCase(),
    });

    return secondTry.paid;
};
