// src/pages/QuotationDetailPage.jsx

import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { quotationAPI } from '../../services/quotationApi';

// Icons
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const PrinterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
  </svg>
);

const DocumentDuplicateIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const PencilIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PaperAirplaneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const ArrowDownTrayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Room type icons
const ROOM_ICONS = {
  salon_sejour: '🛋️',
  chambre: '🛏️',
  cuisine: '🍳',
  salle_de_bain: '🚿',
  wc: '🚽',
  bureau: '💼',
  garage: '🚗',
  exterieur: '🌳',
  autre: '📦',
};

// Work type icons
const WORK_ICONS = {
  habillage_mur: '🧱',
  plafond_ba13: '⬆️',
  cloison: '🚪',
  gaine_creuse: '📏',
};

// Status config
const STATUS_CONFIG = {
  draft: { label: 'Brouillon', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  sent: { label: 'Envoyé', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  accepted: { label: 'Accepté', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  rejected: { label: 'Refusé', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  expired: { label: 'Expiré', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
};

const QuotationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch quotation
  const fetchQuotation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await quotationAPI.getOne(id);
      if (response.data?.success !== false) {
        setQuotation(response.data.data);
      } else {
        setError(response.data?.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.status === 404) {
        setError('Devis introuvable');
      } else {
        setError('Impossible de charger le devis');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  // Actions
//   const handleDuplicate = async () => {
//     setActionLoading(true);
//     try {
//       const response = await quotationAPI.duplicate(id);
//       if (response.data?.data?.id) {
//         navigate(`/quotations/${response.data.data.id}`);
//       }
//     } catch (err) {
//       alert('Erreur lors de la duplication');
//     } finally {
//       setActionLoading(false);
//     }
//   };

  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      await quotationAPI.updateStatus(id, newStatus);
      fetchQuotation();
    } catch (err) {
      alert('Erreur lors du changement de statut');
    } finally {
      setActionLoading(false);
    }
  };

//   const handlePrint = () => {
//     window.print();
//   };

  const handleDownloadPdf = async () => {
    setActionLoading(true);
    try {
      const response = await quotationAPI.downloadPdf(id);
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${quotation.reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement PDF:', err);
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenPdf = () => {
    // Open PDF in new tab
    const token = localStorage.getItem('token');
    const pdfUrl = quotationAPI.getPdfUrl(id);
    window.open(pdfUrl, '_blank');
  };

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement du devis...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <Link to="/quotations" className="text-red-700 font-medium hover:underline">
            ← Retour à la liste
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!quotation) return null;

  const statusConfig = STATUS_CONFIG[quotation.status] || STATUS_CONFIG.draft;

  return (
    <DashboardLayout>
      <div className="space-y-6 print:space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 print:hidden">
          <div>
            <Link to="/quotations"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Retour aux devis
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{quotation.reference}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                {statusConfig.label}
              </span>
              <span className="text-gray-500">Créé le {formatDate(quotation.created_at)}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {quotation.status === 'draft' && (
              <>
                {/* <button
                  onClick={() => handleStatusChange('sent')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Envoyer
                </button> */}
                <Link
                  to={`/quotations/${id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  Modifier
                </Link>
              </>
            )}
            
            {quotation.status === 'sent' && (
              <>
                <button
                  onClick={() => handleStatusChange('accepted')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Accepté
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <XCircleIcon className="w-4 h-4" />
                  Refusé
                </button>
              </>
            )}
            
            {/* <button
              onClick={handleDuplicate}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
              Dupliquer
            </button> */}
            
            <button
              onClick={handleDownloadPdf}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              title="Télécharger PDF"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              PDF
            </button>
            
            {/* <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <PrinterIcon className="w-4 h-4" />
              Imprimer
            </button> */}
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-xl shadow p-6 print:shadow-none print:border print:border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">{quotation.client_name}</p>
                </div>
                {quotation.client_email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{quotation.client_email}</p>
                  </div>
                )}
                {quotation.client_phone && (
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-900">{quotation.client_phone}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Adresse du chantier</p>
                  <p className="font-medium text-gray-900">
                    {quotation.site_address}, {quotation.site_city}
                    {quotation.site_postal_code && ` ${quotation.site_postal_code}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Rooms & Materials */}
            {quotation.rooms?.map((room, roomIndex) => (
              <div key={roomIndex} className="bg-white rounded-xl shadow p-6 print:shadow-none print:border print:border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">{ROOM_ICONS[room.room_type] || '📦'}</span>
                  {room.display_name || room.room_name}
                  <span className="text-sm font-normal text-gray-500 ml-auto">
                    Sous-total: {formatAmount(room.subtotal_ht)} DH HT
                  </span>
                </h2>

                {room.works?.map((work, workIndex) => (
                  <div key={workIndex} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                      <span className="text-xl">{WORK_ICONS[work.work_type] || '🔧'}</span>
                      <h3 className="font-medium text-gray-700">
                        {work.work_type_label} - {work.surface} {work.unit_label}
                      </h3>
                      <span className="text-sm text-gray-500 ml-auto">
                        {formatAmount(work.subtotal_ht)} DH
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-2 px-3 font-medium text-gray-600">Matériau</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">Qté</th>
                            <th className="text-center py-2 px-3 font-medium text-gray-600">Unité</th>
                            <th className="text-right py-2 px-3 font-medium text-gray-600">P.U.</th>
                            <th className="text-right py-2 px-3 font-medium text-gray-600">Total HT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {work.items?.map((item, itemIndex) => (
                            <tr key={itemIndex} className={`border-b border-gray-100 ${item.is_modified ? 'bg-yellow-50' : ''}`}>
                              <td className="py-2 px-3 text-gray-900">
                                {item.designation}
                                {item.is_modified && (
                                  <span className="ml-2 text-xs text-yellow-600">(modifié)</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center text-gray-600">{item.quantity_adjusted}</td>
                              <td className="py-2 px-3 text-center text-gray-600">{item.unit}</td>
                              <td className="py-2 px-3 text-right text-gray-600">{formatAmount(item.unit_price)} DH</td>
                              <td className="py-2 px-3 text-right font-medium text-gray-900">{formatAmount(item.total_ht)} DH</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Sidebar - Totals */}
          <div className="space-y-6">
            {/* Totals Card */}
            <div className="bg-white rounded-xl shadow p-6 print:shadow-none print:border print:border-gray-200 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total HT</span>
                  <span className="font-medium text-gray-900">{formatAmount(quotation.total_ht)} DH</span>
                </div>
                
                {quotation.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise ({quotation.discount_percent}%)</span>
                    <span>-{formatAmount(quotation.discount_amount)} DH</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA ({quotation.tva_rate}%)</span>
                  <span className="font-medium text-gray-900">{formatAmount(quotation.total_tva)} DH</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total TTC</span>
                    <span className="text-xl font-bold text-red-700">{formatAmount(quotation.total_ttc)} DH</span>
                  </div>
                </div>
              </div>

              {/* Validity */}
              {quotation.validity_date && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Devis valable jusqu'au <span className="font-medium text-gray-900">{formatDate(quotation.validity_date)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {quotation.notes && (
              <div className="bg-white rounded-xl shadow p-6 print:shadow-none print:border print:border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Notes</h2>
                <p className="text-gray-600 whitespace-pre-line">{quotation.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuotationDetailPage;