import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';


import {ExclusiveOfferInfo, MultiContractFullInfo, PublicOfferInfo} from '@/service/response';
import {docCfg, OfferKind} from "@/models/documentTailoringConfig";
import {RequiredDocumentsSection} from "@/components/RequiredDocumentsSection";

type Props = {
    kind: OfferKind;
    offer: PublicOfferInfo|ExclusiveOfferInfo|MultiContractFullInfo | null | undefined;
};

export const DocumentTailoring: React.FC<Props> = ({kind, offer}) => {
    const cfg = docCfg[kind];
    const [docs, setDocs] = useState<any[]>([]);

    useEffect(() => {
        if (!offer) return;
        cfg.loadDocs(offer.offerId).then((arr: any[]) =>
            setDocs(
                arr.map(d => ({
                    ...d,
                    originalValue: d.response || '',
                    response: d.response || '',
                    isLoading: false,
                    hasSuccess: false,
                })),
            ),
        );
    }, [offer, cfg]);

    const handleTextChange = useCallback((i: number, text: string) => {
        setDocs(p => p.map((d, idx) => (idx === i ? {...d, response: text} : d)));
    }, []);

    const handleFileUpload = async (i: number) => {
        try {
            setDocs(p => p.map((d, idx) => (idx === i ? {...d, isLoading: true} : d)));

            const res = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (res.type !== 'success') {
                setDocs(p => p.map((d, idx) => (idx === i ? {...d, isLoading: false} : d)));
                return;
            }

            const fd = new FormData();
            fd.append('offerId', offer?.offerId);
            fd.append('documentId', docs[i].documentId);
            fd.append('file', {
                uri: res.uri,
                name: res.name || 'document',
                type: res.mimeType || 'application/octet-stream',
            } as any); // 👈 для FormData в Expo потрібен каст

            await cfg.upload(fd);

            setDocs(p =>
                p.map((d, idx) =>
                    idx === i
                        ? {...d, response: 'Uploaded', isLoading: false, hasSuccess: true}
                        : d,
                ),
            );
        } catch (e) {
            Alert.alert('Error', 'Upload failed');
            setDocs(p => p.map((d, idx) => (idx === i ? {...d, isLoading: false} : d)));
        }
    };


    const confirmTextUpload = async (i: number) => {
        try {
            setDocs(p => p.map((d, idx) => (idx === i ? {...d, isLoading: true} : d)));
            const d = docs[i];
            const fd = new FormData();
            fd.append('offerId', offer?.offerId);
            fd.append('documentId', d.documentId);
            fd.append('response', d.response);
            await cfg.upload(fd);
            setDocs(p =>
                p.map((doc, idx) =>
                    idx === i
                        ? {...doc, originalValue: doc.response, isLoading: false, hasSuccess: true}
                        : doc,
                ),
            );
        } catch (e) {
            Alert.alert('Error', 'Upload failed');
            setDocs(p => p.map((d, idx) => (idx === i ? {...d, isLoading: false} : d)));
        }
    };

    const memoDocs = useMemo(
        () =>
            docs.map((d, i) => ({
                documentName: d.documentName,
                documentType: d.documentType,
                response:     d.response,
                originalValue:d.originalValue,
                onUploadPress: () => handleFileUpload(i),
                onChangeText : (t: string) => handleTextChange(i, t),
                onConfirm    : () => confirmTextUpload(i),
            })),
        [docs, handleTextChange],
    );

    if (!offer) return null;

    return (
        <RequiredDocumentsSection
            documents={memoDocs}
            dueDate={cfg.dueField(offer)}
        />
    );
};
