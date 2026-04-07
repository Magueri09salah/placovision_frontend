// src/pages/QuotationDetailPage.jsx

import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { quotationAPI } from '../../services/quotationApi';
import { sendToOdoo, acceptQuotation, rejectQuotation } from '../../services/odooApi';
import QRCodePdf from '../QRCodePdf';

// Icons
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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

const ArrowDownTrayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const InformationCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const OdooIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm4 0h-2v-6h2v6z"/>
  </svg>
);

const SpinnerIcon = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const BanknotesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
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

// Work type config
const WORK_TYPES = {
  habillage_mur: { icon: '🧱', label: 'Habillage BA13', description: 'Ouvrage vertical – 1 face' },
  cloison_simple: { icon: '🚪', label: 'Cloison simple ossature', description: 'M48 / M70 / M90' },
  cloison_double: { icon: '🚪', label: 'Cloison double ossature', description: 'Épaisseur ≥ 140mm' },
  gaine_technique: { icon: '📏', label: 'Gaine technique BA13', description: 'Ouvrage vertical technique' },
  plafond_ba13: { icon: '⬆️', label: 'Plafond BA13', description: 'Sur ossature métallique' },
  cloison: { icon: '🚪', label: 'Cloison', description: '' },
  gaine_creuse: { icon: '📏', label: 'Gaine creuse', description: '' },
};

