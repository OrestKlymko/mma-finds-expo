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
    CreatePaymentIntentStripeRequest,
    CreateTaskRequest,
    DefaultMethodRequest,
    InvitationMemberRequest,
    LoginRequest,
    OfferSubmissionResponse,
    PayCreditRequest,
    PayForCreditRequestStripe, PaySuccessFeeRequest,
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
    ShortLinkRequest,
    ShortLinkResponse,
    SportTypeResponse,
    StripePaymentResponse,
    SubAccountResponse,
    TicketResponse,
    USER_ROLE,
    UserInfoResponse,
    VerificationStatusResponse,
    WeightClassResponse,
} from './response';

// export const API_BASE_URL = 'https://api.mmafinds.com/api';
// export const API_BASE_URL = 'http://localhost:8080/api';
export const API_BASE_URL = 'https://api.dev.mmafinds.com/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await AsyncStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers as Record<string, string>),
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    // 204 No Content
    if (response.status === 204) return undefined as any;
    // Some endpoints send empty body with 200: guard against parse error
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return undefined as any;

    return (await response.json()) as T;
}

// Helper to make JSON requests easier
const jsonRequest = <T>(path: string, method: string, body?: any) =>
    request<T>(path, {
        method,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        headers: {'Content-Type': 'application/json'},
    });


export const login = (body: LoginRequest): Promise<LoginResponse> =>
    jsonRequest<LoginResponse>('/auth/login', 'POST', body);

export const createPromotion = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/promotion', {method: 'POST', body: data});

export const createPromotionSecond = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/promotion/secondary', {method: 'POST', body: data});

export const changeProfile = (data: ChangeProfileRequest): Promise<LoginResponse> =>
    jsonRequest<LoginResponse>('/auth/change-profile', 'PUT', data);

export const createManager = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/manager', {method: 'POST', body: data});

export const createManagerSecond = (data: FormData): Promise<LoginResponse> =>
    request<LoginResponse>('/manager/secondary', {method: 'POST', body: data});

export const requestOnForgotPassword = (email: string): Promise<void> =>
    jsonRequest<void>('/auth/recovery-password', 'POST', {email});

export const verifyAndChangePassword = (data: RecoveryPasswordRequest): Promise<void> =>
    jsonRequest<void>('/auth/recovery-password/verify', 'POST', data);

export const createFighter = (data: FormData): Promise<any> =>
    request<any>('/fighter', {method: 'POST', body: data});

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

export const getOfferFullInfo = (offerId: string): Promise<EditPublicOfferResponse> =>
    request<EditPublicOfferResponse>(`/public-offers/full-info/${offerId}`, {method: 'GET'});

export const getWeightClasses = (): Promise<WeightClassResponse[]> =>
    request<WeightClassResponse[]>('/fighter/weight-classes', {method: 'GET'});

export const getNationalities = (): Promise<NationalityResponse[]> =>
    request<NationalityResponse[]>('/fighter/nationalities', {method: 'GET'});

export const getFoundationStyles = (): Promise<FoundationStyleResponse[]> =>
    request<FoundationStyleResponse[]>('/fighter/foundation-styles', {method: 'GET'});

export const getFoundationStylesFilter = (): Promise<FoundationStyleResponse[]> =>
    request<FoundationStyleResponse[]>('/fighter/foundation-styles/filter', {method: 'GET'});

export const getFoundationStylesFilterOfferById = (offerId: string): Promise<FoundationStyleResponse[]> =>
    request<FoundationStyleResponse[]>(`/fighter/foundation-styles/offer/${offerId}`, {method: 'GET'});

export const getShortInfoManager = (): Promise<UserInfoResponse> =>
    request<UserInfoResponse>('/manager/short-info', {method: 'GET'});

export const getShortInfoPromotion = (): Promise<UserInfoResponse> =>
    request<UserInfoResponse>('/promotion/short-info', {method: 'GET'});

export const getShortInfoPromotionEmployee = (): Promise<UserInfoResponse> =>
    request<UserInfoResponse>('/promotion-employee/short-info', {method: 'GET'});

