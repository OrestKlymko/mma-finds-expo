import {
  addDocumentPublicOffer, addDocumentExclusiveOffer, addDocumentMultiFightOffer,
  getAllRequiredDocumentsForExclusiveOffer, getAllRequiredDocumentsForMultiFightOffer,
  getAllRequiredDocumentsForPublicOffer,
} from '@/service/service';


export type OfferKind = 'public' | 'exclusive' | 'multi';

export const docCfg = {
  public: {
    loadDocs : getAllRequiredDocumentsForPublicOffer,
    upload   : addDocumentPublicOffer,
    dueField : (offer: any) => offer?.dueDateForDocument,
  },
  exclusive: {
    loadDocs : getAllRequiredDocumentsForExclusiveOffer,
    upload   : addDocumentExclusiveOffer,
    dueField : (offer: any) => offer?.dueDateForDocument,
  },
  multi: {
    loadDocs : getAllRequiredDocumentsForMultiFightOffer,
    upload   : addDocumentMultiFightOffer,
    dueField : (offer: any) => offer?.dueDateDocument,
  },
} as const;
