import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { initFacebookPixel, trackPageView } from '../../utils/facebookPixel';

/**
 * FacebookPixelTracker:
 * Listens to active store settings for facebookPixelId & pixelEnabled.
 * Dynamically initialises Meta Pixel and triggers trackPageView on every route transition.
 */
export default function FacebookPixelTracker() {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const pixelId = settings?.facebookPixelId;
    const isEnabled = settings?.pixelEnabled !== false; // Default true if ID provided

    if (pixelId && isEnabled) {
      initFacebookPixel(pixelId);
    }
  }, [settings?.facebookPixelId, settings?.pixelEnabled]);

  useEffect(() => {
    // Only track page views after initial load route transitions
    if (settings?.facebookPixelId && settings?.pixelEnabled !== false) {
      trackPageView();
    }
  }, [location.pathname, location.search, settings?.facebookPixelId, settings?.pixelEnabled]);

  return null;
}
