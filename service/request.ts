import {Benefit, DocumentType, USER_ROLE} from './response';
import {PurseValuesMulti} from "@/store/createMultiContractOfferSlice";


export type TaskStatus = 'TODO' | 'COMPLETED';
export type FighterStatusResponse =
  | 'Accepted'
  | 'Rejected by promotion'
  | 'Rejected by you'
  | 'Waiting promotion'
  | 'Waiting you'
  | 'Offer Expired'
  | 'Submitted'
  | 'Waiting for you response'
  | 'You rejected offer';

export type OfferType = 'Public' | 'Exclusive' | 'Multi-fight contract';
export type FighterStateApprove = 'ACTIVE' | 'INACTIVE';
export type LoginRequest = {
  email: string | undefined;
  password: string | null;
  method: string;
  fcmToken: string | null;
  userRole: USER_ROLE;
};

export type RecoveryPasswordRequest = {
  email: string;
  newPassword: string;
};

export type CreatePaymentIntentRequest = {
  price: string;
};


export type CreatePaymentIntentStripeRequest = {
    amount: string;
    currency: string;
};

export type InvitationMemberRequest = {
  email: string;
  role: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type PayCreditRequest = {
  credit: string;
  valueToPay: string;
};

export type PayForCreditRequestStripe = {
  amount: string;
  currency: string;
};
export type DefaultMethodRequest = {
  clientSecret: string;
}

export type CancelEventRequest = {
  id: string;
  reason: string;
};

export type CreateDocumentOfferRequest = {
  name: string;
  type: DocumentType;
};

type NegotiateRequest = {
  fightPurse: number;
  winBonus: number;
  finishBonus: number;
};

export type ResponsorOfferRequest = {
  offerId: string;
  fighterId: string;
  rejectedReason?: string;
  negotiateRequest?: NegotiateRequest;
};

export type PublicOfferToSelectedFighterRequest = {
  fighterId: string;
  win: string;
  fight: string;
  bonus: string;
  offerId: string;
  currency: string;
  newDocument: CreateDocumentOfferRequest[];
  choosenDocument: string[];
  dueDate: string;
  addNewDocumentToProfile: boolean;
};

export type ResponseExclusiveOfferRequest = {
  fighterId: string;
  response: string;
  typeOffer: OfferType;
};

export type CreateTaskRequest = {
  task: string;
  dueDate: string;
  eventId: string;
  assignId: string;
  status: TaskStatus;
};

export type ChangeTaskStatusRequest = {
  taskId: string;
  status: TaskStatus;
};

export type OfferSubmissionResponse = {
  eventDate: string | null;
  formattedName: string;
  eventName: string | null;
  typeOfSubmission: OfferType;
  eventImageLink: string | null;
  isFightTitled: boolean;
  dueDate: string;
  offerId: string;
  fighterStateApprove: FighterStateApprove;
  statusFighter: FighterStatusResponse;
  fighterId: string;
  closedReason: string | null;
};

export type UpdateOfferRequest = {
  eventId?: string;
  rounds?: number;
  minutes?: number;
  weightClass?: string;
  mmaRule?: string;
  isTitleFight?: boolean;
  fromPrice?: string;
  toPrice?: string;
  description?: string;
  gender?: string;
  minFights?: string;
  maxFights?: string;
  minWins?: string;
  minLoss?: string;
  tapologyLinkOpponents?: string;
  benefit?: Benefit;
  minCatchWeight?: number;
  maxCatchWeight?: number;
  currency?: string;
  sportTypeId?: string;
  dueDate?: string;
  opponentName?: string;
  proRecordWins?: string | number | undefined;
  proRecordLoses?: string | number | undefined;
  proRecordDraws?: string | number | undefined;
  amateurRecordWins?: string | number | undefined;
  amateurRecordLoses?: string | number | undefined;
  amateurRecordDraws?: string | number | undefined;
  opponentAge?: string | number | undefined;
  opponentGender?: string | undefined;
  opponentNationality?: string | null | undefined;
};

export type CreateExclusiveOfferRequest = {
  dueDate?: string;
  weightClass?: string;
  tapologyLinkOpponents?: string;
  purseWin?: string;
  purseFight?: string;
  purseBonus?: string;
  moreInfo?: string;
  mmaRule?: string;
  isTitleFight?: boolean;
  eventId?: string;
  fighterId?: string;
  benefit?: Benefit;
  rounds?: number;
  minutes?: number;
  minCatchWeight?: number;
  maxCatchWeight?: number;
  currency?: string;
  sportTypeId?: string;
  opponentName?: string;
  newDocument?: CreateDocumentOfferRequest[];
  choosenDocument?: string[];
  addNewDocumentToProfile?: boolean;
  dueDateDocument?: string | null;
  proRecordWins?: string | number | undefined;
  proRecordLoses?: string | number | undefined;
  proRecordDraws?: string | number | undefined;
  amateurRecordWins?: string | number | undefined;
  amateurRecordLoses?: string | number | undefined;
  amateurRecordDraws?: string | number | undefined;
  opponentAge?: string | number | undefined;
  opponentGender?: string | undefined;
  opponentNationality?: string | null | undefined;
};

export type SendNotificationRequest = {
  receiverId: string;
  text: string;
  typeOffer?: OfferType;
  offerId?: string;
  role?: string;
};

export type ChangeProfileRequest = {
  entityId: string | null | undefined;
  switchToRole: USER_ROLE;
};

export type CreateMultiOfferRequest = {
  durationContractMonth: number | string | undefined;
  purse: PurseValuesMulti[];
  moreInfo: string;
  numberOfFights: number | string | undefined;
  weightClass: string[] | undefined;
  dueDate: string;
  fighterId: string | null | undefined;
  minCatchWeight: number | undefined;
  maxCatchWeight: number | undefined;
  currency: string | undefined;
  exclusivity?: string | null;
  sportTypeId: string[];
  newDocument?: CreateDocumentOfferRequest[];
  choosenDocument?: string[];
  addNewDocumentToProfile?: boolean;
  dueDateDocument: string | null;
};

export type CreateMultiOfferTailoringRequest = {
  fighterId: string;
  offerId: string;
  purses: MultiFightPurse[];
};

export type MultiFightPurse = {
  index: number;
  values: {
    fight: number;
    win: number;
    bonus: number;
  };
};
export interface ChangeNotificationStatusRequest {
  fcmToken: string;
  enableNotification: boolean;
  role: string;
}

export type PaySuccessFeeRequest = {
  offerId:string;
  fighterId:string;
  feePayment:string;
}