export const getShortInfoPromotionForCard = (): Promise<PromotionResponse[]> =>
    request<PromotionResponse[]>('/promotion/short-info/card', {method: 'GET'});

export const getInformationPromotion = (): Promise<PromotionInformationResponse> =>
    request<PromotionInformationResponse>('/promotion', {method: 'GET'});

export const getInformationPromotionById = (promotionId: string): Promise<PromotionInformationResponse> =>
    request<PromotionInformationResponse>(`/promotion/${promotionId}`, {method: 'GET'});

export const confirmFighterParticipationMultiFight = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/multi-fight-offers/submit-fighter/${offerId}/${fighterId}`, {method: 'POST'});

export const confirmFighterParticipationExclusive = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/exclusive/submit-fighter/${offerId}/${fighterId}`, {method: 'POST'});

export const getFighterByManager = (): Promise<ShortInfoFighter[]> =>
    request<ShortInfoFighter[]>('/fighter', {method: 'GET'});

export const getFighterByManagerId = (managerId: string): Promise<ShortInfoFighter[]> =>
    request<ShortInfoFighter[]>(`/fighter/manager/${managerId}`, {method: 'GET'});

export const generateLinkForShareOffer = (data: ShortLinkRequest): Promise<ShortLinkResponse> =>
    jsonRequest<ShortLinkResponse>('/short-link/generate', 'POST', data);

export const getShortLink = (code: string): Promise<string> =>
    request<string>(`/short-link/get/${code}`, {method: 'GET'});

