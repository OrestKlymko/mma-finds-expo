import {chargePaymentIntentOnDefaultMethod, createPaymentIntentForStripe} from "@/service/service";
import {initPaymentSheet, presentPaymentSheet} from "@stripe/stripe-react-native";
import {Alert} from "react-native";
import {CreatePaymentIntentStripeRequest} from "@/service/request";

export const payWithStripe = async (
    amountStr: string,
    currency = 'EUR'
): Promise<boolean> => {
    const cents = Math.round(parseFloat(amountStr) * 100);
    const data: CreatePaymentIntentStripeRequest = {
        amount: cents.toString(),
        currency: currency.toLowerCase(),
    }
    const successPayment = await chargePaymentIntentOnDefaultMethod(data)
    if (successPayment) {
        return true;
    }
    const {clientSecret} = await createPaymentIntentForStripe({
        amount: cents.toString(),
        currency: currency.toLowerCase(),
    });


    const {error: initErr} = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'MMA Finds',
        returnURL: 'com.mmafinds.app://stripe-redirect',
        style: 'automatic',
        applePay: {merchantCountryCode: 'SK'},
        googlePay: {
            merchantCountryCode: 'SK',
            currencyCode: 'EUR',
            testEnv: true,
        },
    });
    console.log('Stripe init error:', initErr);
    if (initErr) throw new Error(initErr.message);

    const {error: presentErr} = await presentPaymentSheet();
    console.log('Stripe present error:', presentErr);
    if (presentErr) return false;
    Alert.alert("Great!", "We also save your card for future payments. You can remove it in the settings.");

    return true;
};


export const payWithStripeSuccessFee = async (
    amountStr: string,
    currency = 'EUR'
): Promise<String> => {
    const cents = Math.round(parseFloat(amountStr) * 100);
    const data: CreatePaymentIntentStripeRequest = {
        amount: cents.toString(),
        currency: currency.toLowerCase(),
    }
    const successPayment = await chargePaymentIntentOnDefaultMethod(data)
    if (successPayment && successPayment.paymentIntentId) {
        return successPayment.paymentIntentId;
    }
    const {clientSecret} = await createPaymentIntentForStripe({
        amount: cents.toString(),
        currency: currency.toLowerCase(),
    });


    const {error: initErr} = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'MMA Finds',
        returnURL: 'com.mmafinds.app://stripe-redirect',
        style: 'automatic',
        applePay: {merchantCountryCode: 'SK'},
        googlePay: {
            merchantCountryCode: 'SK',
            currencyCode: 'EUR',
            testEnv: true,
        },
    });
    console.log('Stripe init error:', initErr);
    if (initErr) throw new Error(initErr.message);

    const {error: presentErr} = await presentPaymentSheet();
    console.log('Stripe present error:', presentErr);
    if (presentErr) return '';
    Alert.alert("Great!", "We also save your card for future payments. You can remove it in the settings.");

    return clientSecret.split('_secret')[0];
};
