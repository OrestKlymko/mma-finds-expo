import AsyncStorage from "@react-native-async-storage/async-storage";
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";

export const createFormDataForPromotion = async (
    data: SignUpDataPromotion,
    email: string,
    method = 'google',
) => {
    const referralUserId = await AsyncStorage.getItem('referralUserId');
    const formData = new FormData();
    if (data.image) {
        formData.append('image', data.image);
    }
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('phone', data.phone);
    formData.append('country', data.country);
    formData.append('continent', data.continent);
    formData.append('instagram', data.instagram);
    formData.append('facebook', data.facebook);
    formData.append('twitter', data.twitter);
    formData.append('snapchat', data.snapchat);
    formData.append('email', email.toLowerCase());
    formData.append('method', method);
    if(method==='standard'&&data.password){
        formData.append('password', data.password);
    }
    if (referralUserId) {
        formData.append('referralUserId', referralUserId);
    }
    return formData;
};

export const createFormDataForPromotionAsSecondProfile = async (
    data: SignUpDataPromotion
) => {
    const formData = new FormData();
    if (data.image) {
        formData.append('image', data.image);
    }
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('phone', data.phone);
    formData.append('country', data.country);
    formData.append('continent', data.continent);
    formData.append('instagram', data.instagram);
    formData.append('facebook', data.facebook);
    formData.append('twitter', data.twitter);
    formData.append('snapchat', data.snapchat);
    return formData;
};

export const createFormDataForManager = async (
    data: SignUpDataManager,
    email: string,
    method = 'google',
) => {
    const referralUserId = await AsyncStorage.getItem('referralUserId');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('companyName', data.companyName);
    formData.append('fighterRepresentingMyself', data.isFighter);
    formData.append('instagram', data.instagram);
    formData.append('facebook', data.facebook);
    formData.append('twitter', data.twitter);
    formData.append('snapchat', data.snapchat);
    formData.append('description', data.about);
    formData.append('phone', data.phoneNumber);
    formData.append('country', data.country);
    formData.append('continent', data.continent);
    formData.append('email', email.toLowerCase());
    formData.append('method', method);
    if(method==='standard'&&data.password){
        formData.append('password', data.password);
    }
    if (referralUserId) {
        formData.append('referralUserId', referralUserId);
    }
    if (data.profileImage) {
        formData.append('image', {
            uri: data.profileImage.uri,
            type: data.profileImage.type || 'image/jpeg',
            name: data.profileImage.name || `profile_${Date.now()}.jpg`,
        });
    }
    return formData;
};

export const createFormDataForManagerAsSecondProfile = async (
    data: SignUpDataManager
) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('companyName', data.companyName);
    formData.append('fighterRepresentingMyself', data.isFighter);
    formData.append('instagram', data.instagram);
    formData.append('facebook', data.facebook);
    formData.append('twitter', data.twitter);
    formData.append('snapchat', data.snapchat);
    formData.append('description', data.about);
    formData.append('phone', data.phoneNumber);
    formData.append('country', data.country);
    formData.append('continent', data.continent);

    if (data.profileImage) {
        formData.append('image', {
            uri: data.profileImage.uri,
            type: data.profileImage.type || 'image/jpeg',
            name: data.profileImage.name || `profile_${Date.now()}.jpg`,
        });
    }
    return formData;
}
