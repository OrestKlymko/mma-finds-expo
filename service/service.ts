import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ChangeNotificationStatusRequest,
    ChangePasswordRequest,
    ChangeProfileRequest,
    ChangeTaskStatusRequest, CheckEntityExistsRequest,
    CreateDocumentOfferRequest,
    CreateExclusiveOfferRequest,
    CreateMultiOfferRequest,
    CreateMultiOfferTailoringRequest,
    CreatePaymentIntentRequest,
    CreatePaymentIntentStripeRequest,
    CreateTaskRequest,
    DefaultMethodRequest, FighterAndManagerIdsResponse, FighterInfoRequest,
    InvitationMemberRequest,
    LoginRequest,
    OfferSubmissionResponse,
    PayCreditRequest,
    PaySuccessFeeRequest,
    PublicOfferToSelectedFighterRequest,
    RecoveryPasswordRequest,
    ResponseExclusiveOfferRequest,
    ResponsorOfferRequest,
    SendNotificationRequest,
    UpdateOfferRequest,
} from './request';
import {
    Benefit,
    CardInfoResponse, CheckCriteriaExistResponse,
    CountryResponse,
    CreatePaymentIntentResponse,
    CreditRemainingResponse,
    DecodeTokenFromEmailResponse,
    DecodeTokenInvitationResponse,
    DocumentRequiredResponse,
    EmployeeInfo,
    EmployeeTaskResponse,
    EventCreationResponse,
    EventShortInfo,
    EventTaskResponse,
    FeatureResponse, FighterInfoResponse,
    FilterPublicOfferManagerResponse,
    FilterPublicOfferPromotionResponse,
    FoundationStyleResponse,
    FullInfoAboutExclusiveOffer,
    FullInfoAboutPublicOffer,
    InvitationLinkResponse,
    LoginResponse,
    ManagerInfo,
    ManagerInformationResponse, ManagerShortInfo,
    MessageInfoResponse,
    MultiContractResponse,
    MultiContractShortInfo,
    NationalityResponse,
    PaymentSetupIntentResponse, PaymentStatusResponse,
    PromotionInformationResponse,
    PromotionNameResponse,
    PromotionResponse, PromotionShortInfo,
    PublicOfferInfo, ResponseFighterOnPrivateOfferEnum,
    ShortInfoFighter,
    SportTypeResponse,
    SubAccountResponse,
    TicketResponse,
    USER_ROLE,
    UserInfoResponse,
    VerificationStatusResponse,
    WeightClassResponse,
} from './response';
import {buildQueryString} from "@/utils/utils";

// export const API_BASE_URL = 'https://api.mmafinds.com/api';
export const API_BASE_URL = 'http://localhost:8080/api';

// export const API_BASE_URL = 'https://api.dev.mmafinds.com/api';

interface HttpError extends Error {
    status: number;
    body?: any;
}

export async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await AsyncStorage.getItem('authToken');

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: isFormData ? headers : {'Content-Type': 'application/json', ...headers},
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        const err: HttpError = new Error(
            text || `HTTP ${response.status} ${response.statusText}`
        ) as HttpError;
        err.status = response.status;
        err.body = text;
        throw err;
    }

    if (response.status === 204) return undefined as any;

    const ct = response.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return undefined as any;

    return (await response.json()) as T;
}

export async function jsonRequest<T>(
    path: string,
    method: string,
    body?: any
): Promise<T> {
    const token = await AsyncStorage.getItem('authToken');
    const res = await fetch(API_BASE_URL + path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: body && JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const err = new Error(
            data?.message ?? `HTTP ${res.status}: ${res.statusText}`
        );
        (err as any).status = res.status;
        (err as any).response = data;
        throw err;
    }

    return data as T;
}


export const login = (body: LoginRequest): Promise<LoginResponse> =>
    jsonRequest<LoginResponse>('/auth/login', 'POST', body);

export const createPromotion = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/promotion', {method: 'POST', body: data}); // CHECKED

export const createPromotionSecond = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/promotion/secondary', {method: 'POST', body: data});

export const changeProfile = (data: ChangeProfileRequest): Promise<LoginResponse> =>
    jsonRequest<LoginResponse>('/auth/change-profile', 'PUT', data);

export const createManager = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/manager', {method: 'POST', body: data}); // CHECKED

export const createManagerSecond = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/manager/secondary', {method: 'POST', body: data});

export const requestOnForgotPassword = (email: string): Promise<void> =>
    jsonRequest<void>('/auth/recovery-password', 'POST', {email});

export const verifyAndChangePassword = (data: RecoveryPasswordRequest): Promise<void> =>
    jsonRequest<void>('/auth/recovery-password/verify', 'POST', data);

export const createFighter = (data: FormData): Promise<any> =>
    request<any>('/fighter', {method: 'POST', body: data});

export const checkExistFighterByEmail = (request: CheckEntityExistsRequest): Promise<any> =>
    jsonRequest<CheckCriteriaExistResponse>(`/fighter/check/email`, 'POST', request); // CHECKED

export const checkExistFighterByName = (request: CheckEntityExistsRequest): Promise<any> =>
    jsonRequest<CheckCriteriaExistResponse>(`/fighter/check/name`, 'POST', request); // CHECKED

export const getSportTypes = (): Promise<SportTypeResponse[]> =>
    request<SportTypeResponse[]>('/sport-type', {method: 'GET'});

export const getCountries = (): Promise<CountryResponse[]> =>
    request<CountryResponse[]>('/country', {method: 'GET'});

export const getCountriesFighter = (): Promise<CountryResponse[]> =>
    request<CountryResponse[]>('/country/fighter', {method: 'GET'});

export const getCountriesManager = (): Promise<CountryResponse[]> =>
    request<CountryResponse[]>('/country/manager', {method: 'GET'});

export const getCountriesForSubmittedFighter = (offerId: string): Promise<CountryResponse[]> =>
    request<CountryResponse[]>(`/country/submitted-fighters/${offerId}`, {method: 'GET'});

export const getWeightClasses = (): Promise<WeightClassResponse[]> =>
    request<WeightClassResponse[]>('/weight-class', {method: 'GET'}); // CHECKED

export const getNationalities = (): Promise<NationalityResponse[]> =>
    request<NationalityResponse[]>('/nationality', {method: 'GET'}); // CHECKED

export const getFoundationStyles = (): Promise<FoundationStyleResponse[]> =>
    request<FoundationStyleResponse[]>('/foundation', {method: 'GET'}); // CHECKED

export const getFoundationStylesFilter = (): Promise<FoundationStyleResponse[]> =>
    request<FoundationStyleResponse[]>('/filter/foundation', {method: 'GET'});

export const getFoundationStylesFilterOfferById = (offerId: string): Promise<FoundationStyleResponse[]> =>
    request<FoundationStyleResponse[]>(`/filter/foundation/submitted-fighter/${offerId}`, {method: 'GET'});

export const getShortInfoManager = (managerId: string): Promise<ManagerShortInfo> =>
    request<ManagerShortInfo>(`/manager/${managerId}/short-info`, {method: 'GET'}); // CHECKED

export const getShortInfoPromotion = (promotionId: string): Promise<PromotionShortInfo> =>
    request<PromotionShortInfo>(`/promotion/${promotionId}/short-info`, {method: 'GET'}); // CHECKED

export const getShortInfoPromotionEmployee = (): Promise<UserInfoResponse> =>
    request<UserInfoResponse>('/promotion-employee/short-info', {method: 'GET'});

export const getAllPromotions = (): Promise<PromotionResponse[]> =>
    request<PromotionResponse[]>('/promotion', {method: 'GET'}); // CHECKED

export const getInformationPromotionById = (promotionId: string): Promise<PromotionInformationResponse> =>
    request<PromotionInformationResponse>(`/promotion/${promotionId}`, {method: 'GET'});

export const confirmFighterParticipationMultiFight = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/multi-fight-offers/submit-fighter/${offerId}/${fighterId}`, {method: 'POST'});

export const confirmFighterParticipationExclusive = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/exclusive/submit-fighter/${offerId}/${fighterId}`, {method: 'POST'});

