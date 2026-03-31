// src/pages/commandes/CommandeListPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useCommandes, useCommandesStats } from '../../hooks/useCommandes';

// Icons
const MagnifyingGlassIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClipboardDocumentListIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// Status config
const STATUS_CONFIG = {
  en_attente: { label: 'En attente', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', icon: '⏳' },
  en_cours: { label: 'En cours', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: '🔄' },
  livree: { label: 'Livrée', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✅' },
  annulee: { label: 'Annulée', bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '❌' },
};

const CommandeListPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // React Query
  const { data, isLoading, isError } = useCommandes({
    page,
    per_page: 10,
    status: status !== 'all' ? status : undefined,
    search: search || undefined,
  });

  const { data: stats } = useCommandesStats();

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusFilter = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const commandes = data?.data || [];
  const meta = data?.meta || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-7 h-7 text-red-700" />
              Commandes
            </h1>
            <p className="text-gray-500 mt-1">Gérez vos commandes clients</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow p-4">
              <p className="text-sm text-yellow-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.en_attente || 0}</p>
            </div>
            <div className="bg-blue-50 rounded-xl shadow p-4">
              <p className="text-sm text-blue-600">En cours</p>
              <p className="text-2xl font-bold text-blue-700">{stats.en_cours || 0}</p>
            </div>
            <div className="bg-green-50 rounded-xl shadow p-4">
              <p className="text-sm text-green-600">Livrées</p>
              <p className="text-2xl font-bold text-green-700">{stats.livree || 0}</p>
            </div>
            <div className="bg-red-50 rounded-xl shadow p-4">
              <p className="text-sm text-red-600">Annulées</p>
              <p className="text-2xl font-bold text-red-700">{stats.annulee || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, client..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'Tous' },
                { value: 'en_attente', label: 'En attente' },
                { value: 'en_cours', label: 'En cours' },
                { value: 'livree', label: 'Livrées' },
                { value: 'annulee', label: 'Annulées' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusFilter(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    status === option.value
                      ? 'bg-red-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-600">
              Erreur lors du chargement des commandes
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Numéro</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Devis</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Total TTC</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {commandes.map((commande) => {
                      const statusConfig = STATUS_CONFIG[commande.status] || STATUS_CONFIG.en_attente;
                      
                      return (
                        <tr key={commande.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900">{commande.numero}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{commande.quotation?.client_name || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              to={`/quotations/${commande.quotation?.id}`}
                              className="text-red-700 hover:underline"
                            >
                              {commande.quotation?.reference || '-'}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                              {statusConfig.icon} {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-semibold text-gray-900">{formatAmount(commande.prix_total)} DH</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-500">{formatDate(commande.created_at)}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Link
                              to={`/commandes/${commande.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              <EyeIcon className="w-4 h-4" />
                              Voir
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta.last_page > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Page {meta.current_page} sur {meta.last_page} ({meta.total} résultats)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                      Précédent
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.last_page}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommandeListPage;