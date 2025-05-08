import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CancelEventRequest,
  ChangeNotificationStatusRequest,
  ChangePasswordRequest,
  ChangeProfileRequest,
  ChangeTaskStatusRequest,
  CreateDocumentOfferRequest,
  CreateExclusiveOfferRequest,
  CreateMultiOfferRequest,
  CreateMultiOfferTailoringRequest,
  CreatePaymentIntentRequest,
  CreateTaskRequest,
  InvitationMemberRequest,
  LoginRequest,
  OfferSubmissionResponse,
  PayCreditRequest,
  PublicOfferToSelectedFighterRequest,
  RecoveryPasswordRequest,
  ResponseExclusiveOfferRequest,
  ResponsorOfferRequest,
  SendNotificationRequest,
  UpdateOfferRequest,
} from './request';
import {
  Benefit,
  CardInfoFighterResponse,
  CardInfoResponse,
  CountryResponse,
  CreatePaymentIntentResponse,
  CreditRemainingResponse,
  DecodeTokenFromEmailResponse,
  DecodeTokenInvitationResponse,
  DocumentRequiredResponse,
  EditPublicOfferResponse,
  EmployeeInfo,
  EmployeeTaskResponse,
  EventCreationResponse,
  EventDetailsResponse,
  EventTaskResponse,
  FeatureResponse,
  FighterFullProfile,
  FighterInfoResponse,
  FilterPublicOfferManagerResponse,
  FilterPublicOfferPromotionResponse,
  FoundationStyleResponse,
  FullInfoAboutExclusiveOffer,
  FullInfoAboutPublicOffer,
  InvitationLinkResponse,
  LoginResponse,
  ManagerInfo,
  ManagerInformationResponse,
  MessageInfoResponse,
  MultiContractResponse,
  MultiContractShortInfo,
  NationalityResponse,
  PaymentSetupIntentResponse,
  PromotionInformationResponse,
  PromotionNameResponse,
  PromotionResponse,
  PublicOfferInfo,
  ShortInfoFighter,
  SportTypeResponse,
  SubAccountResponse,
  TicketResponse,
  USER_ROLE,
  UserInfoResponse,
  VerificationStatusResponse,
  WeightClassResponse,
} from './response';

export const API_BASE_URL = 'http://localhost:8080/api';

// export const API_BASE_URL = 'https://api.mmafinds.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Connection: 'close',
  },
});

api.interceptors.request.use(
  async config => {
    const accessToken = await AsyncStorage.getItem('authToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const login = async (
  loginRequest: LoginRequest,
): Promise<LoginResponse> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/auth/login`,
    loginRequest,
  );
  return axiosResponse.data;
};

export const createPromotion = async (
  data: FormData,
): Promise<LoginResponse> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/promotion`, data);
  return axiosResponse.data;
};

export const createPromotionSecond = async (
  data: FormData,
): Promise<LoginResponse> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/promotion/secondary`,
    data,
  );
  return axiosResponse.data;
};

export const changeProfile = async (
  data: ChangeProfileRequest,
): Promise<LoginResponse> => {
  const axiosResponse = await api.put(
    `${API_BASE_URL}/auth/change-profile`,
    data,
  );
  return axiosResponse.data;
};

export const createManager = async (data: FormData): Promise<LoginResponse> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/manager`, data);
  return axiosResponse.data;
};

export const createManagerSecond = async (
  data: FormData,
): Promise<LoginResponse> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/manager/secondary`,
    data,
  );
  return axiosResponse.data;
};

export const requestOnForgotPassword = async (email: string): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/auth/recovery-password`,
    {
      email: email,
    },
  );
  return axiosResponse.data;
};

export const verifyAndChangePassword = async (
  data: RecoveryPasswordRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/auth/recovery-password/verify`,
    data,
  );
  return axiosResponse.data;
};

export const createFighter = async (data: FormData) => {
  const axiosResponse = await api.post(`${API_BASE_URL}/fighter`, data);
  return axiosResponse.data;
};

export const getSportTypes = async (): Promise<SportTypeResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/sport-type`);
  return axiosResponse.data;
};

export const getCountries = async (): Promise<CountryResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/country`);
  return axiosResponse.data;
};

export const getCountriesFighter = async (): Promise<CountryResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/country/fighter`);
  return axiosResponse.data;
};

export const getCountriesManager = async (): Promise<CountryResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/country/manager`);
  return axiosResponse.data;
};
export const getCountriesForSubmittedFighter = async (
  offerId: string,
): Promise<CountryResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/country/submitted-fighters/${offerId}`,
  );
  return axiosResponse.data;
};

export const getOfferFullInfo = async (
  offerId: string,
): Promise<EditPublicOfferResponse> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/full-info/${offerId}`,
  );
  return axiosResponse.data;
}; // only for edit public offer

export const getWeightClasses = async (): Promise<WeightClassResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/fighter/weight-classes`);
  return axiosResponse.data;
};

export const getNationalities = async (): Promise<NationalityResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/fighter/nationalities`);
  return axiosResponse.data;
};

export const getFoundationStyles = async (): Promise<
  FoundationStyleResponse[]
> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/fighter/foundation-styles`,
  );
  return axiosResponse.data;
};

export const getFoundationStylesFilter = async (): Promise<
  FoundationStyleResponse[]
> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/fighter/foundation-styles/filter`,
  );
  return axiosResponse.data;
};

export const getFoundationStylesFilterOfferById = async (
  offerId: string,
): Promise<FoundationStyleResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/fighter/foundation-styles/offer/${offerId}`,
  );
  return axiosResponse.data;
};

export const getShortInfoManager = async (): Promise<UserInfoResponse> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/manager/short-info`);
  return axiosResponse.data;
};

export const getShortInfoPromotion = async (): Promise<UserInfoResponse> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/promotion/short-info`,
    {},
  );
  return axiosResponse.data;
};

export const getShortInfoPromotionForCard = async (): Promise<
  PromotionResponse[]
> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/promotion/short-info/card`,
    {},
  );
  return axiosResponse.data;
};

export const getInformationPromotion =
  async (): Promise<PromotionInformationResponse> => {
    const axiosResponse = await api.get(`${API_BASE_URL}/promotion`);
    return axiosResponse.data;
  };

export const getInformationPromotionById = async (
  promotionId: string,
): Promise<PromotionInformationResponse> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/promotion/${promotionId}`,
  );
  return axiosResponse.data;
};

export const getFighterByManager = async (): Promise<
  CardInfoFighterResponse[]
> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/fighter`);
  return axiosResponse.data;
};

export const getFighterByManagerId = async (
  managerId: string,
): Promise<ShortInfoFighter[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/fighter/manager/${managerId}`,
  );
  return axiosResponse.data;
};

export const createPaymentIntentForCharge = async (
  data: CreatePaymentIntentRequest,
): Promise<CreatePaymentIntentResponse> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/payment/create-payment-intent`,
    data,
  );
  return axiosResponse.data;
};

export const setDefaultPaymentMethod = async (): Promise<void> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/payment/default`, null);
  return axiosResponse.data;
};

export const generateInviteLink = async (
  data: InvitationMemberRequest,
): Promise<InvitationLinkResponse> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/promotion/invitation`,
    data,
  );
  return axiosResponse.data;
};

export const extractPromotionInfoFromInvitation = async (
  token: string,
): Promise<DecodeTokenInvitationResponse> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/promotion/invitation?token=${token}`,
  );
  return axiosResponse.data;
};

export const extractEmailFromInvitation = async (
  token: string,
): Promise<DecodeTokenFromEmailResponse> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/auth/verify-email?token=${token}`,
  );
  return axiosResponse.data;
};

export const createSubAccount = async (data: FormData): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/promotion-employee`,
    data,
  );
  return axiosResponse.data;
};

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/auth/change-password`,
    data,
  );
  return axiosResponse.data;
};

export const getAccountInfo = async (): Promise<ManagerInformationResponse> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/manager`);
  return axiosResponse.data;
};

export const getManagerInfoById = async (
  id: string,
): Promise<ManagerInformationResponse> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/manager/${id}`);
  return axiosResponse.data;
};

export const updateAccountInfo = async (data: FormData): Promise<void> => {
  const axiosResponse = await api.put(`${API_BASE_URL}/manager`, data);
  return axiosResponse.data;
};

export const updateAccountInfoPromotion = async (
  data: FormData,
): Promise<void> => {
  const axiosResponse = await api.put(`${API_BASE_URL}/promotion`, data);
  return axiosResponse.data;
};

export const deleteAccount = async (): Promise<void> => {
  const axiosResponse = await api.delete(`${API_BASE_URL}/auth`);
  return axiosResponse.data;
};

export const deactivateAccount = async (): Promise<void> => {
  const axiosResponse = await api.put(`${API_BASE_URL}/auth/deactivate`, null);
  return axiosResponse.data;
};

export const getCredit = async (): Promise<CreditRemainingResponse> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/credit`);
  return axiosResponse.data;
};