export const responseFighterOnSubmissionPrivateOffer = (offerId: string, fighterId: string, response: ResponseFighterOnPrivateOfferEnum): Promise<void> =>
    request<void>(`/offer/exclusive/${offerId}/${fighterId}/${response}/respond`, {method: 'PUT'});

export const getFighterByManagerId = (managerId: string): Promise<ShortInfoFighter[]> =>
    request<ShortInfoFighter[]>(`/fighter/manager/${managerId}`, {method: 'GET'}); // CHECKED

export const createPaymentIntentForStripe = (data: CreatePaymentIntentStripeRequest): Promise<CreatePaymentIntentResponse> =>
    jsonRequest<CreatePaymentIntentResponse>('/stripe/payment-intent', 'POST', data);

export const chargePaymentIntentOnDefaultMethod = (data: CreatePaymentIntentStripeRequest): Promise<PaymentStatusResponse> =>
    jsonRequest<PaymentStatusResponse>('/stripe/charge-default', 'POST', data);

export const setDefaultPaymentMethod = (): Promise<void> =>
    request<void>('/payment/default', {method: 'POST'});

export const setDefaultPaymentMethodStripe = (data: DefaultMethodRequest): Promise<void> =>
    jsonRequest<void>('/stripe/set-default', 'POST', data);

export const generateInviteLink = (data: InvitationMemberRequest): Promise<InvitationLinkResponse> =>
    jsonRequest<InvitationLinkResponse>('/promotion/invitation', 'POST', data);

export const extractPromotionInfoFromInvitation = (token: string): Promise<DecodeTokenInvitationResponse> =>
    request<DecodeTokenInvitationResponse>(`/promotion/invitation?token=${token}`, {method: 'GET'});

export const extractEmailFromInvitation = (token: string): Promise<DecodeTokenFromEmailResponse> =>
    request<DecodeTokenFromEmailResponse>(`/auth/verify-email?token=${token}`, {method: 'GET'});

export const createSubAccount = (data: FormData): Promise<void> =>
    request<void>('/promotion-employee', {method: 'POST', body: data});

export const changePassword = (data: ChangePasswordRequest): Promise<void> =>
    jsonRequest<void>('/auth/change-password', 'POST', data);

export const getManagerInfoById = (id: string): Promise<ManagerInformationResponse> =>
    request<ManagerInformationResponse>(`/manager/${id}`, {method: 'GET'}); // CHECKED

export const updateAccountInfo = (data: FormData): Promise<void> =>
    request<void>('/manager', {method: 'PUT', body: data});

export const updateAccountInfoPromotion = (data: FormData): Promise<void> =>
    request<void>('/promotion', {method: 'PUT', body: data});

export const deleteAccount = (): Promise<void> =>
    request<void>('/auth', {method: 'DELETE'});

export const deactivateAccount = (): Promise<void> =>
    request<void>('/auth/deactivate', {method: 'PUT'});

export const getCredit = (): Promise<CreditRemainingResponse> =>
    request<CreditRemainingResponse>('/payment/credit', {method: 'GET'});

export const payForCredit = (data: PayCreditRequest): Promise<void> =>
    jsonRequest<void>('/payment/credit', 'POST', data);

export const sendVerificationDataForManager = (data: FormData): Promise<void> =>
    request<void>('/verification/manager-verification/upload-document', {method: 'POST', body: data});

export const sendVerificationDataForPromotion = (data: FormData): Promise<void> =>
    request<void>('/verification/promotion-verification/upload-document', {method: 'POST', body: data});

export const getVerificationStatus = (type: string): Promise<VerificationStatusResponse> =>
    request<VerificationStatusResponse>(`/verification/${type}`, {method: 'GET'});

export const sendFeedback = (data: FormData): Promise<void> =>
    request<void>('/feedback', {method: 'POST', body: data});

export const createTicket = (data: FormData): Promise<void> =>
    request<void>('/ticket', {method: 'POST', body: data});

