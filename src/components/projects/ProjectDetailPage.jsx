// src/components/projects/ProjectDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  ArrowLeftIcon,
  PencilIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { projectAPI } from '../../services/api';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProject(id);
      setProject(response.data.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Non définie';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/projects">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeftIcon className="w-4 h-4" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">{project.name}</h1>
              {project.reference && (
                <p className="text-neutral-500">Référence: {project.reference}</p>
              )}
            </div>
          </div>
          <Link to={`/projects/${project.id}/edit`}>
            <Button className="flex items-center gap-2">
              <PencilIcon className="w-4 h-4" />
              Modifier
            </Button>
          </Link>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${statusColors[project.status]}`}>
            {project.status === 'draft' && 'Brouillon'}
            {project.status === 'active' && 'Actif'}
            {project.status === 'on_hold' && 'En attente'}
            {project.status === 'completed' && 'Terminé'}
            {project.status === 'cancelled' && 'Annulé'}
          </span>
          
          {project.priority && (
            <span className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${priorityColors[project.priority]}`}>
              {project.priority === 'low' && 'Priorité: Basse'}
              {project.priority === 'medium' && 'Priorité: Moyenne'}
              {project.priority === 'high' && 'Priorité: Haute'}
              {project.priority === 'urgent' && 'Priorité: Urgente'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Project info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Description</h2>
              {project.description ? (
                <p className="text-neutral-600 whitespace-pre-line">{project.description}</p>
              ) : (
                <p className="text-neutral-400 italic">Aucune description fournie</p>
              )}
            </Card>

            {/* Timeline */}
            <Card>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Calendrier</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">Début</span>
                  </div>
                  <p className="font-medium">{formatDate(project.start_date)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">Fin prévue</span>
                  </div>
                  <p className="font-medium">{formatDate(project.end_date)}</p>
                </div>
                
                {project.estimated_completion_date && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-sm">Date estimée</span>
                    </div>
                    <p className="font-medium">{formatDate(project.estimated_completion_date)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Address */}
            {(project.address_line1 || project.city || project.postal_code) && (
              <Card>
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Adresse</h2>
                <div className="space-y-2">
                  {project.address_line1 && (
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{project.address_line1}</p>
                        {project.address_line2 && <p>{project.address_line2}</p>}
                        {(project.city || project.postal_code) && (
                          <p className="text-neutral-500">
                            {project.postal_code} {project.city}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right column - Details */}
          <div className="space-y-6">
            {/* Client info */}
            {(project.client_name || project.client_email || project.client_phone) && (
              <Card>
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Client</h2>
                <div className="space-y-3">
                  {project.client_name && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-neutral-400" />
                      <span className="font-medium">{project.client_name}</span>
                    </div>
                  )}
                  
                  {project.client_email && (
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-neutral-400" />
                      <a 
                        href={`mailto:${project.client_email}`}
                        className="text-primary hover:underline"
                      >
                        {project.client_email}
                      </a>
                    </div>
                  )}
                  
                  {project.client_phone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-neutral-400" />
                      <a 
                        href={`tel:${project.client_phone}`}
                        className="text-primary hover:underline"
                      >
                        {project.client_phone}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Budget */}
            <Card>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Budget</h2>
              <div className="space-y-3">
                {project.estimated_budget && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Budget estimé</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(project.estimated_budget)}
                    </span>
                  </div>
                )}
                
                {project.actual_cost && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Coût réel</span>
                    <span className="text-lg font-bold text-neutral-800">
                      {formatCurrency(project.actual_cost)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Project info */}
            <Card>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Informations projet</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Créé par</span>
                  <span className="font-medium">
                    {project.creator?.first_name} {project.creator?.last_name}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date création</span>
                  <span className="font-medium">{formatDate(project.created_at)}</span>
                </div>
                
                {project.company && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Entreprise</span>
                    <span className="font-medium">{project.company.name}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;