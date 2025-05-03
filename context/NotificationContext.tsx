import React, {createContext, useContext, useEffect, useState} from 'react';
import {collection, getFirestore, onSnapshot, query, where} from 'firebase/firestore';

import {useAuth} from "@/context/AuthContext";
import {firestore} from "../firebase/firebase";

interface NotificationContextType {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { entityId } = useAuth();

    useEffect(() => {
        if (!entityId) return;

        const q = query(collection(firestore, 'conversations'), where('participants', 'array-contains', entityId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let total = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const count = data.unreadCounts?.[entityId] || 0;
                total += count;
            });
            setUnreadCount(total);
        });

        return () => unsubscribe();
    }, [entityId]);

    return (
        <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};
