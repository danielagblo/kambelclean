'use client';

import { useState, useEffect } from 'react';

interface FaviconSettings {
  current: string;
  custom: string | null;
}

export default function DynamicFavicon() {
  const [faviconSettings, setFaviconSettings] = useState<FaviconSettings | null>(null);

  useEffect(() => {
    loadFaviconSettings();
  }, []);

  const loadFaviconSettings = async () => {
    try {
      const response = await fetch('/api/favicon');
      if (response.ok) {
        const data = await response.json();
        setFaviconSettings(data.favicon);
        updateFavicon(data.favicon.current);
      }
    } catch (error) {
      console.error('Error loading favicon settings:', error);
    }
  };

  const updateFavicon = (faviconPath: string) => {
    // Update all favicon links
    const links = document.querySelectorAll('link[rel*="icon"]');
    links.forEach(link => {
      link.setAttribute('href', faviconPath);
    });

    // Also update the page title icon if it exists
    const titleIcon = document.querySelector('link[rel="shortcut icon"]');
    if (titleIcon) {
      titleIcon.setAttribute('href', faviconPath);
    }
  };

  return null; // This component doesn't render anything visible
}
