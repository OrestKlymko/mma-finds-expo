import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import { docCfg, OfferKind } from '@/models/documentTailoringConfig';
import { RequiredDocumentsSection, DocumentRow } from '@/components/RequiredDocumentsSection';
import {
    ExclusiveOfferInfo,
    MultiContractFullInfo,
    PublicOfferInfo,
} from '@/service/response';

type Props = {
    kind:  OfferKind;
    offer: PublicOfferInfo | ExclusiveOfferInfo | MultiContractFullInfo | null | undefined;
};

export const DocumentTailoring: React.FC<Props> = ({ kind, offer }) => {
    const cfg      = docCfg[kind];
    const [docs, setDocs] = useState<any[]>([]);

    /* ----------------------------------------------------------- */
    useEffect(() => {
        if (!offer) return;

        cfg.loadDocs(offer.offerId).then((arr: any[]) =>
            setDocs(
                arr.map((d) => ({
                    ...d,
                    originalValue: d.response || '',
                    response:      d.response || '',
                    isLoading:     false,
                    hasSuccess:    false,
                }))
            )
        );
    }, [offer, cfg]);

    /* ---------------- helpers ---------------------------------- */
    const updateRow = (idx: number, patch: Partial<any>) =>
        setDocs((prev) =>
            prev.map((row, i) => (i === idx ? { ...row, ...patch } : row))
        );

    const pickFileAndUpload = async (idx: number) => {
        try {
            updateRow(idx, { isLoading: true });

            const res = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });
            if (res.canceled) {
                updateRow(idx, { isLoading: false });
                return;
            }
            const fd = new FormData();
            fd.append('offerId',     String(offer!.offerId));
            fd.append('documentId',  String(docs[idx].documentId));
            fd.append('file', {
                uri:  res.assets[0].uri,
                name: res.assets[0].name ?? 'document',
                type: res.assets[0].mimeType ?? 'application/octet-stream',
            } as any);

            await cfg.upload(fd);

            updateRow(idx, {
                response:   'file://uploaded',  // or the URL you get back
                isLoading:  false,
                hasSuccess: true,
            });
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Upload failed');
            updateRow(idx, { isLoading: false });
        }
    };

    const confirmText = async (idx: number) => {
        try {
            updateRow(idx, { isLoading: true });

            const row = docs[idx];
            const fd  = new FormData();
            fd.append('offerId',    String(offer!.offerId));
            fd.append('documentId', String(row.documentId));
            fd.append('response',   row.response);

            await cfg.upload(fd);

            updateRow(idx, {
                originalValue: row.response,
                isLoading:     false,
                hasSuccess:    true,
            });
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Upload failed');
            updateRow(idx, { isLoading: false });
        }
    };

    /* ---------------- map to presentation rows ----------------- */
    const rows: DocumentRow[] = useMemo(
        () =>
            docs.map((d, idx) => ({
                documentId:   d.documentId,
                documentName: d.documentName,
                documentType: d.documentType,
                response:     d.response,
                originalValue:d.originalValue,
                isLoading:    d.isLoading,
                hasSuccess:   d.hasSuccess,
                onUpload:     () => pickFileAndUpload(idx),
                onChangeText: (t: string) => updateRow(idx, { response: t }),
                onConfirm:    () => confirmText(idx),
            })),
        [docs]
    );

    if (!offer) return null;

    return (
        <RequiredDocumentsSection
            rows={rows}
            dueDate={cfg.dueField(offer)}
        />
    );
};
