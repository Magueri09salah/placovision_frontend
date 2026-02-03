// src/components/OfflineIndicator.jsx
import { usePWA } from '../hooks/usePWA';

const WifiIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>
);

const SignalSlashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 15.75l1.5 1.5 1.5-1.5M6.75 12a9.013 9.013 0 015.063-2.673M3 8.25a15.037 15.037 0 015.25-2.578M21 8.25a15.019 15.019 0 00-5.25-2.578M14.713 13.673A5.25 5.25 0 0017.25 12" />
  </svg>
);

export const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <SignalSlashIcon className="w-5 h-5" />
        <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;