import {TaskStatus} from './request';

export type USER_ROLE = 'MANAGER' | 'PROMOTION' | 'PROMOTION_EMPLOYEE';
export type VerificationState = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE';
export type StatusResponse =
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PENDING'
  | 'NEGOTIATING';

export type TicketStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
export type DocumentType = 'TEXT' | 'FILE';

export enum MmaRules {
  AMATEUR = 'AMATEUR',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum PurseCondition {
  FROM = 'FROM',
  TO = 'TO',
  EQUALS = 'EQUALS',
  BETWEEN = 'BETWEEN',
}

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
    rooms: [string, string, string];
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

export type LoginResponse = {
  token?: string;
  role?: USER_ROLE;
  entityId?: string;
  methodAuth?: string;
};

export type SportTypeResponse = {
  id: string;
  name: string;
};

export type CountryResponse = {
  id: string;
  country: string;
  continent: string;
};

export type EditPublicOfferResponse = {
  offerId: string;
  mmaRules: MmaRules;
  isFightTitled: boolean;
  purseFrom: string;
  purseTo: string;
  purseCondition: PurseCondition;
  description?: string;
  gender: string;
  weightKg?: string;
  weightLbs?: string;
  minFights?: number;
  maxFights?: number;
  minWinCount?: number;
  minLoseCount?: number;
  professionalMmaWin: number;
  professionalMmaLose: number;
  professionalMmaDraw: number;
  opponentTapologyLink?: string;
  dueDate: string;
  country: string;
  weightClassId: string;
  weightClass: string;
  rounds: number;
  minutes: number;
  sportTypeId: string;
};

export type WeightClassResponse = {
  id: string;
  name: string;
  maximumWeight?: number;
  minCatchWeight?: number;
  maxCatchWeight?: number;
};

export type NationalityResponse = {
  id: string;
  name: string;
};

export type FoundationStyleResponse = {
  id: string;
  name: string;
};

export type UserInfoResponse = {
  id: string;
  name: string;
  imageLink: string;
  isVerified: boolean;
  promotionId: string | null;
  managerId: string | null;
  promotionEmployeeId: string | null;
};

export type PromotionInformationResponse = {
  name: string;
  countryId: string;
  countryName: string;
  imageLink: string;
  continent: string;
  instagramUsername?: string;
  twitterUsername?: string;
  facebookUsername?: string;
  snapchatUsername?: string;
  description?: string;
  email: string;
  phoneNumber?: string;
};

export type ManagerInformationResponse = {
  id: string;
  userId: string;
  name: string;
  companyName: string;
  countryId: string;
  countryName: string;
  continent: string;
  country: string;
  imageLink: string;
  instagramUsername: string;
  twitterUsername: string;
  facebookUsername: string;
  snapchatUsername: string;
  description: string;
  fighterRepresentingMyself: boolean;
  email: string;
  phoneNumber: string;
  methodRegistered: string;
};

export type CardInfoFighterResponse = {
  id: string;
  name: string;
  imageLink: string;
};

export type ShortInfoFighter = {
  id: string;
  name: string;
  formattedName: string;
  imageLink: string;
  age: number;
  country: string;
  statistics: string;
  foundationStyle: string;
  isFeatured?: string;
  managerName: string;
  amateurRecord: string;
  responseFighter?: string;
  hasTapologyLink?: boolean;
  managerId: string;
  managerAvatar?: string;
  contractStatus?: StatusResponse;
  rejectedReason?: string;
  feePayment: string;
};

export type CreatePaymentIntentResponse = {
  clientSecret: string;
};

export type ShortLinkResponse = {
    shortLink: string;
}

export type ShortLinkRequest = {
  path: string;
  entityId: string;
};

export type InvitationLinkResponse = {
  link: string;
};

export type StripePaymentResponse = {
  paid: boolean;
}

export type DecodeTokenInvitationResponse = {
  organization: string;
  role: string;
};

export type DecodeTokenFromEmailResponse = {
  email: string;
};

export type CreditRemainingResponse = {
  featuringCredit: number;
  referralCredit: number;
};

export type VerificationStatusResponse = {
  status: VerificationState;
};

export type TicketResponse = {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
};

export type CardInfoResponse = {
  id: string;
  brand: string;
  last4: string;
  isDefault: boolean;
};

export type PaymentSetupIntentResponse = {
  clientSecret: string;
  setupIntentId: string;
  customerId: string;
};

export type SubAccountResponse = {
  id: string;
  name: string;
  imageLink: string;
  teamRole: string;
};

export type EventCreationResponse = {
  id: string;
  imageLink: string;
  name: string;
  date: string;
  description: string;
  location: string;
  timeTo: string;
  timeFrom: string;
  arenaName: string;
};

export type EventDetailsResponse = {
  id: string;
  eventImageLink: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  description?: string;
  eventTime: string;
  arenaName: string;
};

export type DocumentRequiredResponse = {
  id: string;
  documentName: string;
  documentType: DocumentType;
  response?: string;
  isCustom?: boolean;
  selected?: boolean;
};

export type PublicOfferInfo = {
  offerId: string;
  sportType: string;
  promotionName: string;
  eventLocation: string;
  eventTimeFrom: string;
  eventTimeTo: string;
  eventDate: string;
  arenaName: string;
  eventName: string;
  eventId: string;
  eventDescription: string;
  gender: string;
  eventImageLink: string;
  weightClass: string;
  isFightTitled: boolean;
  purseCondition: PurseCondition;
  closedReason?: string | null;
  country: string;
  purse: string;
  dueDate: string;
  isOfferActive: boolean;
  isOfferFeatured: boolean;
  winLoseCount: string;
  description: string;
  minFights: number;
  maxFights: number;
  mmaRules: MmaRules;
  currency: string;
  chooseFighterId?: string | null;
  responseFighter: string;
  verifiedState: VerificationState;
  dueDateForDocument: string;
  opponentName?: string | null | undefined;
  opponentNationality?: string | null | undefined;
  opponentAge?: string | null | undefined;
  opponentGender?: string | null | undefined;
  opponentTapologyLink?: string | null | undefined;
  opponentProWins?: string | null | undefined;
  opponentProLosses?: string | null | undefined;
  opponentProDraws?: string | null | undefined;
  opponentAmateurWins?: string | null | undefined;
  opponentAmateurLosses?: string | null | undefined;
  opponentAmateurDraws?: string | null | undefined;
};

export type PublicOfferShortInfo = {
  offerId: string;//TODO: fix the response
}

export type SubmittedInformationOffer = {
  statusResponded: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NEGOTIATING';
  fightPurse: string;
  bonusPurse: string;
  winPurse: string;
  offered: 'PROMOTION' | 'MANAGER';
  currency: string;
  offerId: string;
  fighterId: string;
  rejectionReason?: string | null;
  fightNumber?: number | null | undefined;
};
export type FullInfoAboutPublicOffer = {
  offer: PublicOfferInfo;
  fighters: ShortInfoFighter[];
  submittedInformation?: SubmittedInformationOffer;
  previousOfferPrice?: SubmittedInformationOffer;
};

export type FullInfoAboutExclusiveOffer = {
  offer: ExclusiveOfferInfo;
  fighter: ShortInfoFighter;
  benefit: Benefit;
  submittedInformation?: SubmittedInformationOffer;
  previousOfferPrice?: SubmittedInformationOffer;
};

export type ExclusiveOfferInfo = {
  offerId: string;
  eventDate: string;
  eventName: string;
  eventId: string;
  eventDescription: string;
  eventImageLink: string;
  weightClass: string;
  arenaName: string;
  eventLocation: string;
  eventTimeFrom: string;
  eventTimeTo: string;
  isFightTitled: boolean;
  purseCondition: string;
  sportType:string;
  rounds: number;
  minutes: number;
  currency: string;
  mmaRules: string;
  description: string;
  purseBonus?: number | null;
  purseWin?: number | null;
  purseFight?: number | null;
  dueDate: string;
  country: string;
  responseFighter: string;
  managerId: string;
  managerName: string;
  managerAvatar: string;
  promotionId: string;
  promotionName: string;
  promotionAvatar: string;
  closedReason?: string | null;
  fighterName: string;
  fighterId: string;
  dueDateForDocument?: string;
  opponentName?: string | null | undefined;
  opponentNationality?: string | null | undefined;
  opponentAge?: string | null | undefined;
  opponentGender?: string | null | undefined;
  opponentTapologyLink?: string | null | undefined;
  opponentProWins?: string | null | undefined;
  opponentProLosses?: string | null | undefined;
  opponentProDraws?: string | null | undefined;
  opponentAmateurWins?: string | null | undefined;
  opponentAmateurLosses?: string | null | undefined;
  opponentAmateurDraws?: string | null | undefined;
};

export type BenefitsResponse = {
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

export type FighterInfoResponse = {
  imageLink: string;
  name: string;
  description: string;
  gender: string;
  age: number;
  weightClass: string;
  height: string;
  reach: string;
  gymName: string;
  nationality: string;
  basedIn: string;
  proRecord: string;
  amateurRecord: string;
  foundationStyle: string;
  tapologyLink: string;
  sherdogLink: string;
  instagram: string;
  managerName: string;
  userId: string;
  lookingForOpponent: boolean;
  fighterId: string;
  managerId: string;
  verificationState:VerificationState
};

export type ManagerInfo = {
  name: string;
  companyName: string;
  countryId: string;
  countryName: string;
  imageLink: string;
  instagramUsername?: string;
  twitterUsername?: string;
  facebookUsername?: string;
  snapchatUsername?: string;
  description?: string;
  fighterRepresentingMyself: boolean;
  email: string;
  phoneNumber: string;
  userId: string;
  id: string;
  methodRegistered: string;
  continent: string;
  country: string;
};

export type EmployeeInfo = {
  id: string;
  name: string;
  role: string;
  imageLink: string;
};

export type EmployeeTaskResponse = {
  id: string;
  taskName: string;
  eventName: string;
  eventDate: string;
  status: TaskStatus;
};

export type EventTaskResponse = {
  id: string;
  status: TaskStatus;
  taskName: string;
  avatar: string;
  employeeName: string;
};

export type Benefit = {
  additionalTeamMembers: number | null;
  customOption: string | null;
  foodBreakfast: boolean | null;
  foodDailyAllowance: string | null;
  foodFullBoard: boolean | null;
  foodHalfBoard: boolean | null;
  foodNone: boolean | null;
  gymAccess: boolean | null;
  hotTubAccess: boolean | null;
  hotelAccommodationIsOn: boolean | null;
  hotelAccommodationNumberOfNights: string | null;
  hotelAccommodationRoomsOne: string | null;
  hotelAccommodationRoomsTwo: string | null;
  hotelAccommodationRoomsThree: string | null;
  peopleCovered: string | null;
  saunaAccess: boolean | null;
  transportFromAirport: boolean | null;
  travelSupportExpensesPerKm: string | null;
  travelSupportFlightTickets: boolean | null;
  travelSupportIsOn: boolean | null;
  benefitName: string | null;
  currency: string | null;
  maxKmCovered: number | null;
};

export type MultiContractShortInfo = {
  offerId: string;
  dueDate: string;
  fighterName: string;
  fighterNickname: string;
  verifiedState: string;
  typeOffer: string;
  closedReason?: string;
  promotionAvatar?: string;
  dueDateDocument?: string;
};

export type MultiContractFullInfo = {
  offerId: string;
  numberOfFight: number;
  durationContractMonth: number;
  exclusivity: string;
  description: string;
  dueDate: string;
  fighterId: string;
  currency: string;
  closedReason: string;
  weightClass: string[];
  sportType: string[];
  promotionName: string;
  promotionAvatar: string;
  promotionId: string;
  managerId: string;
  managerName: string;
  managerAvatar: string;
  dueDateDocument: string;
};

export type MultiContractResponse = {
  offer: MultiContractFullInfo;
  fighter: ShortInfoFighter;
  submittedInformation: SubmittedInformationOffer[];
  previousOfferPrice: SubmittedInformationOffer[];
};

export type PromotionNameResponse = {
  promotionName: string;
};

export type FighterFullProfile = {
  id: string;
  imageLink: string;
  name: string;
  nickname: string;
  gender: string;
  dateOfBirth: string;
  weightClassId: string;
  height: number | null;
  heightFeet: number | null;
  reach: number | null;
  reachFeet: number | null;
  nationalId: string;
  country: string;
  professionalMmaRecordWin: number | null;
  professionalMmaRecordLose: number | null;
  professionalMmaRecordDraw: number | null;
  amateurMmaRecordWin: number | null;
  amateurMmaRecordLose: number | null;
  amateurMmaRecordDraw: number | null;
  foundationStyleId: string;
  tapologyLink: string;
  sherdogLink: string;
  instagramUsername: string;
  twitterUsername: string;
  facebookUsername: string;
  gymName: string;
  snapchatUsername: string;
  description: string;
  sportTypeId: string[];
  countryName: string;
  continent: string;
  minWeight: number | null;
  maxWeight: number | null;
};

export type MessageInfoResponse = {
  name: string;
  profileImage: string;
};

export type FeatureResponse = {
  id: string;
  title: string;
};

export interface FilterPublicOfferBase {
  eventNames: string[];
  weightClasses: string[];
}

export interface FilterPublicOfferPromotionResponse
  extends FilterPublicOfferBase {
  fighterNames: string[];
}

export interface FilterPublicOfferManagerResponse
  extends FilterPublicOfferBase {
  promotions: string[];
}

export type PromotionResponse = {
  id: string;
  name: string;
  imageLink: string;
  country: string;
  activeNumberOffer: number;
};

export type CheckCriteriaExistResponse = {
  existEntity: boolean;

}
