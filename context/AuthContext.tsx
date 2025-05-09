import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  use,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Тип для контексту
type AuthContextType = {
  token: string | null | undefined;
  methodAuth: string | null | undefined;
  role: 'MANAGER' | 'PROMOTION' |"PROMOTION_EMPLOYEE"| null | undefined;
  entityId: string | null | undefined;
  setToken: (token: string | null | undefined) => void;
  setMethodAuth: (methodAuth: string | null | undefined) => void;
  setRole: (role: 'MANAGER' | 'PROMOTION' |'PROMOTION_EMPLOYEE'| null | undefined) => void;
  setEntityId: (entityId: string | null | undefined) => void;
  clearAuthData: () => void;
  isLoading: boolean;
};

// Створення контексту
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контексту
export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [token, setTokenState] = useState<string | null | undefined>(null);
  const [methodAuth, setMethodAuthState] = useState<string | null | undefined>(
    null,
  );
  const [role, setRoleState] = useState<
    'MANAGER' | 'PROMOTION' |'PROMOTION_EMPLOYEE' | null | undefined
  >(null);
  const [entityId, setEntityIdState] = useState<string | null | undefined>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true); // додано

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedMethodAuth = await AsyncStorage.getItem('authMethodAuth');
        const storedRole = await AsyncStorage.getItem('authRole');
        const storedUserId = await AsyncStorage.getItem('authUserId');

        if (storedToken) setTokenState(storedToken);
        if (storedMethodAuth) setMethodAuthState(storedMethodAuth);
        if (storedRole) setRoleState(storedRole as 'MANAGER' | 'PROMOTION');
        if (storedUserId) setEntityIdState(storedUserId);
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setIsLoading(false); // завершено завантаження
      }
    };

    loadAuthData();
  }, []);

  // Окремий сеттер для токену
  const setToken = async (newToken: string | null | undefined) => {
    try {
      setTokenState(newToken);
      if (newToken) {
        await AsyncStorage.setItem('authToken', newToken);
      } else {
        await AsyncStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Failed to set token:', error);
    }
  };

  // Окремий сеттер для methodAuth
  const setMethodAuth = async (newMethodAuth: string | null | undefined) => {
    try {
      setMethodAuthState(newMethodAuth);
      if (newMethodAuth) {
        await AsyncStorage.setItem('authMethodAuth', newMethodAuth);
      } else {
        await AsyncStorage.removeItem('authMethodAuth');
      }
    } catch (error) {
      console.error('Failed to set methodAuth:', error);
    }
  };

  // Окремий сеттер для role
  const setRole = async (
    newRole: 'MANAGER' | 'PROMOTION' |'PROMOTION_EMPLOYEE'| null | undefined,
  ) => {
    try {
      setRoleState(newRole);
      if (newRole) {
        await AsyncStorage.setItem('authRole', newRole);
      } else {
        await AsyncStorage.removeItem('authRole');
      }
    } catch (error) {
      console.error('Failed to set role:', error);
    }
  };

  // Окремий сеттер для userId
  const setEntityId = async (newUserId: string | null | undefined) => {
    try {
      setEntityIdState(newUserId);
      if (newUserId) {
        await AsyncStorage.setItem('authUserId', newUserId);
      } else {
        await AsyncStorage.removeItem('authUserId');
      }
    } catch (error) {
      console.error('Failed to set userId:', error);
    }
  };

  // Очищення всіх даних
  const clearAuthData = async () => {
    try {
      setTokenState(null);
      setMethodAuthState(null);
      setRoleState(null);
      setEntityIdState(null);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authMethodAuth');
      await AsyncStorage.removeItem('authRole');
      await AsyncStorage.removeItem('authUserId');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        entityId,
        setEntityId,
        token,
        methodAuth,
        role,
        setToken,
        setMethodAuth,
        setRole,
        clearAuthData,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для використання AuthContext
export const useAuth = () => {
  //TODO: Check if use vs useContext is better, in the instructions, use is prefered.
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
