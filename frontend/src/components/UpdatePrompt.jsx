import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

const UpdatePrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line no-console
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      // eslint-disable-next-line no-console
      console.log('SW registration error', error)
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100, maxWidth: '400px', width: '100%' }}>
      <div className="card shadow-lg border-0 bg-white animate-slide-in">
        <div className="card-body p-3 d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
              <RefreshCw size={20} className={needRefresh ? "animate-spin" : ""} />
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-dark">
                {offlineReady ? "Siap digunakan offline" : "Versi baru tersedia"}
              </h6>
              <div className="small text-muted">
                {offlineReady 
                  ? "Aplikasi telah disimpan untuk penggunaan offline." 
                  : "Muat ulang untuk memperbarui aplikasi."}
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            {needRefresh && (
              <button 
                className="btn btn-primary btn-sm fw-bold shadow-sm"
                onClick={() => updateServiceWorker(true)}
              >
                Update
              </button>
            )}
            <button 
              className="btn btn-link text-muted p-1"
              onClick={close}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .animate-spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UpdatePrompt;
