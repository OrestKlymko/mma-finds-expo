import FacebookIcon from '@/assets/icons/facebook.png';
import React from 'react';
import {Alert} from 'react-native';
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import SocialButton from "@/components/method-auth/SocialButton";

interface FacebookMethodProps {
  data?: SignUpDataPromotion | SignUpDataManager;
  handleSuccessAuth: (res: LoginResponse) => void;
}

export const FacebookMethod = ({
  data,
  handleSuccessAuth,
}: FacebookMethodProps) => {
  const [loadingFacebook, setLoadingFacebook] = React.useState(false);

  const handleFacebookSignIn = async () => {
    Alert.alert(
      'Coming Soon!',
      'This feature is coming soon. Try Google or standard email registration.',
    );
    return;
    // setLoadingFacebook(true);
    // try {
    //   const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    //   if (result.isCancelled) {
    //     setLoadingFacebook(false);
    //     return;
    //   }
    //   const data = await AccessToken.getCurrentAccessToken();
    //   if (!data) {
    //     setLoadingFacebook(false);
    //     return;
    //   }
    //
    //   const profile = await Profile.getCurrentProfile();
    //   if (!profile) {
    //     Alert.alert('Error', 'No profile found');
    //     setLoadingFacebook(false);
    //     return;
    //   }
    //
    //   // Для надійності Facebook email можна отримувати через GraphRequest,
    //   // але припустімо, що profile.email у вас доступний:
    //   const email = profile.email || `${profile.userID}@facebook.com`;
    //   // Якщо немає email, можна імпровізувати, підставляти userID.
    //   console.log(email);
    //   // PROMOTION
    //   if (role === 'PROMOTION') {
    //     const formData = createFormDataForPromotion(data, email, 'facebook');
    //     createPromotion(formData)
    //         .then(async (res) => {
    //           await handleSuccessAuth(res);
    //           setTimeout(() => navigation.navigate('Main'), 1000);
    //         })
    //         .catch((err) => {
    //           if (err?.response?.status === 409) {
    //             Alert.alert('This email is already registered.');
    //           } else {
    //             Alert.alert('Failed to create a profile.');
    //           }
    //         })
    //         .finally(() => setLoadingFacebook(false));
    //   }
    //
    //   // MANAGER
    //   if (role === 'MANAGER') {
    //     const formData = createFormDataForManager(data, email, 'facebook');
    //     createManager(formData)
    //         .then(async (res) => {
    //           await handleSuccessAuth(res);
    //           setTimeout(() => navigation.navigate('CreateFightersProfile'), 1000);
    //         })
    //         .catch((err) => {
    //           if (err?.response?.status === 409) {
    //             Alert.alert('This email is already registered.');
    //           } else {
    //             Alert.alert('Failed to create a profile. Please try again later.');
    //           }
    //         })
    //         .finally(() => setLoadingFacebook(false));
    //   }
    //
    // } catch (error) {
    //   console.log('Facebook sign in error:', error);
    //   Alert.alert('Error', 'Facebook login failed.');
    //   setLoadingFacebook(false);
    // }
  };
  return (
    <SocialButton
      text="Sign up with Facebook"
      onPress={handleFacebookSignIn}
      iconSource={FacebookIcon}
      backgroundColor="#FFFFFF"
      textColor="#000"
      isLoading={loadingFacebook}
      disabled={loadingFacebook}
    />
  );
};
