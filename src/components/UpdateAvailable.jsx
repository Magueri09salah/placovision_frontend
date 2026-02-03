// src/components/UpdateAvailable.jsx
import { usePWA } from '../hooks/usePWA';

const ArrowPathIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const UpdateAvailable = () => {
  const { updateAvailable, updateApp } = usePWA();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-blue-600 text-white rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <ArrowPathIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Mise à jour disponible</p>
            <p className="text-sm text-blue-100">Une nouvelle version est prête.</p>
          </div>
          <button
            onClick={updateApp}
            className="flex-shrink-0 px-4 py-2 bg-white text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAvailable;