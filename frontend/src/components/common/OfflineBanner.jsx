import React, { useState, useEffect } from 'react';
import { WifiOff, CloudOff } from 'lucide-react';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-warning bg-opacity-10 border-bottom border-warning border-opacity-25 px-3 py-2 text-center animate-slide-in">
      <div className="d-flex align-items-center justify-content-center gap-2 text-warning-emphasis small fw-bold">
        <WifiOff size={16} />
        <span>Mode Offline Aktif</span>
        <span className="fw-normal opacity-75 d-none d-sm-inline">| Anda hanya dapat melihat data yang sudah tersimpan.</span>
      </div>
    </div>
  );
};

export default OfflineBanner;