export const payForCredit = async (data: PayCreditRequest): Promise<void> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/credit`, data);
  return axiosResponse.data;
};

export const sendVerificationDataForManager = async (
  data: FormData,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/verification/manager-verification/upload-document`,
    data,
  );
  return axiosResponse.data;
};

export const sendVerificationDataForPromotion = async (
  data: FormData,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/verification/promotion-verification/upload-document`,
    data,
  );
  return axiosResponse.data;
};

export const getVerificationStatus =
  async (type:string): Promise<VerificationStatusResponse> => {
    const axiosResponse = await api.get(`${API_BASE_URL}/verification/${type}`);
    return axiosResponse.data;
  };

export const sendFeedback = async (data: FormData): Promise<void> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/feedback`, data);
  return axiosResponse.data;
};

export const createTicket = async (data: FormData): Promise<void> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/ticket`, data);
  return axiosResponse.data;
};

export const getTickets = async (): Promise<TicketResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/ticket`);
  return axiosResponse.data;
};

export const getPaymentMethods = async (): Promise<CardInfoResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/payment/payment-methods`,
  );
  return axiosResponse.data;
};

export const createPaymentIntentWithoutCharge =
  async (): Promise<PaymentSetupIntentResponse> => {
    const axiosResponse = await api.post(
      `${API_BASE_URL}/payment/create-setup-intent`,
      {},
    );
    return axiosResponse.data;
  };

export const setDefaultPaymentMethodById = async (
  paymentMethodId: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/payment/set-default-payment-method`,
    {paymentMethodId},
  );
  return axiosResponse.data;
};

export const detachPaymentMethod = async (
  paymentMethodId: string,
): Promise<void> => {
  const axiosResponse = await api.delete(
    `${API_BASE_URL}/payment/detach-payment-method/${paymentMethodId}`,
  );
  return axiosResponse.data;
};

export const getAllSubAccounts = async (): Promise<SubAccountResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/promotion/sub-accounts`);
  return axiosResponse.data;
};

export const deleteSubAccount = async (subAccountId: string): Promise<void> => {
  const axiosResponse = await api.delete(
    `${API_BASE_URL}/promotion/sub-accounts/${subAccountId}`,
  );
  return axiosResponse.data;
};

export const createEvent = async (
  data: FormData,
): Promise<EventCreationResponse> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/event`, data);
  return axiosResponse.data;
};

export const updateEvent = async (
  eventId: string,
  data: FormData,
): Promise<EventCreationResponse> => {
  const axiosResponse = await api.put(`${API_BASE_URL}/event/${eventId}`, data);
  return axiosResponse.data;
};

export const getEvents = async (): Promise<EventDetailsResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/event`);
  return axiosResponse.data;
};

export const getEventById = async (
  eventId: string,
): Promise<EventDetailsResponse> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/event/${eventId}`);
  return axiosResponse.data;
};

export const createPublicOffer = async (
  data: UpdateOfferRequest,
): Promise<void> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/public-offers`, data);
  return axiosResponse.data;
};

export const getPublicOffers = async (): Promise<PublicOfferInfo[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/public-offers`);
  return axiosResponse.data;
};

export const getPublicOffersByPromotion = async (
  promotionId: string,
): Promise<PublicOfferInfo[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/promotion/${promotionId}`,
  );
  return axiosResponse.data;
};

export const getAllPublicOffers = async (): Promise<PublicOfferInfo[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/public-offers/all`);
  return axiosResponse.data;
};

export const getExclusiveOffers = async () => {
  const axiosResponse = await api.get(`${API_BASE_URL}/exclusive-offers`);
  return axiosResponse.data;
};

export const getPublicOfferInfoById = async (
  offerId: string,
): Promise<FullInfoAboutPublicOffer> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/${offerId}`,
  );

  return axiosResponse.data;
};

export const getPublicOfferInfoByIdForManagerByFighter = async (
  offerId: string,
  fighterId: string,
): Promise<FullInfoAboutPublicOffer> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/${offerId}/${fighterId}`,
  );
  return axiosResponse.data;
};

export const getPublicInfoForManager = async (
  offerId: string,
): Promise<FullInfoAboutPublicOffer> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/submitted-fighters/manager/${offerId}`,
  );
  return axiosResponse.data;
};
export const submitOfferByFighterWithoutFeaturing = async (
  offerId: string,
  fighterId: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/public-offers/submit-fighter/${offerId}/${fighterId}`,
    {},
  );
  return axiosResponse.data;
};

export const getExclusiveOfferInfoById = async (
  offerId: string,
): Promise<FullInfoAboutExclusiveOffer> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/exclusive-offers/${offerId}`,
  );
  return axiosResponse.data;
};

export const chooseFighterForExclusiveOffer = async (
  fighterId: string,
  offerId: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/exclusive-offers/choose-fighter/${fighterId}/${offerId}`,
    {},
  );
  return axiosResponse.data;
}
export const declineExclusiveOffer = async (
  offerId: string,
  data: ResponseExclusiveOfferRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/exclusive-offer/reject/${offerId}/${data.fighterId}`,
    {rejectedReason: data.response},
  );
  return axiosResponse.data;
};

export const declineMultiFightOffer = async (
  offerId: string,
  data: ResponseExclusiveOfferRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/multi-fight-contract/reject/${offerId}/${data.fighterId}`,
    {rejectedReason: data.response},
  );
  return axiosResponse.data;
}

export const acceptMultiFightOffer = async (
  offerId: string,
  fighterId: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/multi-fight-contract/confirm/${offerId}/${fighterId}`,
  );
  return axiosResponse.data;
}
export const negotiationDocumentForMultiFightOffer = async (
  data: CreateMultiOfferTailoringRequest

): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/multi-fight-contract/negotiation/${data.offerId}/${data.fighterId}`,data.purses
  );
  return axiosResponse.data;
}

export const getFullInfoAboutFighter = async (
  fighterId: string,
): Promise<FighterInfoResponse> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/fighter/${fighterId}`);
  return axiosResponse.data;
};

export const switchFighterLookingStatus = async (
  fighterId: string,
): Promise<void> => {
  const axiosResponse = await api.put(
    `${API_BASE_URL}/fighter/looking-opponent/${fighterId}`,
    {},
  );
  return axiosResponse.data;
};

export const getAllManagers = async (): Promise<ManagerInfo[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/manager/all`);
  return axiosResponse.data;
};
export const getShortInfoFighters = async (): Promise<ShortInfoFighter[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/fighter/short-info`);
  return axiosResponse.data;
};

export const getShortInfoFightersByManager = async (): Promise<
  ShortInfoFighter[]
> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/fighter/short-info/manager`,
  );
  return axiosResponse.data;
};

export const createExclusiveOffer = async (
  data: CreateExclusiveOfferRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/exclusive-offers`,
    data,
  );
  return axiosResponse.data;
};

export const createMultiFightOffer = async (data: CreateMultiOfferRequest): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/multi-fight-offers`,
    data,
  );
  return axiosResponse.data;
};

export const getEmployees = async (): Promise<EmployeeInfo[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/promotion-employee`);
  return axiosResponse.data;
};

export const createTask = async (data: CreateTaskRequest) => {
  const axiosResponse = await api.post(`${API_BASE_URL}/task`, data);
  return axiosResponse.data;
};

export const getTaskOnEmployee = async (
  employeeId: string,
): Promise<EmployeeTaskResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/task/employee/${employeeId}`,
  );
  return axiosResponse.data;
};

export const getTaskOnEvent = async (
  eventId: string,
): Promise<EventTaskResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/task/event/${eventId}`);
  return axiosResponse.data;
};

export const changeStatusOfTask = async (data: ChangeTaskStatusRequest) => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/task/change-status`,
    data,
  );
  return axiosResponse.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const axiosResponse = await api.delete(`${API_BASE_URL}/task/${taskId}`);
  return axiosResponse.data;
};

export const getMultiFightOffers = async (): Promise<
  MultiContractShortInfo[]
> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/multi-fight-offers`);
  return axiosResponse.data;
};

export const renewDueDate = async (
  offerId: string,
  newDueDate: string,
): Promise<void> => {
  const axiosResponse = await api.put(
    `${API_BASE_URL}/public-offers/due-date/${offerId}`,
    {dueDate: newDueDate},
  );
  return axiosResponse.data;
};

export const renewExclusiveOfferDueDate = async (
  offerId: string,
  newDueDate: string,
): Promise<void> => {
  const axiosResponse = await api.put(
    `${API_BASE_URL}/exclusive-offers/renew/${offerId}`,
    {dueDate: newDueDate},
  );
  return axiosResponse.data;
};

export const renewDueDateMultifight = async (
  offerId: string,
  newDueDate: string,
): Promise<void> => {
  const axiosResponse = await api.put(
    `${API_BASE_URL}/multi-fight-offers/due-date/${offerId}`,
    {dueDate: newDueDate},
  );
  return axiosResponse.data;
};
export const closeOffer = async (
  offerId: string,
  reason: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/public-offers/close/${offerId}`,
    {reason},
  );
  return axiosResponse.data;
};

export const closeMultiFightOffer = async (
  offerId: string,
  reason: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/multi-fight-offers/close/${offerId}`,
    {reason},
  );
  return axiosResponse.data;
};

export const closeExclusiveOffer = async (
  offerId: string,
  reason: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/exclusive-offers/close/${offerId}`,
    {reason},
  );
  return axiosResponse.data;
};

export const getBenefitsInPublicOffer = async (
  offerId: string,
): Promise<Benefit> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/benefits/${offerId}`,
  );
  return axiosResponse.data;
};

export const featureYourOffer = async (offerId: string): Promise<void> => {
  return await api.post(`${API_BASE_URL}/public-offers/feature/${offerId}`);
};

export const getSubmissionsOfferByFighter = async (
  fighterId: string,
): Promise<OfferSubmissionResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/submission-offer/${fighterId}`,
  );
  return axiosResponse.data;
};

export const getSubmissionManager = async (): Promise<
  OfferSubmissionResponse[]
> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/public-offers/submission-offer`,
  );
  return axiosResponse.data;
};

export const declineOffer = async (
  offerId: string,
  fighterId: string,
): Promise<void> => {
  const axiosResponse = await api.delete(
    `${API_BASE_URL}/public-offers/decline/${offerId}/${fighterId}`,
  );
  return axiosResponse.data;
};

export const getMultiFightOfferById = async (
  offerId: string,
): Promise<MultiContractResponse> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/multi-fight-offers/${offerId}`,
  );
  return axiosResponse.data;
};


export const getAllPromotionName = async (): Promise<
  PromotionNameResponse[]
> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/promotion/all-name`);
  return axiosResponse.data;
};

export const getUpdateFighter = async (
  fighterId: string,
): Promise<FighterFullProfile> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/fighter/edit/${fighterId}`,
  );
  return axiosResponse.data;
};

export const updateFighter = async (fighterId: string, data: FormData) => {
  const axiosResponse = await api.put(
    `${API_BASE_URL}/fighter/${fighterId}`,
    data,
  );
  return axiosResponse.data;
};

export const featureFighterOnOffer = async (
  offerId: string,
  fighterId: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/fighter/feature/${offerId}/${fighterId}`,
    {},
  );
  return axiosResponse.data;
};

export const changeNotificationState = async (
  state: ChangeNotificationStatusRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/auth/notification`,
    state,
  );
  return axiosResponse.data;
};

export const getMessageInfo = async (
  userId: string,
  userRole: USER_ROLE | undefined,
): Promise<MessageInfoResponse> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/user/message-info?userIds=${userId}&userRole=${userRole}`,
  );
  return axiosResponse.data;
};

export const sendNotification = async (data: SendNotificationRequest) => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/user/notification`,
    data,
  );
  return axiosResponse.data;
};

export const sendNotificationOffer = async (data: SendNotificationRequest) => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/user/notification/offer`,
    data,
  );
  return axiosResponse.data;
};

export const getFeatures = async (): Promise<FeatureResponse[]> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/features`);
  return axiosResponse.data;
};

export const getFilterForPublicOffers =
  async (): Promise<FilterPublicOfferPromotionResponse> => {
    const axiosResponse = await api.get(`${API_BASE_URL}/filter/public-offers`);
    return axiosResponse.data;
  };
export const getFilterForPublicOffersManager =
  async (): Promise<FilterPublicOfferManagerResponse> => {
    const axiosResponse = await api.get(
      `${API_BASE_URL}/filter/public-offers/manager`,
    );
    return axiosResponse.data;
  };

