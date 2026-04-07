// src/pages/factures/FactureListPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useFactures, useFacturesStats } from '../../hooks/useFactures';

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

const BanknotesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
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
  payee: { label: 'Payée', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✅' },
  annulee: { label: 'Annulée', bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '❌' },
};

const FactureListPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isError } = useFactures({
    page,
    per_page: 10,
    status: status !== 'all' ? status : undefined,
    search: search || undefined,
  });

  const { data: stats } = useFacturesStats();

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

  const factures = data?.data || [];
  const meta = data?.meta || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BanknotesIcon className="w-7 h-7 text-red-700" />
              Factures
            </h1>
            <p className="text-gray-500 mt-1">Gérez vos factures clients</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow p-4">
              <p className="text-sm text-yellow-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.en_attente || 0}</p>
              <p className="text-xs text-yellow-600 mt-1">{formatAmount(stats.total_en_attente)} DH</p>
            </div>
            <div className="bg-green-50 rounded-xl shadow p-4">
              <p className="text-sm text-green-600">Payées</p>
              <p className="text-2xl font-bold text-green-700">{stats.payee || 0}</p>
              <p className="text-xs text-green-600 mt-1">{formatAmount(stats.total_payee)} DH</p>
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

            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'Toutes' },
                { value: 'en_attente', label: 'En attente' },
                { value: 'payee', label: 'Payées' },
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
              Erreur lors du chargement des factures
            </div>
          ) : factures.length === 0 ? (
            <div className="text-center py-12">
              <BanknotesIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune facture trouvée</p>
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
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date émission</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {factures.map((facture) => {
                      const statusConfig = STATUS_CONFIG[facture.status] || STATUS_CONFIG.en_attente;
                      
                      return (
                        <tr key={facture.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900">{facture.numero}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{facture.quotation?.client_name || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              to={`/quotations/${facture.quotation?.id}`}
                              className="text-red-700 hover:underline"
                            >
                              {facture.quotation?.reference || '-'}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                              {statusConfig.icon} {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-semibold text-gray-900">{formatAmount(facture.total)} DH</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-500">{formatDate(facture.date_emission)}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Link
                              to={`/factures/${facture.id}`}
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

export default FactureListPage;