import {Alert, Platform} from "react-native";
import React from "react";
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import SocialButton from "@/components/method-auth/SocialButton";
import AppleIcon from "@/assets/icons/apple.png";

type AppleMethodProps = {
    data?: SignUpDataPromotion | SignUpDataManager;
    handleSuccessAuth: (res: LoginResponse) => void;
}

export const AppleMethod = (
    {data, handleSuccessAuth}: AppleMethodProps,
) => {
    const [loadingApple, setLoadingApple] = React.useState(false);

    const handleAppleSignIn = async () => {
        Alert.alert(
            'Coming Soon!',
            'This feature is coming soon. Try Google or standard email registration.',
        );
        return;
    };
  return <>
      {Platform.OS === 'ios' && (
          <SocialButton
              text="Sign up with Apple"
              onPress={handleAppleSignIn}
              iconSource={AppleIcon}
              backgroundColor="#FFFFFF"
              textColor="#000"
              isLoading={loadingApple}
              disabled={loadingApple}
          />
      )}</>;
};