export const getFilterForExclusiveOffers =
  async (): Promise<FilterPublicOfferPromotionResponse> => {
    const axiosResponse = await api.get(
      `${API_BASE_URL}/filter/exclusive-offers`,
    );
    return axiosResponse.data;
  };

export const getAllRequiredDocumentByPromotion = async (): Promise<
  DocumentRequiredResponse[]
> => {
  const axiosResponse = await api.get(`${API_BASE_URL}/document`);
  return axiosResponse.data;
};

export const saveRequiredDocumentByPromotion = async (
  doc: CreateDocumentOfferRequest,
) => {
  const axiosResponse = await api.post(`${API_BASE_URL}/document`, doc);
  return axiosResponse.data;
};

export const deleteRequiredDocumentByPromotion = async (
  docId: string,
): Promise<void> => {
  const axiosResponse = await api.delete(`${API_BASE_URL}/document/${docId}`);
  return axiosResponse.data;
};

export const sendFirstOfferAfterSelectedFighter = async (
  doc: PublicOfferToSelectedFighterRequest,
) => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/public-offer`,
    doc,
  );
  return axiosResponse.data;
};

export const confirmPublicOffer = async (
  data: ResponsorOfferRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/public-offer/confirm/${data.offerId}/${data.fighterId}`,
    {},
  );
  return axiosResponse.data;
};

export const confirmExclusiveOffer = async (
  data: ResponsorOfferRequest,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/exclusive-offer/confirm/${data.offerId}/${data.fighterId}`,
    {},
  );
  return axiosResponse.data;
};

export const rejectPublicOffer = async (data: ResponsorOfferRequest) => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/public-offer/reject/${data.offerId}/${data.fighterId}`,
    {rejectedReason: data.rejectedReason},
  );
  return axiosResponse.data;
};

export const cancelEvent = async (data: CancelEventRequest): Promise<void> => {
  const axiosResponse = await api.post(`${API_BASE_URL}/event/close`, data);
  return axiosResponse.data;
};

export const negotiationPublicOffer = async (data: ResponsorOfferRequest) => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/public-offer/negotiation/${data.offerId}/${data.fighterId}`,
    data.negotiateRequest,
  );
  return axiosResponse.data;
};
export const negotiationExclusiveOffer = async (
  data: ResponsorOfferRequest,
) => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/exclusive-offer/negotiation/${data.offerId}/${data.fighterId}`,
    data.negotiateRequest,
  );
  return axiosResponse.data;
};

export const getAllRequiredDocumentsForPublicOffer = async (
  offerId: string,
): Promise<DocumentRequiredResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/document/public-offer/${offerId}`,
  );
  return axiosResponse.data;
};

export const getAllRequiredDocumentsForExclusiveOffer = async (
  offerId: string,
): Promise<DocumentRequiredResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/document/exclusive-offer/${offerId}`,
  );
  return axiosResponse.data;
};

export const getAllRequiredDocumentsForMultiFightOffer = async (
  offerId: string,
): Promise<DocumentRequiredResponse[]> => {
  const axiosResponse = await api.get(
    `${API_BASE_URL}/document/multi-fight-contract/${offerId}`,
  );
  return axiosResponse.data;
};

export const addDocument = async (data: FormData): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/required-document`,
    data,
  );
  return axiosResponse.data;
};

export const addDocumentExclusiveOffer = async (data: FormData): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/exclusive-offer/required-document`,
    data,
  );
  return axiosResponse.data;
};

export const addDocumentMultiFightOffer = async (data: FormData): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/multi-fight-contract/required-document`,
    data,
  );
  return axiosResponse.data;
};

export const renewDocumentPublicOfferDueDate = async (
  offerId: string,
  dueDate: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/public-offer/due-date/${offerId}`,
    {dueDate},
  );
  return axiosResponse.data;
};
export const renewDocumentExclusiveOfferDueDate = async (
  offerId: string,
  dueDate: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/exclusive-offer/due-date/${offerId}`,
    {dueDate},
  );
  return axiosResponse.data;
};
export const renewDocumentMultiFightOfferDueDate = async (
  offerId: string,
  dueDate: string,
): Promise<void> => {
  const axiosResponse = await api.post(
    `${API_BASE_URL}/document/multi-contract-offer/due-date/${offerId}`,
    {dueDate},
  );
  return axiosResponse.data;
};
