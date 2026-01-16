// src/components/projects/ProjectListPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { projectAPI } from '../../services/api';

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'active', label: 'Actif' },
    { value: 'on_hold', label: 'En attente' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  useEffect(() => {
    fetchProjects();
  }, [search, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      };
      
      console.log('Fetching projects...');
      const response = await projectAPI.getProjects(params);
      console.log('API Response:', response);
      
      // Extract projects from the nested structure
      let projectsData = [];
      if (response.data && response.data.success && response.data.data) {
        // Check if it's the paginated structure
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          projectsData = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          projectsData = response.data.data;
        }
      } else if (Array.isArray(response.data)) {
        projectsData = response.data;
      }
      
      console.log('Extracted projects:', projectsData);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await projectAPI.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Erreur lors de la suppression du projet');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Non définie';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Projets</h1>
            <p className="text-neutral-500">Gérez tous vos projets de construction</p>
          </div>
          <Link to="/projects/create">
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Nouveau projet
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="Rechercher un projet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              icon={<FunnelIcon className="w-5 h-5" />}
            />
          </div>
        </Card>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Debug info - remove this after debugging */}
            <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
              Nombre de projets: {Array.isArray(projects) ? projects.length : 'Non-array'}
              Type: {typeof projects}
            </div>

            {!Array.isArray(projects) ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BuildingOfficeIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Erreur de données
                </h3>
                <p className="text-neutral-500 mb-6">
                  Les données reçues ne sont pas valides
                </p>
                <Button variant="outline" onClick={fetchProjects}>
                  Réessayer
                </Button>
              </Card>
            ) : projects.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BuildingOfficeIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-neutral-500 mb-6">
                  {search || statusFilter ? 'Essayez de modifier vos critères de recherche' : 'Commencez par créer votre premier projet'}
                </p>
                <Link to="/projects/create">
                  <Button variant="outline">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Créer un projet
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                    <div className="p-5">
                      {/* Project header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800 line-clamp-1">
                            {project.name}
                          </h3>
                          {project.reference && (
                            <p className="text-sm text-neutral-500">Ref: {project.reference}</p>
                          )}
                        </div>
                      </div>

                      {/* Project description */}
                      {project.description && (
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      {/* Project details */}
                      <div className="space-y-3 mb-4">
                        {project.client_name && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <UserIcon className="w-4 h-4" />
                            <span>{project.client_name}</span>
                          </div>
                        )}

                        {project.city && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{project.city}</span>
                          </div>
                        )}

                        {project.start_date && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Début: {formatDate(project.start_date)}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="text-xs text-neutral-500">
                          Créé le {formatDate(project.created_at)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/projects/${project.id}`}>
                            <button className="p-2 text-neutral-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link to={`/projects/${project.id}/edit`}>
                            <button className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectListPage;