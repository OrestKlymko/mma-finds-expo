export enum OfferTypeEnum {
    PUBLIC = 'PUBLIC',
    EXCLUSIVE = 'EXCLUSIVE',
    MULTIPLE = 'MULTIPLE',
}


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

export interface City {
    id: string;
    country: string;
    continent: string;
}



export type PeopleCovered = 'Fighter+1' | 'Fighter+2' | 'Fighter+3';


export type BenefitsSelection = {
    peopleCovered: 'Fighter+1' | 'Fighter+2' | 'Fighter+3' | null;
    additionalTeamMembers: number;
    travelSupport: {
        isOn: boolean;
        expensesPerKm: string;
        flightTickets: boolean;
        expensesChecked: boolean;
        maxKmCovered: string;
    };
    hotelAccommodation: {
        isOn: boolean;
        rooms: [string, string, string]; // Фіксовано 3 кімнати
        roomsActive: [boolean, boolean, boolean];
        numberOfNights: string;
    };
    food: {
        isOn: boolean;
        breakfast: boolean;
        halfBoard: boolean;
        fullBoard: boolean;
        dailyAllowanceChecked: boolean;
        dailyAllowance: string;
        none: boolean;
    };
    transportFromAirport: boolean;
    gymAccess: boolean;
    saunaAccess: boolean;
    hotTubAccess: boolean;
    customOption: string;
    currency: string;
};

export type Offer = {
    country: string;
    dueDate: string;
    eventDate: string;
    eventDescription: string;
    eventId: string;
    eventLocation: string;
    eventTimeFrom: string;
    eventTimeTo: string;
    eventImageLink: string;
    eventName: string;
    gender: string;
    arenaName: string;
    isFightTitled: boolean;
    isOfferFeatured: boolean;
    offerId: string;
    purse: string;
    isOfferActive: boolean;
    purseCondition: string;
    weightClass: string;
    mmaRules: string;
    description: string;
    promotionName: string;
    maxFights: string;
    minFights: string;
    winLoseCount: string;
    dueDateForDocument: string|null;
    closedReason: string;
    currency: string;
};


export type FilterFighter = {
    fighterLocation: string[];
    foundationStyle: string[];
    managerLocation:string[];
    matchType: string;
    promotion: string[];
    withTapology: boolean;
};

export type Benefit = {
    additionalTeamMembers?: number;
    customOption?: string;
    foodBreakfast?: boolean;
    foodDailyAllowance?: string;
    foodFullBoard?: boolean;
    foodHalfBoard?: boolean;
    foodNone?: boolean;
    gymAccess?: boolean;
    hotTubAccess?: boolean;
    hotelAccommodationIsOn?: boolean;
    hotelAccommodationNumberOfNights?: string;
    hotelAccommodationRoomsOne?: string;
    hotelAccommodationRoomsTwo?: string;
    hotelAccommodationRoomsThree?: string;
    peopleCovered?: string;
    saunaAccess?: boolean;
    transportFromAirport?: boolean;
    travelSupportExpensesPerKm?: string;
    travelSupportFlightTickets?: boolean;
    travelSupportIsOn?: boolean;
    benefitName?: string;
};

export type Message = {
    id: string;
    sender: string;
    message: string;
    time: string;
    isUnread: boolean;
    avatar: string;
    isOnline: boolean;
    timestamp?: any;
};