export const createPaymentIntentForCharge = (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> =>
    jsonRequest<CreatePaymentIntentResponse>('/payment/create-payment-intent', 'POST', data);

export const createPaymentIntentForStripe = (data: CreatePaymentIntentStripeRequest): Promise<CreatePaymentIntentResponse> =>
    jsonRequest<CreatePaymentIntentResponse>('/stripe/payment-intent', 'POST', data);

export const chargeDefault = (pay: PayForCreditRequestStripe): Promise<StripePaymentResponse> =>
    jsonRequest<StripePaymentResponse>('/stripe/charge-default', 'POST', pay);

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

export const getAccountInfo = (): Promise<ManagerInformationResponse> =>
    request<ManagerInformationResponse>('/manager', {method: 'GET'});

export const getManagerInfoById = (id: string): Promise<ManagerInformationResponse> =>
    request<ManagerInformationResponse>(`/manager/${id}`, {method: 'GET'});

export const updateAccountInfo = (data: FormData): Promise<void> =>
    request<void>('/manager', {method: 'PUT', body: data});

export const updateAccountInfoPromotion = (data: FormData): Promise<void> =>
    request<void>('/promotion', {method: 'PUT', body: data});

export const deleteAccount = (): Promise<void> =>
    request<void>('/auth', {method: 'DELETE'});

export const deactivateAccount = (): Promise<void> =>
    request<void>('/auth/deactivate', {method: 'PUT'});

export const getCredit = (): Promise<CreditRemainingResponse> =>
    request<CreditRemainingResponse>('/credit', {method: 'GET'});

export const payForCredit = (data: PayCreditRequest): Promise<void> =>
    jsonRequest<void>('/credit', 'POST', data);

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

export const getEvents = (): Promise<EventDetailsResponse[]> =>
    request<EventDetailsResponse[]>('/event', {method: 'GET'});

export const getEventById = (eventId: string): Promise<EventDetailsResponse> =>
    request<EventDetailsResponse>(`/event/${eventId}`, {method: 'GET'});

export const createPublicOffer = (data: UpdateOfferRequest): Promise<void> =>
    jsonRequest<void>('/public-offers', 'POST', data);

export const getPublicOffers = (): Promise<PublicOfferInfo[]> =>
    request<PublicOfferInfo[]>('/public-offers', {method: 'GET'});

export const getPublicOffersByPromotion = (promotionId: string): Promise<PublicOfferInfo[]> =>
    request<PublicOfferInfo[]>(`/public-offers/promotion/${promotionId}`, {method: 'GET'});

export const getAllPublicOffers = (): Promise<PublicOfferInfo[]> =>
    request<PublicOfferInfo[]>('/public-offers/all', {method: 'GET'});

export const getExclusiveOffers = (): Promise<any> =>
    request<any>('/exclusive-offers', {method: 'GET'});

export const getPublicOfferInfoById = (offerId: string): Promise<FullInfoAboutPublicOffer> =>
    request<FullInfoAboutPublicOffer>(`/public-offers/${offerId}`, {method: 'GET'});

export const getPublicOfferInfoByIdForManagerByFighter = (offerId: string, fighterId: string): Promise<FullInfoAboutPublicOffer> =>
    request<FullInfoAboutPublicOffer>(`/public-offers/${offerId}/${fighterId}`, {method: 'GET'});

export const getPublicInfoForManager = (offerId: string): Promise<FullInfoAboutPublicOffer> =>
    request<FullInfoAboutPublicOffer>(`/public-offers/submitted-fighters/manager/${offerId}`, {method: 'GET'});

export const submitOfferByFighterWithoutFeaturing = (offerId: string, fighterId: string): Promise<void> =>
    jsonRequest<void>(`/public-offers/submit-fighter/${offerId}/${fighterId}`, 'POST', {});

export const getExclusiveOfferInfoById = (offerId: string): Promise<FullInfoAboutExclusiveOffer> =>
    request<FullInfoAboutExclusiveOffer>(`/exclusive-offers/${offerId}`, {method: 'GET'});

export const chooseFighterForExclusiveOffer = (fighterId: string, offerId: string): Promise<void> =>
    request<void>(`/exclusive-offers/choose-fighter/${fighterId}/${offerId}`, {method: 'POST'});

export const declineExclusiveOffer = (offerId: string, data: ResponseExclusiveOfferRequest): Promise<void> =>
    jsonRequest<void>(`/document/exclusive-offer/reject/${offerId}/${data.fighterId}`, 'POST', {rejectedReason: data.response});

export const declineMultiFightOffer = (offerId: string, data: ResponseExclusiveOfferRequest): Promise<void> =>
    jsonRequest<void>(`/document/multi-fight-contract/reject/${offerId}/${data.fighterId}`, 'POST', {rejectedReason: data.response});

export const acceptMultiFightOffer = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/document/multi-fight-contract/confirm/${offerId}/${fighterId}`, {method: 'POST'});

export const negotiationDocumentForMultiFightOffer = (data: CreateMultiOfferTailoringRequest): Promise<void> =>
    jsonRequest<void>(`/document/multi-fight-contract/negotiation/${data.offerId}/${data.fighterId}`, 'POST', data.purses);

export const getFullInfoAboutFighter = (fighterId: string): Promise<FighterInfoResponse> =>
    request<FighterInfoResponse>(`/fighter/${fighterId}`, {method: 'GET'});

export const switchFighterLookingStatus = (fighterId: string): Promise<void> =>
    jsonRequest<void>(`/fighter/looking-opponent/${fighterId}`, 'PUT', {});

export const getAllManagers = (): Promise<ManagerInfo[]> =>
    request<ManagerInfo[]>('/manager/all', {method: 'GET'});

export const getShortInfoFighters = (): Promise<ShortInfoFighter[]> =>
    request<ShortInfoFighter[]>('/fighter/short-info', {method: 'GET'});

export const getShortInfoFightersByManager = (): Promise<ShortInfoFighter[]> =>
    request<ShortInfoFighter[]>('/fighter/short-info/manager', {method: 'GET'});

export const createExclusiveOffer = (data: CreateExclusiveOfferRequest): Promise<void> =>
    jsonRequest<void>('/exclusive-offers', 'POST', data);

export const createMultiFightOffer = (data: CreateMultiOfferRequest): Promise<void> =>
    jsonRequest<void>('/multi-fight-offers', 'POST', data);

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
    request<MultiContractShortInfo[]>('/multi-fight-offers', {method: 'GET'});

export const renewDueDate = (offerId: string, newDueDate: string): Promise<void> =>
    jsonRequest<void>(`/public-offers/due-date/${offerId}`, 'PUT', {dueDate: newDueDate});

export const renewExclusiveOfferDueDate = (offerId: string, newDueDate: string): Promise<void> =>
    jsonRequest<void>(`/exclusive-offers/renew/${offerId}`, 'PUT', {dueDate: newDueDate});

export const renewDueDateMultifight = (offerId: string, newDueDate: string): Promise<void> =>
    jsonRequest<void>(`/multi-fight-offers/due-date/${offerId}`, 'PUT', {dueDate: newDueDate});

export const closeOffer = (offerId: string, reason: string): Promise<void> =>
    jsonRequest<void>(`/public-offers/close/${offerId}`, 'POST', {reason});

export const closeMultiFightOffer = (offerId: string, reason: string): Promise<void> =>
    jsonRequest<void>(`/multi-fight-offers/close/${offerId}`, 'POST', {reason});

export const closeExclusiveOffer = (offerId: string, reason: string): Promise<void> =>
    jsonRequest<void>(`/exclusive-offers/close/${offerId}`, 'POST', {reason});

export const getBenefitsInPublicOffer = (offerId: string): Promise<Benefit> =>
    request<Benefit>(`/public-offers/benefits/${offerId}`, {method: 'GET'});

export const featureYourOffer = (offerId: string): Promise<void> =>
    request<void>(`/public-offers/feature/${offerId}`, {method: 'POST'});

export const getSubmissionsOfferByFighter = (fighterId: string): Promise<OfferSubmissionResponse[]> =>
    request<OfferSubmissionResponse[]>(`/public-offers/submission-offer/${fighterId}`, {method: 'GET'});

export const getSubmissionManager = (): Promise<OfferSubmissionResponse[]> =>
    request<OfferSubmissionResponse[]>('/public-offers/submission-offer', {method: 'GET'});

export const declineOffer = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/public-offers/decline/${offerId}/${fighterId}`, {method: 'DELETE'});

