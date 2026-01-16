// src/components/projects/ProjectFormPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { projectAPI } from '../../services/api';

const ProjectFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    description: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    start_date: '',
    end_date: '',
    estimated_completion_date: '',
    status: 'draft',
    priority: 'medium',
    estimated_budget: '',
    actual_cost: '',
    client_name: '',
    client_email: '',
    client_phone: ''
  });

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'active', label: 'Actif' },
    { value: 'on_hold', label: 'En attente' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Basse' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Haute' },
    { value: 'urgent', label: 'Urgente' }
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProject(id);
      const project = response.data.data;
      
      // Format dates for input fields
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
      };

      setFormData({
        name: project.name || '',
        reference: project.reference || '',
        description: project.description || '',
        address_line1: project.address_line1 || '',
        address_line2: project.address_line2 || '',
        city: project.city || '',
        postal_code: project.postal_code || '',
        start_date: formatDateForInput(project.start_date),
        end_date: formatDateForInput(project.end_date),
        estimated_completion_date: formatDateForInput(project.estimated_completion_date),
        status: project.status || 'draft',
        priority: project.priority || 'medium',
        estimated_budget: project.estimated_budget || '',
        actual_cost: project.actual_cost || '',
        client_name: project.client_name || '',
        client_email: project.client_email || '',
        client_phone: project.client_phone || ''
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare data
      const data = { ...formData };
      
      // Convert empty strings to null for numeric fields
      if (data.estimated_budget === '') data.estimated_budget = null;
      if (data.actual_cost === '') data.actual_cost = null;

      if (isEditMode) {
        await projectAPI.updateProject(id, data);
      } else {
        await projectAPI.createProject(data);
      }

      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/projects">
            <Button variant="outline" className="flex items-center gap-2 mb-4">
              <ArrowLeftIcon className="w-4 h-4" />
              Retour aux projets
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-800">
            {isEditMode ? 'Modifier le projet' : 'Nouveau projet'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Informations générales</h2>
                <div className="space-y-4">
                  <Input
                    label="Nom du projet *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Référence"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="Réf. interne"
                  />

                  <TextArea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Décrivez le projet..."
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Statut"
                      name="status"
                      value={formData.status}
                      onChange={(value) => handleSelectChange('status', value)}
                      options={statusOptions}
                    />

                    <Select
                      label="Priorité"
                      name="priority"
                      value={formData.priority}
                      onChange={(value) => handleSelectChange('priority', value)}
                      options={priorityOptions}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Budget</h2>
                <div className="space-y-4">
                  <Input
                    label="Budget estimé (€)"
                    name="estimated_budget"
                    type="number"
                    step="0.01"
                    value={formData.estimated_budget}
                    onChange={handleChange}
                    icon={<CurrencyDollarIcon className="w-5 h-5" />}
                  />

                  {isEditMode && (
                    <Input
                      label="Coût réel (€)"
                      name="actual_cost"
                      type="number"
                      step="0.01"
                      value={formData.actual_cost}
                      onChange={handleChange}
                      icon={<CurrencyDollarIcon className="w-5 h-5" />}
                    />
                  )}
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Dates</h2>
                <div className="space-y-4">
                  <Input
                    label="Date de début"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    icon={<CalendarIcon className="w-5 h-5" />}
                  />

                  <Input
                    label="Date de fin prévue"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    icon={<CalendarIcon className="w-5 h-5" />}
                  />

                  <Input
                    label="Date estimée de fin"
                    name="estimated_completion_date"
                    type="date"
                    value={formData.estimated_completion_date}
                    onChange={handleChange}
                    icon={<CalendarIcon className="w-5 h-5" />}
                  />
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Adresse</h2>
                <div className="space-y-4">
                  <Input
                    label="Adresse ligne 1"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    icon={<MapPinIcon className="w-5 h-5" />}
                  />

                  <Input
                    label="Adresse ligne 2"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Code postal"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                    />

                    <Input
                      label="Ville"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Informations client</h2>
                <div className="space-y-4">
                  <Input
                    label="Nom du client"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                  />

                  <Input
                    label="Email du client"
                    name="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={handleChange}
                  />

                  <Input
                    label="Téléphone du client"
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleChange}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-6 flex justify-end gap-3">
            <Link to="/projects">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              {saving ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer le projet'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProjectFormPage;