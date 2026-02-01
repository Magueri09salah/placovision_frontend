// src/components/QRCodePdf.jsx

import { useState, useEffect } from 'react';

/**
 * Composant QR Code pour accéder au PDF du devis
 * Utilise l'URL publique (public_pdf_url) retournée par l'API
 * Le PDF est accessible SANS authentification via un token unique
 */
const QRCodePdf = ({ publicPdfUrl, reference, size = 160 }) => {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!publicPdfUrl) {
      setError('URL non disponible');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Générer le QR code via l'API QR Server (gratuit)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(publicPdfUrl)}&format=png&margin=8`;

    const img = new Image();
    img.onload = () => {
      setQrDataUrl(qrApiUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError('Erreur de génération');
      setIsLoading(false);
    };
    img.src = qrApiUrl;

  }, [publicPdfUrl, size]);

  // Télécharger le QR code en PNG
  const handleDownload = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${reference || 'devis'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Copier l'URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicPdfUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  if (!publicPdfUrl) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">QR Code PDF</h3>
          <p className="text-xs text-gray-500">Scannez pour voir le devis</p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center py-3">
        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center bg-gray-50 rounded" style={{ width: size, height: size }}>
              <div className="animate-spin w-8 h-8 border-3 border-gray-300 border-t-red-600 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center bg-red-50 text-red-500 text-xs text-center p-4 rounded" style={{ width: size, height: size }}>
              {error}
            </div>
          ) : (
            <img src={qrDataUrl} alt={`QR Code ${reference}`} className="rounded" style={{ width: size, height: size }} />
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">📱 Scannez avec votre téléphone</p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={isLoading || error}
          className="flex-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          PNG
        </button>
        <button
          onClick={handleCopyUrl}
          className="flex-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-green-600">Copié!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              URL
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QRCodePdf;