export const getMultiFightOfferById = (offerId: string): Promise<MultiContractResponse> =>
    request<MultiContractResponse>(`/multi-fight-offers/${offerId}`, {method: 'GET'});

export const getAllPromotionName = (): Promise<PromotionNameResponse[]> =>
    request<PromotionNameResponse[]>('/promotion/all-name', {method: 'GET'});

export const getUpdateFighter = (fighterId: string): Promise<FighterFullProfile> =>
    request<FighterFullProfile>(`/fighter/edit/${fighterId}`, {method: 'GET'});

export const updateFighter = (fighterId: string, data: FormData): Promise<any> =>
    request<any>(`/fighter/${fighterId}`, {method: 'PUT', body: data});

export const featureFighterOnOffer = (offerId: string, fighterId: string): Promise<void> =>
    request<void>(`/fighter/feature/${offerId}/${fighterId}`, {method: 'POST', body: JSON.stringify({})});

export const changeNotificationState = (state: ChangeNotificationStatusRequest): Promise<void> =>
    jsonRequest<void>('/auth/notification', 'POST', state);

export const getMessageInfo = (userId: string, userRole: USER_ROLE | undefined): Promise<MessageInfoResponse> =>
    request<MessageInfoResponse>(`/user/message-info?userIds=${userId}&userRole=${userRole}`, {method: 'GET'});

export const sendNotification = (data: SendNotificationRequest): Promise<any> =>
    jsonRequest<any>('/user/notification', 'POST', data);

export const sendNotificationOffer = (data: SendNotificationRequest): Promise<any> =>
    jsonRequest<any>('/user/notification/offer', 'POST', data);

export const getFeatures = (): Promise<FeatureResponse[]> =>
    request<FeatureResponse[]>('/features', {method: 'GET'});

export const getFilterForPublicOffers = (): Promise<FilterPublicOfferPromotionResponse> =>
    request<FilterPublicOfferPromotionResponse>('/filter/public-offers', {method: 'GET'});

export const getFilterForPublicOffersManager = (): Promise<FilterPublicOfferManagerResponse> =>
    request<FilterPublicOfferManagerResponse>('/filter/public-offers/manager', {method: 'GET'});

export const getFilterForExclusiveOffers = (): Promise<FilterPublicOfferPromotionResponse> =>
    request<FilterPublicOfferPromotionResponse>('/filter/exclusive-offers', {method: 'GET'});

export const getAllRequiredDocumentByPromotion = (): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>('/document', {method: 'GET'});

export const saveRequiredDocumentByPromotion = (doc: CreateDocumentOfferRequest): Promise<any> =>
    jsonRequest<any>('/document', 'POST', doc);

export const deleteRequiredDocumentByPromotion = (docId: string): Promise<void> =>
    request<void>(`/document/${docId}`, {method: 'DELETE'});

export const sendFirstOfferAfterSelectedFighter = (doc: PublicOfferToSelectedFighterRequest): Promise<any> =>
    jsonRequest<any>('/document/public-offer', 'POST', doc);

export const confirmPublicOffer = (data: ResponsorOfferRequest): Promise<void> =>
    request<void>(`/document/public-offer/confirm/${data.offerId}/${data.fighterId}`, {method: 'POST'});

export const confirmExclusiveOffer = (data: ResponsorOfferRequest): Promise<void> =>
    request<void>(`/document/exclusive-offer/confirm/${data.offerId}/${data.fighterId}`, {method: 'POST'});

export const rejectPublicOffer = (data: ResponsorOfferRequest): Promise<void> =>
    jsonRequest<void>(`/document/public-offer/reject/${data.offerId}/${data.fighterId}`, 'POST', {rejectedReason: data.rejectedReason});

export const cancelEvent = (data: CancelEventRequest): Promise<void> =>
    jsonRequest<void>('/event/close', 'POST', data);

export const negotiationPublicOffer = (data: ResponsorOfferRequest): Promise<any> =>
    jsonRequest<any>(`/document/public-offer/negotiation/${data.offerId}/${data.fighterId}`, 'POST', data.negotiateRequest);

export const negotiationExclusiveOffer = (data: ResponsorOfferRequest): Promise<any> =>
    jsonRequest<any>(`/document/exclusive-offer/negotiation/${data.offerId}/${data.fighterId}`, 'POST', data.negotiateRequest);

export const getAllRequiredDocumentsForPublicOffer = (offerId: string): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>(`/document/public-offer/${offerId}`, {method: 'GET'});

export const getAllRequiredDocumentsForExclusiveOffer = (offerId: string): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>(`/document/exclusive-offer/${offerId}`, {method: 'GET'});

export const getAllRequiredDocumentsForMultiFightOffer = (offerId: string): Promise<DocumentRequiredResponse[]> =>
    request<DocumentRequiredResponse[]>(`/document/multi-fight-contract/${offerId}`, {method: 'GET'});

export const addDocument = (data: FormData): Promise<void> =>
    request<void>('/document/required-document', {method: 'POST', body: data});

export const addDocumentExclusiveOffer = (data: FormData): Promise<void> =>
    request<void>('/document/exclusive-offer/required-document', {method: 'POST', body: data});

export const addDocumentMultiFightOffer = (data: FormData): Promise<void> =>
    request<void>('/document/multi-fight-contract/required-document', {method: 'POST', body: data});

export const renewDocumentPublicOfferDueDate = (offerId: string, dueDate: string): Promise<void> =>
    jsonRequest<void>(`/document/public-offer/due-date/${offerId}`, 'POST', {dueDate});

export const renewDocumentExclusiveOfferDueDate = (offerId: string, dueDate: string): Promise<void> =>
    jsonRequest<void>(`/document/exclusive-offer/due-date/${offerId}`, 'POST', {dueDate});

export const renewDocumentMultiFightOfferDueDate = (offerId: string, dueDate: string): Promise<void> =>
    jsonRequest<void>(`/document/multi-contract-offer/due-date/${offerId}`, 'POST', {dueDate});

export const paySuccessFee = (data: PaySuccessFeeRequest): Promise<any> =>
    jsonRequest<any>(`/payment/success-fee-payment`, 'POST', data);