export const getTickets = (): Promise<TicketResponse[]> =>
    request<TicketResponse[]>('/ticket', {method: 'GET'});

export const getPaymentMethods = (): Promise<CardInfoResponse[]> =>
    request<CardInfoResponse[]>('/payment/payment-methods', {method: 'GET'});

export const createPaymentIntentWithoutCharge = (): Promise<PaymentSetupIntentResponse> =>
    jsonRequest<PaymentSetupIntentResponse>('/payment/create-setup-intent', 'POST', {});

export const setDefaultPaymentMethodById = (paymentMethodId: string): Promise<void> =>
    jsonRequest<void>('/payment/set-default-payment-method', 'POST', {paymentMethodId});

export const detachPaymentMethod = (paymentMethodId: string): Promise<void> =>
    request<void>(`/payment/detach-payment-method/${paymentMethodId}`, {method: 'DELETE'});

export const getAllSubAccounts = (): Promise<SubAccountResponse[]> =>
    request<SubAccountResponse[]>('/promotion/sub-accounts', {method: 'GET'});

export const deleteSubAccount = (subAccountId: string): Promise<void> =>
    request<void>(`/promotion/sub-accounts/${subAccountId}`, {method: 'DELETE'});

export const createEvent = (data: FormData): Promise<EventCreationResponse> =>
    request<EventCreationResponse>('/event', {method: 'POST', body: data});

export const updateEvent = (eventId: string, data: FormData): Promise<EventCreationResponse> =>
    request<EventCreationResponse>(`/event/${eventId}`, {method: 'PUT', body: data});

export const getEvents = (): Promise<EventShortInfo[]> =>
    request<EventShortInfo[]>('/event', {method: 'GET'}); // CHECKED

export const getEventById = (eventId: string): Promise<EventShortInfo> =>
    request<EventShortInfo>(`/event/${eventId}`, {method: 'GET'});// CHECKED

export const createPublicOffer = (data: UpdateOfferRequest): Promise<void> =>
    jsonRequest<void>('/offer/public', 'POST', data);

export const getAllPublicOffers = (
    promotionId?: string | null,
    lastSeen?: string | null
): Promise<PublicOfferInfo[]> => {
    const qs = buildQueryString({promotionId, lastSeen});
    return request<PublicOfferInfo[]>(`/offer/public${qs}`, {method: 'GET'}); // CHECKED
};

export const getAllPrivateOffers = (
    promotionId?: string | null,
    lastSeen?: string | null
): Promise<PublicOfferInfo[]> => {
    const qs = buildQueryString({promotionId, lastSeen});
    return request<PublicOfferInfo[]>(`/offer/exclusive${qs}`, {method: 'GET'}); // CHECKED
};

export const getExclusiveOffers = (): Promise<any> =>
    request<any>('/offer/exclusive', {method: 'GET'});// CHECKED

export const getPublicOfferInfoById = (offerId: string, fighterId: string | null | undefined): Promise<FullInfoAboutPublicOffer> => {
    const qs = buildQueryString({fighterId});
    return request<FullInfoAboutPublicOffer>(`/offer/public/${offerId}${qs}`, {method: 'GET'});
} // CHECKED

export const getPublicInfoForManager = (offerId: string): Promise<FullInfoAboutPublicOffer> =>
    request<FullInfoAboutPublicOffer>(`/offer/public/${offerId}/summary`, {method: 'GET'});

export const submitOfferByFighterWithoutFeaturing = (offerId: string, fighterId: string): Promise<void> =>
    jsonRequest<void>(`/submission/${offerId}/${fighterId}/submit`, 'POST', {});

export const renewSubmissionOffer = (offerId: string, fighterId: string): Promise<void> =>
    jsonRequest<void>(`/public-offers/renew-submission/${offerId}/${fighterId}`, 'POST', {});

export const getExclusiveOfferInfoById = (offerId: string, fighterId: undefined | null | string): Promise<FullInfoAboutExclusiveOffer> => {
    const qs = buildQueryString({fighterId});
    return request<FullInfoAboutExclusiveOffer>(`/offer/exclusive/${offerId}${qs}`, {method: 'GET'});
} // CHECKED

