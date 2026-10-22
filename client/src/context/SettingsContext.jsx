import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';

const DEFAULT_SETTINGS = {
  storeName: 'Vision Eye Care',
  tagline: 'Drishti Atelier Bangladesh',
  hotlinePhone: '+880 9612-888999',
  whatsappNumber: '+880 1711-000000',
  supportEmail: 'care@drishti.com.bd',
  showroomAddress: 'House 45, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  businessHours: 'Sat - Thu: 10:00 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM',
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeShippingThreshold: 5000,
  currency: 'BDT',
  currencySymbol: '৳',
  socialLinks: {
    facebook: 'https://facebook.com/drishtieyecare',
    instagram: 'https://instagram.com/drishtieyecare',
    whatsapp: 'https://wa.me/8801711000000',
    youtube: 'https://youtube.com/@drishtieyecare',
    tiktok: 'https://tiktok.com/@drishtieyecare',
  },
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsContext;
