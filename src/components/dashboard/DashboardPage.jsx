// src/components/dashboard/DashboardPage.jsx
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  ShieldCheckIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user, company, isProfessionnel } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Bienvenue, {user?.first_name} ! 👋
          </h1>
          <p className="text-white/80">
            Gérez votre compte et vos informations depuis votre espace personnel.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Type de compte</p>
              <p className="font-semibold text-neutral-800 capitalize">
                {user?.account_type}
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Statut</p>
              <p className="font-semibold text-green-600">
                Actif
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Dernière connexion</p>
              <p className="font-semibold text-neutral-800 text-sm">
                {formatDate(user?.last_login_at)}
              </p>
            </div>
          </Card>

          {isProfessionnel && (
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Entreprise</p>
                <p className="font-semibold text-neutral-800 truncate">
                  {company?.name || 'Non définie'}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Informations personnelles
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Nom complet</span>
                <span className="font-medium text-neutral-800">{user?.full_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Email</span>
                <span className="font-medium text-neutral-800">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Téléphone</span>
                <span className="font-medium text-neutral-800">{user?.phone || 'Non renseigné'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500">Rôle</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary">
                  {user?.roles?.[0] || 'Utilisateur'}
                </span>
              </div>
            </div>
          </Card>

          {isProfessionnel && company && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                Informations entreprise
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Nom</span>
                  <span className="font-medium text-neutral-800">{company.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">ICE</span>
                  <span className="font-medium text-neutral-800">{company.ice || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Ville</span>
                  <span className="font-medium text-neutral-800">{company.city || 'Non renseignée'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-500">Téléphone</span>
                  <span className="font-medium text-neutral-800">{company.phone || 'Non renseigné'}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;