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
    </div>
  );
};

export default QRCodePdf;