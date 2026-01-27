// src/components/dashboard/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { 
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  EyeIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {quotationAPI} from '../../services/quotationApi';

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
  const statusColors = {
    draft: 'bg-neutral-100 text-neutral-600',
    sent: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-orange-100 text-orange-700',
  };

  const statusLabels = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    accepted: 'Accepté',
    rejected: 'Refusé',
    expired: 'Expiré',
  };

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
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[quotation.status]}`}>
            {statusLabels[quotation.status]}
          </span>
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

// ============ COMPOSANT PRINCIPAL ============
const DashboardPage = () => {
  const { user, company, isProfessionnel } = useAuth();
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
      
      // Fetch stats from backend
      const statsResponse = await quotationAPI.getStats();
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch recent quotations
      const quotationsResponse = await quotationAPI.getAll({ per_page: 5 });
      if (quotationsResponse.data.success) {
        setRecentQuotations(quotationsResponse.data.data || []);
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Impossible de charger les données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  // ============ HELPERS DE FORMATAGE ============
  const formatMoney = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K';
    }
    return amount?.toString() || '0';
  };

  const formatFullMoney = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Déterminer la tendance (up, down, ou neutral)
  const getTrend = (value) => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return null;
  };

  // Custom tooltip for charts
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

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome skeleton */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-96"></div>
          </div>

          {/* KPI skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <KPICard key={i} loading={true} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ============ ERROR STATE ============
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ============ RENDER ============
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ============ WELCOME SECTION ============ */}
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

        {/* ============ KPI CARDS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Devis créés"
            value={stats?.quotations_this_month || 0}
            subtitle="Ce mois"
            icon={DocumentTextIcon}
            trend={getTrend(stats?.quotations_trend)}
            trendValue={`${stats?.quotations_trend > 0 ? '+' : ''}${stats?.quotations_trend || 0} vs mois dernier`}
            color="blue"
          />
          <KPICard
            title="Taux de conversion"
            value={(stats?.conversion_rate || 0) + '%'}
            subtitle="Acceptés / Traités"
            icon={CheckCircleIcon}
            trend={getTrend(stats?.conversion_trend)}
            trendValue={`${stats?.conversion_trend > 0 ? '+' : ''}${stats?.conversion_trend || 0}% vs mois dernier`}
            color="green"
          />
          <KPICard
            title="En attente"
            value={stats?.pending || 0}
            subtitle={formatFullMoney(stats?.pending_amount || 0)}
            icon={ClockIcon}
            color="orange"
          />
        </div>

        {/* ============ CHARTS ROW ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          {/* <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-800">
                Statistique
              </h2>
              <span className="text-sm text-neutral-500">6 derniers mois</span>
            </div>
            <div className="h-72">
              {stats?.monthly_data && stats.monthly_data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthly_data}>
                    <defs>
                      <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9E3D36" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#9E3D36" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => formatMoney(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="ca" 
                      name="Chiffre d'affaires"
                      stroke="#9E3D36" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorCa)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </Card> */}

          {/* Work Types Bar Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-800 mb-6">
              Types de travaux
            </h2>
            <div className="h-64">
              {stats?.work_type_distribution && stats.work_type_distribution.length > 0 ? (
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
                    <Tooltip />
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

          {/* Status Pie Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-800 mb-6">
              Répartition des devis
            </h2>
            <div className="h-56">
              {stats?.status_distribution && stats.status_distribution.some(s => s.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.status_distribution.filter(s => s.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats.status_distribution.filter(s => s.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400">
                  Aucun devis
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {stats?.status_distribution?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-neutral-600">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </Card>


        </div>

        {/* ============ SECOND ROW ============ */}
        <div className="grid grid-cols-1 gap-6">
          {/* Recent Quotations */}
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
              {recentQuotations.length > 0 ? (
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

        {/* ============ QUICK ACTIONS & INFO ============ */}
        <div className="grid grid-cols-1 gap-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/quotations/create"
                className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <PlusIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-primary">Nouveau devis</span>
              </Link>
              <Link
                to="/quotations?status=sent"
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-blue-600">En attente ({stats?.pending || 0})</span>
              </Link>
              <Link
                to="/projects"
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <BuildingOfficeIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-purple-600">Mes projets</span>
              </Link>
              <Link
                to="/quotations?status=accepted"
                className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-green-600">Acceptés ({stats?.accepted || 0})</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;