// Status config
const STATUS_CONFIG = {
  draft: { label: 'Brouillon', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  sent: { label: 'Envoyé', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  accepted: { label: 'Accepté', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  rejected: { label: 'Refusé', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  expired: { label: 'Expiré', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
};

const ODOO_STATUS_CONFIG = {
  draft: { label: 'Devis', bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '📝' },
  sent: { label: 'En Attente', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', icon: '⏳' },
  sale: { label: 'Confirmé', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✅' },
  cancel: { label: 'Annulé', bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '❌' },
};

// ============ TOAST ============
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const Icon = type === 'success' ? CheckCircleIcon : type === 'error' ? XCircleIcon : InformationCircleIcon;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgColor} animate-slide-up`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <XCircleIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

// ============ REJECTION MODAL ============
const RejectionModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleClose} />
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Refuser le devis</h3>
          <p className="text-sm text-gray-600 mb-4">
            Êtes-vous sûr de vouloir refuser ce devis ? Cette action sera envoyée à Odoo.
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison du refus (optionnel)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Budget insuffisant, délai trop long..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <><SpinnerIcon className="w-4 h-4" /> Envoi...</>
              ) : (
                <><XCircleIcon className="w-4 h-4" /> Confirmer le refus</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
const QuotationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [actionLoading, setActionLoading] = useState(false);
  const [odooLoading, setOdooLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => setToast({ message, type });
  const hideToast = () => setToast(null);

  // Fetch quotation with polling
  const { 
    data: quotation, 
    isLoading: loading, 
    error,
    isFetching 
  } = useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => {
      const response = await quotationAPI.getOne(id);
      if (response.data?.success !== false) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Erreur lors du chargement');
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.odoo_status === 'sent') return 10000;
      return false;
    },
    refetchIntervalInBackground: false,
    retry: 1,
  });

  const refreshQuotation = () => {
    queryClient.invalidateQueries({ queryKey: ['quotation', id] });
  };

  // Actions
  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      await quotationAPI.updateStatus(id, newStatus);
      refreshQuotation();
    } catch (err) {
      showToast('Erreur lors du changement de statut', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setActionLoading(true);
    try {
      const response = await quotationAPI.downloadPdf(id);
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
      showToast('Erreur lors du téléchargement du PDF', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendToOdoo = async () => {
    if (!quotation.client_email) {
      showToast('L\'email du client est requis pour l\'envoi vers Odoo.', 'error');
      return;
    }
    setOdooLoading(true);
    try {
      const result = await sendToOdoo(quotation);
      showToast(`✓ Devis synchronisé avec Odoo : ${result.orderName}`, 'success');
      refreshQuotation();
    } catch (err) {
      showToast(err.message || 'Erreur lors de l\'envoi vers Odoo', 'error');
    } finally {
      setOdooLoading(false);
    }
  };

  const handleAcceptQuotation = async () => {
    setAcceptLoading(true);
    try {
      await acceptQuotation(id);
      showToast('✓ Devis accepté ! La facture va être créée.', 'success');
      refreshQuotation();
    } catch (err) {
      showToast(err.message || 'Erreur lors de l\'acceptation du devis', 'error');
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleRejectQuotation = async (reason) => {
    setRejectLoading(true);
    try {
      await rejectQuotation(id, reason);
      showToast('Devis refusé.', 'info');
      setShowRejectModal(false);
      refreshQuotation();
    } catch (err) {
      showToast(err.message || 'Erreur lors du refus du devis', 'error');
    } finally {
      setRejectLoading(false);
    }
  };

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0);
  };

  const getWorkTypeInfo = (workType) => WORK_TYPES[workType] || { icon: '🔧', label: workType, description: '' };

  const formatDimensions = (work) => {
    if (work.longueur && work.hauteur) {
      const isPlafond = work.work_type === 'plafond_ba13';
      const label2 = isPlafond ? 'l' : 'H';
      return `L=${work.longueur}m × ${label2}=${work.hauteur}m`;
    }
    return null;
  };

  // Loading
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

  // Error
  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700 mb-4">{error.message || 'Erreur lors du chargement'}</p>
          <Link to="/quotations" className="text-red-700 font-medium hover:underline">← Retour à la liste</Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!quotation) return null;

  const statusConfig = STATUS_CONFIG[quotation.status] || STATUS_CONFIG.draft;
  const odooStatusConfig = quotation.odoo_status ? ODOO_STATUS_CONFIG[quotation.odoo_status] : null;
  const isPolling = quotation.odoo_status === 'sent';

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <RejectionModal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} onConfirm={handleRejectQuotation} isLoading={rejectLoading} />

      <div className="space-y-6 print:space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 print:hidden">
          <div>
            <Link to="/quotations" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-4">
              <ArrowLeftIcon className="w-4 h-4" />
              Retour aux devis
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{quotation.reference}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                {statusConfig.label}
              </span>
              <span className="text-gray-500">Créé le {formatDate(quotation.created_at)}</span>
              
              {quotation.odoo_order_name && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${odooStatusConfig?.bgColor || 'bg-purple-100'} ${odooStatusConfig?.textColor || 'text-purple-700'}`}>
                  {odooStatusConfig?.icon || '🔄'} Odoo: {quotation.odoo_order_name}
                </span>
              )}

              {isPolling && isFetching && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <RefreshIcon className="w-3 h-3 animate-spin" />
                  Actualisation...
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {quotation.status === 'draft' && (
              <Link to={`/quotations/${id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <PencilIcon className="w-4 h-4" />
                Modifier
              </Link>
            )}
            
            {quotation.status === 'sent' && (
              <>
                <button onClick={() => handleStatusChange('accepted')} disabled={actionLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  <CheckCircleIcon className="w-4 h-4" /> Accepté
                </button>
                <button onClick={() => handleStatusChange('rejected')} disabled={actionLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  <XCircleIcon className="w-4 h-4" /> Refusé
                </button>
              </>
            )}
            
            <button onClick={handleDownloadPdf} disabled={actionLoading} className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Télécharger le devis
            </button>
          </div>
        </div>

        {/* Odoo "En Attente" Banner */}
        {quotation.odoo_status === 'sent' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 print:hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <h3 className="font-semibold text-yellow-800">Devis en attente de réponse</h3>
                  <p className="text-sm text-yellow-700">Le devis a été envoyé au client via Odoo. En attente de confirmation.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAcceptQuotation} disabled={acceptLoading || rejectLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  {acceptLoading ? <><SpinnerIcon className="w-4 h-4" /> Envoi...</> : <><CheckCircleIcon className="w-4 h-4" /> Accepter le devis</>}
                </button>
                <button onClick={() => setShowRejectModal(true)} disabled={acceptLoading || rejectLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  <XCircleIcon className="w-4 h-4" /> Refuser le devis
                </button>
              </div>
            </div>
          </div>
        )}

        {quotation.odoo_status === 'sale' && quotation.facture_id && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 print:hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">Devis confirmé</h3>
                  <p className="text-sm text-green-700">Le devis a été accepté. Une facture a été créée automatiquement.</p>
                </div>
              </div>
              <Link to={`/factures/${quotation.facture_id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                <BanknotesIcon className="w-4 h-4" />
                Voir la facture
              </Link>
            </div>
          </div>
        )}

        {/* DTU Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Mention DTU 25.41 :</strong> Les calculs et quantités de ce devis sont établis conformément aux règles de calcul et de mise en œuvre du DTU 25.41. Ils sont destinés à un usage de simulation et peuvent être ajustés selon les contraintes réelles du chantier.
            </p>
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

                {room.works?.map((work, workIndex) => {
                  const workTypeInfo = getWorkTypeInfo(work.work_type);
                  const dimensions = formatDimensions(work);
                  
                  return (
                    <div key={workIndex} className="mb-6 last:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{workTypeInfo.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-700">{work.work_type_label || workTypeInfo.label}</h3>
                            {workTypeInfo.description && <p className="text-xs text-gray-500">{workTypeInfo.description}</p>}
                          </div>
                        </div>
                        <div className="sm:ml-auto flex flex-wrap items-center gap-3 text-sm">
                          {dimensions && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{dimensions}</span>
                          )}
                          <span className="px-2 py-1 bg-blue-50 rounded text-blue-700 font-medium">
                            {work.surface} {work.unit_label || 'm²'}
                          </span>
                          <span className="font-medium text-gray-700">{formatAmount(work.subtotal_ht)} DH</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left py-2 px-3 font-medium text-gray-600">Matériau</th>
                              <th className="text-center py-2 px-3 font-medium text-gray-600">Qté calc.</th>
                              <th className="text-center py-2 px-3 font-medium text-gray-600">Qté ajust.</th>
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
                                  {item.is_modified && <span className="ml-2 text-xs text-yellow-600 font-medium">(modifié)</span>}
                                </td>
                                <td className="py-2 px-3 text-center text-gray-500">{item.quantity_calculated}</td>
                                <td className={`py-2 px-3 text-center ${item.is_modified ? 'font-medium text-yellow-700' : 'text-gray-600'}`}>
                                  {item.quantity_adjusted}
                                </td>
                                <td className="py-2 px-3 text-center text-gray-600">{item.unit}</td>
                                <td className="py-2 px-3 text-right text-gray-600">{formatAmount(item.unit_price)} DH</td>
                                <td className="py-2 px-3 text-right font-medium text-gray-900">{formatAmount(item.total_ht)} DH</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50">
                              <td colSpan="5" className="py-2 px-3 text-right font-medium text-gray-700">
                                Sous-total {workTypeInfo.label}:
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-gray-900">{formatAmount(work.subtotal_ht)} DH</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 flex flex-col">
            {/* Totals Card */}
            <div className="bg-white rounded-xl shadow p-6 print:shadow-none print:border print:border-gray-200 top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Travaux inclus :</p>
                <div className="space-y-1">
                  {quotation.rooms?.map((room, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{ROOM_ICONS[room.room_type] || '📦'}</span>
                      <span>{room.display_name || room.room_name}</span>
                      <span className="text-gray-400">({room.works?.length || 0} ouvrage{room.works?.length > 1 ? 's' : ''})</span>
                    </div>
                  ))}
                </div>
              </div>
              
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

              {quotation.validity_date && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Devis valable jusqu'au <span className="font-medium text-gray-900">{formatDate(quotation.validity_date)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Odoo Card */}
            {quotation.odoo_order_name && (
              <div className="bg-white rounded-xl shadow p-6 print:hidden">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <OdooIcon className="w-5 h-5 text-purple-600" />
                  Odoo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Commande Odoo</span>
                    <span className="font-semibold text-gray-900">{quotation.odoo_order_name}</span>
                  </div>
                  {quotation.odoo_status && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Statut</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ODOO_STATUS_CONFIG[quotation.odoo_status]?.bgColor || 'bg-gray-100'} ${ODOO_STATUS_CONFIG[quotation.odoo_status]?.textColor || 'text-gray-700'}`}>
                        {ODOO_STATUS_CONFIG[quotation.odoo_status]?.icon} {ODOO_STATUS_CONFIG[quotation.odoo_status]?.label || quotation.odoo_status}
                      </span>
                    </div>
                  )}
                  {quotation.odoo_synced_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dernière sync</span>
                      <span className="text-sm text-gray-500">{formatDateTime(quotation.odoo_synced_at)}</span>
                    </div>
                  )}
                  {isPolling && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <RefreshIcon className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                        <span>Actualisation automatique toutes les 10s</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DTU Info */}
            <div className="bg-gray-50 rounded-xl p-4 print:hidden">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <InformationCircleIcon className="w-4 h-4" />
                Paramètres DTU 25.41
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Entraxe standard : 60 cm</li>
                <li>• Plaque BA13 : 120 × 250 cm (3 m²)</li>
                <li>• Profils : 3 m de longueur</li>
                <li>• Arrondi : toujours supérieur</li>
              </ul>
            </div>

            {/* QR Code */}
            {quotation.public_pdf_url && (
              <div className="print:hidden">
                <QRCodePdf publicPdfUrl={quotation.public_pdf_url} reference={quotation.reference} size={160} />
              </div>
            )}

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

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </DashboardLayout>
  );
};

export default QuotationDetailPage;