export type OfferType = 'Public' | 'Exclusive' | 'Multi-fight contract';


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
    password?: string;
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
    password?: string;
    image: Photo;
}

export type Photo = {
    uri: string | null;
    type: string;
    name: string;
};


export interface Filter  {
    eventPlace: string[];
    promotion: string[];
    rules: string[];
    weightClass: string[];
    eventName: string[];
    activeTab: 'Public' | 'Exclusive';
    fighterName: string[];
    offerType: string[];
}

export type MessageItem ={
    id?: string;
    senderId: string;
    message?: string;
    type?: 'text' | 'file' | 'image';
    attachmentUrl?: string;
    fileName?: string;
    timestamp?: any;
}

export type Conversation = {
    id: string;
    conversationId: string;
    participants: string[];
    lastMessage: string;
    lastTimestamp: any; // Firestore Timestamp
    unreadCount?: number;
    // При необхідності можна додати додаткові поля, наприклад, archived або isBlocked
    archived?: boolean;
    isBlocked?: boolean;
    avatar: string;
    sender: string;
};

export type PublicOffer = {
    country: string;
    promotionName: string;
    eventId: string;
    currency: string;
    eventDate: string;
    eventName: string;
    gender: string;
    eventImageLink: string;
    isFightTitled: boolean;
    offerId: string;
    purse: string;
    purseCondition: string;
    weightClass: string;
    closedReason: string;
    isOfferFeatured: boolean;
    verifiedState: string;
    promotion: string;
};