export const chooseFighterForExclusiveOffer = (fighterId: string | null | undefined, offerId: string): Promise<void> =>
    request<void>(`/offer/exclusive/${offerId}/${fighterId}/choose-fighter`, {method: 'POST'});

export const publishPrivateOffer = (offerId: string): Promise<void> =>
    request<void>(`/offer/exclusive/${offerId}/publish`, {method: 'PUT'});

export const declineExclusiveOffer = (offerId: string, data: ResponseExclusiveOfferRequest): Promise<void> =>
    jsonRequest<void>(`/negotiation/exclusive/reject/${offerId}/${data.fighterId}`, 'POST', {rejectionReason: data.response});

export const declineMultiFightOffer = (offerId: string, data: ResponseExclusiveOfferRequest): Promise<void> =>
    jsonRequest<void>(`/negotiation/multi/reject/${offerId}/${data.fighterId}`, 'POST', {rejectionReason: data.response});

export const acceptMultiFightOffer = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/negotiation/multi/confirm/${offerId}/${fighterId}`, {method: 'POST'});

export const negotiationDocumentForMultiFightOffer = (data: CreateMultiOfferTailoringRequest): Promise<void> =>
    jsonRequest<void>(`/negotiation/multi/negotiate/${data.offerId}/${data.fighterId}`, 'POST', {pursesMultiFight: data.purses});

export const getFullInfoAboutFighter = (fighterId: string): Promise<FighterInfoResponse> =>
    request<FighterInfoResponse>(`/fighter/${fighterId}`, {method: 'GET'});

export const switchFighterLookingStatus = (fighterId: string): Promise<void> =>
    jsonRequest<void>(`/fighter/${fighterId}/looking-opponent`, 'PUT', {}); // CHECKED

export const getAllManagers = (): Promise<ManagerInfo[]> =>
    request<ManagerInfo[]>('/manager', {method: 'GET'}); // CHECKED

export const getShortInfoFighters = (): Promise<ShortInfoFighter[]> =>
    request<ShortInfoFighter[]>('/fighter', {method: 'GET'}); // CHECKED

export const getShortInfoFightersByManager = (managerId: string): Promise<ShortInfoFighter[]> =>
    request<ShortInfoFighter[]>(`/fighter/manager/${managerId}`, {method: 'GET'}); // CHECKED

export const createExclusiveOffer = (data: CreateExclusiveOfferRequest): Promise<void> =>
    jsonRequest<void>('/offer/exclusive', 'POST', data); // CHECKED

export const submitFighterOnExclusiveOffer = (offerId: string, fighterInfo: FighterInfoRequest): Promise<FighterInfoRequest> =>
    jsonRequest<FighterInfoRequest>(`/offer/exclusive/${offerId}/submit`, 'POST', fighterInfo);

export const getSubmittedFightersOnExclusiveOffer = (offerId: string): Promise<FighterAndManagerIdsResponse> =>
    jsonRequest<FighterAndManagerIdsResponse>(`/offer/exclusive/${offerId}/submit`, 'GET');

export const createMultiFightOffer = (data: CreateMultiOfferRequest): Promise<void> =>
    jsonRequest<void>('/offer/multi', 'POST', data); // CHECKED

export const getEmployees = (): Promise<EmployeeInfo[]> =>
    request<EmployeeInfo[]>('/promotion-employee', {method: 'GET'});

export const createTask = (data: CreateTaskRequest): Promise<any> =>
    jsonRequest<any>('/task', 'POST', data);

export const getTaskOnEmployee = (employeeId: string): Promise<EmployeeTaskResponse[]> =>
    request<EmployeeTaskResponse[]>(`/task/employee/${employeeId}`, {method: 'GET'});

export const getTaskOnEvent = (eventId: string): Promise<EventTaskResponse[]> =>
    request<EventTaskResponse[]>(`/task/event/${eventId}`, {method: 'GET'});

export const changeStatusOfTask = (data: ChangeTaskStatusRequest): Promise<any> =>
    jsonRequest<any>('/task/change-status', 'POST', data);

export const deleteTask = (taskId: string): Promise<void> =>
    request<void>(`/task/${taskId}`, {method: 'DELETE'});

export const getMultiFightOffers = (): Promise<MultiContractShortInfo[]> =>
    request<MultiContractShortInfo[]>('/offer/multi', {method: 'GET'}); // CHECKED

export const renewDueDate = (offerId: string, newDueDate: string): Promise<void> =>
    jsonRequest<void>(`/offer/public/${offerId}`, 'PUT', {dueDate: newDueDate});

export const renewExclusiveOfferDueDate = (offerId: string, newDueDate: string): Promise<void> =>
    jsonRequest<void>(`/offer/exclusive/${offerId}`, 'PUT', {dueDate: newDueDate});

export const renewDueDateMultifight = (offerId: string, newDueDate: string): Promise<void> =>
    jsonRequest<void>(`/offer/multi/${offerId}`, 'PUT', {dueDate: newDueDate});

export const closeOffer = (offerId: string, reason: string): Promise<void> =>
    jsonRequest<void>(`/offer/public/${offerId}`, 'POST', {reason});

export const closeMultiFightOffer = (offerId: string, reason: string): Promise<void> =>
    jsonRequest<void>(`/offer/multi/${offerId}`, 'POST', {reason});

export const closeExclusiveOffer = (offerId: string, reason: string): Promise<void> =>
    jsonRequest<void>(`/offer/exclusive/${offerId}`, 'POST', {reason});

export const getBenefitsInPublicOffer = (offerId: string): Promise<Benefit> =>
    request<Benefit>(`/benefit/offer/${offerId}`, {method: 'GET'});// CHECKED

export const featureYourOffer = (offerId: string): Promise<void> =>
    request<void>(`/offer/public/${offerId}/feature`, {method: 'POST'});

export const getSubmissionsOfferByFighter = (fighterId: string): Promise<OfferSubmissionResponse[]> =>
    request<OfferSubmissionResponse[]>(`/submission/${fighterId}`, {method: 'GET'});

export const getSubmissionManager = (): Promise<OfferSubmissionResponse[]> =>
    request<OfferSubmissionResponse[]>('/submission', {method: 'GET'});// CHECKED

export const declineOffer = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/submission/${offerId}/${fighterId}/decline`, {method: 'DELETE'});

export const getMultiFightOfferById = (offerId: string, fighterId: string | undefined | null): Promise<MultiContractResponse> => {
    const qs = buildQueryString({fighterId});
    return request<MultiContractResponse>(`/offer/multi/${offerId}${qs}`, {method: 'GET'});
}

export const getAllPromotionName = (): Promise<PromotionNameResponse[]> =>
    request<PromotionNameResponse[]>('/filter/promotion/name', {method: 'GET'});

export const updateFighter = (fighterId: string, data: FormData): Promise<any> =>
    request<any>(`/fighter/${fighterId}`, {method: 'PUT', body: data});

export const featureFighterOnOffer = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/submission/${offerId}/${fighterId}/feature`, {method: 'POST', body: JSON.stringify({})});

export const changeNotificationState = (state: ChangeNotificationStatusRequest): Promise<void> =>
    jsonRequest<void>('/notification/mobile', 'POST', state);

export const getMessageInfo = (userId: string, userRole: USER_ROLE | undefined): Promise<MessageInfoResponse> =>
    request<MessageInfoResponse>(`/notification/mobile/message?userIds=${userId}&userRole=${userRole}`, {method: 'GET'});

export const sendNotification = (data: SendNotificationRequest): Promise<any> =>
    jsonRequest<any>('/user/notification', 'POST', data);

export const sendNotificationOffer = (data: SendNotificationRequest): Promise<any> =>
    jsonRequest<any>('/user/notification/offer', 'POST', data);

export const getFeatures = (): Promise<FeatureResponse[]> =>
    request<FeatureResponse[]>('/features', {method: 'GET'});

export const getFilterForPublicOffers = (): Promise<FilterPublicOfferPromotionResponse> =>
    request<FilterPublicOfferPromotionResponse>('/filter/promotion/public', {method: 'GET'});

export const getFilterForPublicOffersManager = (): Promise<FilterPublicOfferManagerResponse> =>
    request<FilterPublicOfferManagerResponse>('/filter/manager/public', {method: 'GET'});

export const getFilterForExclusiveOffers = (): Promise<FilterPublicOfferPromotionResponse> =>
    request<FilterPublicOfferPromotionResponse>('/filter/promotion/exclusive', {method: 'GET'});

export const getAllRequiredDocumentByPromotion = (): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>('/document', {method: 'GET'});

export const saveRequiredDocumentByPromotion = (doc: CreateDocumentOfferRequest): Promise<any> =>
    jsonRequest<any>('/document', 'POST', doc);

export const deleteRequiredDocumentByPromotion = (docId: string): Promise<void> =>
    request<void>(`/document/${docId}`, {method: 'DELETE'});

export const sendFirstOfferAfterSelectedFighter = (doc: PublicOfferToSelectedFighterRequest): Promise<any> =>
    jsonRequest<any>('/offer/public/send', 'POST', doc);

export const confirmPublicOffer = (data: ResponsorOfferRequest): Promise<void> =>
    request<void>(`/negotiation/public/confirm/${data.offerId}/${data.fighterId}`, {method: 'POST'});

export const confirmExclusiveOffer = (data: ResponsorOfferRequest): Promise<void> =>
    request<void>(`/negotiation/exclusive/confirm/${data.offerId}/${data.fighterId}`, {method: 'POST'});

export const rejectPublicOffer = (data: ResponsorOfferRequest): Promise<void> =>
    jsonRequest<void>(`/negotiation/public/reject/${data.offerId}/${data.fighterId}`, 'POST', {rejectionReason: data.rejectionReason});

export const negotiationPublicOffer = (data: ResponsorOfferRequest): Promise<any> =>
    jsonRequest<any>(`/negotiation/public/negotiate/${data.offerId}/${data.fighterId}`, 'POST', data.negotiateRequest);

export const negotiationExclusiveOffer = (data: ResponsorOfferRequest): Promise<any> =>
    jsonRequest<any>(`/negotiation/exclusive/negotiate/${data.offerId}/${data.fighterId}`, 'POST', data.negotiateRequest);

export const getAllRequiredDocumentsForPublicOffer = (offerId: string): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>(`/document/public/${offerId}`, {method: 'GET'}); // CHECKED

export const getAllRequiredDocumentsForExclusiveOffer = (offerId: string): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>(`/document/exclusive/${offerId}`, {method: 'GET'}); // CHECKED

export const getAllRequiredDocumentsForMultiFightOffer = (offerId: string): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>(`/document/multi/${offerId}`, {method: 'GET'}); // CHECKED

export const addDocumentPublicOffer = (data: FormData): Promise<void> =>
    request<void>('/document/public', {method: 'POST', body: data});

export const addDocumentExclusiveOffer = (data: FormData): Promise<void> =>
    request<void>('/document/exclusive', {method: 'POST', body: data});

export const addDocumentMultiFightOffer = (data: FormData): Promise<void> =>
    request<void>('/document/multi', {method: 'POST', body: data});

export const renewDocumentPublicOfferDueDate = (offerId: string, dueDate: string): Promise<void> =>
    jsonRequest<void>(`/offer/public/${offerId}/document`, 'PUT', {dueDate});

export const renewDocumentExclusiveOfferDueDate = (offerId: string, dueDate: string): Promise<void> =>
    jsonRequest<void>(`/offer/exclusive/${offerId}/document`, 'PUT', {dueDate});

export const renewDocumentMultiFightOfferDueDate = (offerId: string, dueDate: string): Promise<void> =>
    jsonRequest<void>(`/offer/multi/${offerId}/document`, 'PUT', {dueDate});

export const paySuccessFee = (data: PaySuccessFeeRequest): Promise<any> =>
    jsonRequest<any>(`/payment/success-fee-payment`, 'POST', data);
