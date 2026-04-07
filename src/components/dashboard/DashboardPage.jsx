// src/components/dashboard/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { quotationAPI } from '../../services/quotationApi';

// ============ COMPOSANT KPI CARD ============
const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary', loading = false }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-neutral-200 rounded w-20 mb-2"></div>
            <div className="h-3 bg-neutral-200 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-neutral-200 rounded-xl"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
          )}
          {trend !== undefined && trend !== null && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-neutral-500'
            }`}>
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : trend === 'down' ? (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              ) : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

// ============ COMPOSANT DEVIS RECENT ============
const RecentQuotation = ({ quotation }) => {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <Link 
      to={`/quotations/${quotation.id}`}
      className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 -mx-2 px-2 rounded transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-800">{quotation.reference}</span>
        </div>
        <p className="text-sm text-neutral-500 truncate">{quotation.client_name}</p>
      </div>
      <div className="text-right ml-4">
        <p className="font-semibold text-neutral-800">{formatMoney(quotation.total_ttc)}</p>
        <p className="text-xs text-neutral-400">
          {new Date(quotation.created_at).toLocaleDateString('fr-FR')}
        </p>
      </div>
    </Link>
  );
};

// ============ SKELETON COMPONENTS ============
const ChartSkeleton = () => (
  <div className="animate-pulse h-full flex flex-col justify-end gap-2 px-4">
    {[60, 40, 80, 30, 55].map((h, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="h-4 bg-neutral-200 rounded w-20" />
        <div className="h-5 bg-neutral-200 rounded" style={{ width: `${h}%` }} />
      </div>
    ))}
  </div>
);

const QuotationListSkeleton = () => (
  <div className="animate-pulse space-y-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center justify-between py-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-neutral-200 rounded w-32" />
          <div className="h-3 bg-neutral-100 rounded w-48" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 bg-neutral-200 rounded w-24 ml-auto" />
          <div className="h-3 bg-neutral-100 rounded w-16 ml-auto" />
        </div>
      </div>
    ))}
  </div>
);

// ============ COMPOSANT PRINCIPAL ============
const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentQuotations, setRecentQuotations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, quotationsRes] = await Promise.all([
        quotationAPI.getStats(),
        quotationAPI.getAll({ per_page: 5 }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (quotationsRes.data.success) {
        setRecentQuotations(quotationsRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Impossible de charger les données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const formatFullMoney = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-neutral-100">
          <p className="font-medium text-neutral-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color || '#9E3D36' }}>
              {entry.dataKey === 'ca' ? 'CA: ' : 'Devis: '}
              {entry.dataKey === 'ca' ? formatFullMoney(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ============ WELCOME SECTION (renders instantly) ============ */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Bienvenue, {user?.first_name} ! 👋
              </h1>
              <p className="text-white/80">
                Voici un aperçu de votre activité ce mois-ci.
              </p>
            </div>
            <Link
              to="/quotations/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-neutral-100 transition-colors w-fit"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau devis
            </Link>
          </div>
        </div>

        {/* ============ ERROR BANNER (inline, non-blocking) ============ */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 shrink-0" />
            <p className="text-red-700 flex-1">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors shrink-0"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* ============ CHART SECTION ============ */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-neutral-800 mb-6">
              Types de travaux
            </h2>
            <div className="h-64">
              {loading ? (
                <ChartSkeleton />
              ) : stats?.work_type_distribution && stats.work_type_distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={stats.work_type_distribution} 
                    layout="vertical"
                    margin={{ left: 0, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                    <XAxis 
                      type="number" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      width={90}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    >
                      {stats.work_type_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400">
                  Aucune donnée
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ============ RECENT QUOTATIONS ============ */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Derniers devis
              </h2>
              <Link 
                to="/quotations"
                className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
              >
                Voir tout
                <EyeIcon className="w-4 h-4" />
              </Link>
            </div>
            <div>
              {loading ? (
                <QuotationListSkeleton />
              ) : recentQuotations.length > 0 ? (
                recentQuotations.map((quotation) => (
                  <RecentQuotation key={quotation.id} quotation={quotation} />
                ))
              ) : (
                <div className="py-8 text-center text-neutral-500">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                  <p>Aucun devis pour le moment</p>
                  <Link 
                    to="/quotations/create"
                    className="text-primary hover:underline mt-2 inline-block"
                  >
                    Créer votre premier devis
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;