// src/pages/commandes/CommandeDetailPage.jsx
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useCommande, useUpdateCommandeStatus } from '../../hooks/useCommandes';

// Icons
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const ClipboardDocumentListIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const DocumentTextIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const BanknotesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
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

const SpinnerIcon = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Status config
const STATUS_CONFIG = {
  en_attente: { label: 'En attente', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', icon: '⏳' },
  en_cours: { label: 'En cours', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: '🔄' },
  livree: { label: 'Livrée', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✅' },
  annulee: { label: 'Annulée', bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '❌' },
};

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

// Toast component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgColor}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <XCircleIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const CommandeDetailPage = () => {
  const { id } = useParams();
  const [toast, setToast] = useState(null);

  // React Query
  const { data: commande, isLoading, isError } = useCommande(id);
  const updateStatusMutation = useUpdateCommandeStatus();

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      showToast('Statut mis à jour avec succès', 'success');
    } catch (err) {
      showToast('Erreur lors de la mise à jour du statut', 'error');
    }
  };

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
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement de la commande...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (isError || !commande) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700 mb-4">Commande introuvable</p>
          <Link to="/commandes" className="text-red-700 font-medium hover:underline">
            ← Retour à la liste
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const statusConfig = STATUS_CONFIG[commande.status] || STATUS_CONFIG.en_attente;
  const quotation = commande.quotation;

  return (
    <DashboardLayout>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <Link
              to="/commandes"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Retour aux commandes
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-7 h-7 text-red-700" />
              {commande.numero}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
              <span className="text-gray-500">Créée le {formatDate(commande.created_at)}</span>
            </div>
          </div>

          {/* Status Actions */}
          {commande.status !== 'annulee' && commande.status !== 'livree' && (
            <div className="flex flex-wrap gap-2">
              {commande.status === 'en_attente' && (
                <button
                  onClick={() => handleStatusChange('en_cours')}
                  disabled={updateStatusMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? <SpinnerIcon className="w-4 h-4" /> : '🔄'}
                  Passer en cours
                </button>
              )}
              {commande.status === 'en_cours' && (
                <button
                  onClick={() => handleStatusChange('livree')}
                  disabled={updateStatusMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? <SpinnerIcon className="w-4 h-4" /> : '✅'}
                  Marquer livrée
                </button>
              )}
              <button
                onClick={() => handleStatusChange('annulee')}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? <SpinnerIcon className="w-4 h-4" /> : '❌'}
                Annuler
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">{quotation?.client_name || '-'}</p>
                </div>
                {quotation?.client_email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{quotation.client_email}</p>
                  </div>
                )}
                {quotation?.client_phone && (
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-900">{quotation.client_phone}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Adresse du chantier</p>
                  <p className="font-medium text-gray-900">
                    {quotation?.site_address}, {quotation?.site_city}
                    {quotation?.site_postal_code && ` ${quotation.site_postal_code}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Rooms & Materials */}
            {quotation?.rooms?.map((room, roomIndex) => (
              <div key={roomIndex} className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">{ROOM_ICONS[room.room_type] || '📦'}</span>
                  {room.display_name || room.room_name}
                  <span className="text-sm font-normal text-gray-500 ml-auto">
                    Sous-total: {formatAmount(room.subtotal_ht)} DH HT
                  </span>
                </h2>

                {room.works?.map((work, workIndex) => (
                  <div key={workIndex} className="mb-4 last:mb-0">
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
                            <tr key={itemIndex} className="border-b border-gray-100">
                              <td className="py-2 px-3 text-gray-900">{item.designation}</td>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Totals Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total HT</span>
                  <span className="font-medium text-gray-900">{formatAmount(quotation?.total_ht)} DH</span>
                </div>
                
                {quotation?.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise ({quotation.discount_percent}%)</span>
                    <span>-{formatAmount(quotation.discount_amount)} DH</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA ({quotation?.tva_rate}%)</span>
                  <span className="font-medium text-gray-900">{formatAmount(quotation?.total_tva)} DH</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total TTC</span>
                    <span className="text-xl font-bold text-red-700">{formatAmount(commande.prix_total)} DH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Documents */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents liés</h2>
              
              <div className="space-y-3">
                {/* Devis */}
                <Link
                  to={`/quotations/${quotation?.id}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Devis</p>
                    <p className="text-sm text-gray-500">{quotation?.reference}</p>
                  </div>
                </Link>

                {/* Facture */}
                {commande.facture ? (
                  <Link
                    to={`/factures/${commande.facture.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <BanknotesIcon className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Facture</p>
                      <p className="text-sm text-gray-500">{commande.facture.numero}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <BanknotesIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-500">Facture</p>
                      <p className="text-sm text-gray-400">Non générée</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommandeDetailPage;