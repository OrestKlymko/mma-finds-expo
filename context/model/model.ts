export type FilterFighter = {
    fighterLocation: string[];
    foundationStyle: string[];
    managerLocation:string[];
    matchType: string;
    promotion: string[];
    withTapology: boolean;
};

export interface ExclusiveOfferFilter {
    activeTab: 'Public' | 'Private';
    eventName: string[];
    fighterName: string[];
    offerType: string[];
}

export interface Filter  {
    eventPlace: string[];
    promotion: string[];
    rules: string[];
    weightClass: string[];
    eventName: string[];
    activeTab: 'Public' | 'Private';
    fighterName: string[];
    offerType: string[];
}

export interface SubmittedFilterFighter{
    locations: string[],
    foundationStyle: string[],
    offerId: string|null,
    withTapology: boolean,

}
