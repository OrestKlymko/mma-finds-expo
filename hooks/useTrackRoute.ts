
import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { pushPath } from '@/hooks/routeHistory';

export function useTrackRoute() {
    const path = usePathname();

    useEffect(() => {
        pushPath(path);
    }, [path]);
}
