import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Platform } from 'react-native';

const ENTITLEMENT_ID = 'premium';

let PurchasesModule: any = null;
let LOG_LEVEL_DEBUG: any = null;

try {
  const mod = require('react-native-purchases');
  PurchasesModule = mod.default;
  LOG_LEVEL_DEBUG = mod.LOG_LEVEL?.DEBUG;
} catch (e) {
  console.log('RevenueCat: Native module not available');
}

interface PurchasesPackageType {
  identifier: string;
  packageType: string;
  product: any;
  offeringIdentifier: string;
}

interface CustomerInfoType {
  entitlements: {
    active: Record<string, any>;
  };
}

interface PurchasesContextValue {
  isReady: boolean;
  packages: PurchasesPackageType[];
  isPremium: boolean;
  purchasePackage: (pkg: PurchasesPackageType) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  customerInfo: CustomerInfoType | null;
}

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackageType[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoType | null>(null);

  const isPremium = useMemo(() => {
    if (!customerInfo) return false;
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  }, [customerInfo]);

  useEffect(() => {
    initPurchases();
  }, []);

  const initPurchases = async () => {
    try {
      if (!PurchasesModule) {
        console.log('RevenueCat: Module not loaded, running in demo mode');
        setIsReady(true);
        return;
      }

      const apiKey = Platform.select({
        ios: process.env.EXPO_PUBLIC_RC_IOS_KEY || '',
        android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY || '',
        default: process.env.EXPO_PUBLIC_RC_IOS_KEY || '',
      });

      if (!apiKey) {
        console.log('RevenueCat: No API key configured, running in demo mode');
        setIsReady(true);
        return;
      }

      if (LOG_LEVEL_DEBUG) {
        PurchasesModule.setLogLevel(LOG_LEVEL_DEBUG);
      }
      await PurchasesModule.configure({ apiKey });

      const info = await PurchasesModule.getCustomerInfo();
      setCustomerInfo(info);

      try {
        const offerings = await PurchasesModule.getOfferings();
        if (offerings.current?.availablePackages) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.log('RevenueCat: Could not fetch offerings', e);
      }

      PurchasesModule.addCustomerInfoUpdateListener((info: CustomerInfoType) => {
        setCustomerInfo(info);
      });

      setIsReady(true);
    } catch (e) {
      console.log('RevenueCat: Init error', e);
      setIsReady(true);
    }
  };

  const purchasePackage = useCallback(async (pkg: PurchasesPackageType): Promise<boolean> => {
    if (!PurchasesModule) return false;
    try {
      const { customerInfo: updatedInfo } = await PurchasesModule.purchasePackage(pkg);
      setCustomerInfo(updatedInfo);
      return updatedInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error('Purchase error:', e);
      }
      return false;
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!PurchasesModule) return false;
    try {
      const info = await PurchasesModule.restorePurchases();
      setCustomerInfo(info);
      return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch (e) {
      console.error('Restore error:', e);
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    isReady,
    packages,
    isPremium,
    purchasePackage,
    restorePurchases,
    customerInfo,
  }), [isReady, packages, isPremium, purchasePackage, restorePurchases, customerInfo]);

  return (
    <PurchasesContext.Provider value={value}>
      {children}
    </PurchasesContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchasesContext);
  if (!context) throw new Error('usePurchases must be used within PurchasesProvider');
  return context;
}
