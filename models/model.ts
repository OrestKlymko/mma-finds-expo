export interface ImageSelectorComponentProps {
    image?: Photo | null;
    setPhoto: (photo: Photo) => void;
    hasSubmitted?: boolean;
    isPoster?: boolean;
}

export type WeightClass = {
    id: string;
    name: string;
    maximumWeight: number;
    minCatchWeight?: number;
    maxCatchWeight?: number;
};

export type FightLength = {
    minutes: number;
    rounds: number;
};

export interface SignUpDataManager {
    name: string;
    companyName: string;
    about: string;
    country: string;
    continent: string;
    phoneNumber: string;
    facebook: string;
    instagram: string;
    twitter: string;
    snapchat: string;
    profileImage: {
        uri: string;
        type: string;
        name: string;
    };
    isFighter: boolean;
}

export interface SignUpDataPromotion {
    name: string;
    facebook: string;
    instagram: string;
    twitter: string;
    snapchat: string;
    description: string;
    phone: string;
    country: string;
    continent: string;
    image: Photo;
}

export type Photo = {
    uri: string | null;
    type: string;
    name: string;
};

