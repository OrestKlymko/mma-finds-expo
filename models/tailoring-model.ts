// TODO: Fix offer DTO, this is made up model based on EventHeaderForManager
export type OfferDto = {
    offerId: string;
    isFightTitled: boolean;
    eventName: string;
};

export type SubmittedInformationPublicOffer = {
    statusResponded: 'PENDING' | 'ACCEPTED' | 'REJECTED'|'NEGOTIATING';
    fightPurse: string;
    bonusPurse: string;
    winPurse: string;
    offered: 'PROMOTION' | 'MANAGER';
    currency: string;
    offerId: string;
    fighterId: string;
    rejectionReason?: string | null;
    fightNumber?: number | null | undefined;
    feePayment: string | null;
};

export enum StatusResponse {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
    NEGOTIATING = 'NEGOTIATING',
}

export type ShortInfoFighter = {
    id: string;
    name: string;
    formattedName: string;
    imageLink: string;
    age: number;
    country: string;
    statistics: string;
    foundationStyle: string;
    isFeatured: string;
    managerName: string;
    amateurRecord: string;
    responseFighter: string;
    hasTapologyLink: boolean;
    managerAvatar: string;
    managerId?: string;
    contractStatus: StatusResponse;
    rejectedReason?: string | null;
};


export type DocumentItem = {
    id:string;
    documentName: string;
    documentType: 'FILE' | 'TEXT';
    isCustom: boolean;
    selected: boolean;
    response: string;
    originalValue: string;
}
