import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { quotationAPI } from '../../services/api';

const QuotationFormPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    site_address: '',
    site_city: '',
    work_type: 'cloison',
    total_surface: ''
  });

  const workTypeOptions = [
    { value: 'cloison', label: 'Cloison' },
    { value: 'plafond', label: 'Plafond' },
    { value: 'doublage', label: 'Doublage' },
    { value: 'habillage', label: 'Habillage' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user edits
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError(null);

    try {
      const payload = {
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        site_address: formData.site_address,
        site_city: formData.site_city,
        work_type: formData.work_type,
        measurements: [
          {
            description: 'Surface principale',
            surface: Number(formData.total_surface)
          }
        ]
      };

      await quotationAPI.createQuotation(payload);
      navigate('/quotations');

    } catch (error) {
      const response = error.response;

      if (response?.status === 422) {
        // Laravel validation errors
        setErrors(response.data.errors || {});
      } else {
        setFormError(
          response?.data?.message ||
          'Une erreur inattendue est survenue. Veuillez réessayer.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/quotations">
            <Button variant="outline" className="flex items-center gap-2 mb-4">
              <ArrowLeftIcon className="w-4 h-4" />
              Retour aux devis
            </Button>
          </Link>

          <h1 className="text-2xl font-bold text-neutral-800">
            Nouveau devis
          </h1>
        </div>

        {/* Global error */}
        {formError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 mt-0.5" />
            <p>{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold mb-4">
                  Informations client
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Nom du client *"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    error={errors.client_name?.[0]}
                    required
                  />

                  <Input
                    label="Email"
                    name="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={handleChange}
                    error={errors.client_email?.[0]}
                  />

                  <Input
                    label="Téléphone"
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleChange}
                    error={errors.client_phone?.[0]}
                  />
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold mb-4">
                  Type d’ouvrage
                </h2>

                <Select
                  label="Type"
                  value={formData.work_type}
                  onChange={(value) => handleSelectChange('work_type', value)}
                  options={workTypeOptions}
                  error={errors.work_type?.[0]}
                />
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold mb-4">
                  Chantier
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Adresse du chantier *"
                    name="site_address"
                    value={formData.site_address}
                    onChange={handleChange}
                    icon={<MapPinIcon className="w-5 h-5" />}
                    error={errors.site_address?.[0]}
                    required
                  />

                  <Input
                    label="Ville *"
                    name="site_city"
                    value={formData.site_city}
                    onChange={handleChange}
                    error={errors.site_city?.[0]}
                    required
                  />
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold mb-4">
                  Mesures
                </h2>

                <Input
                  label="Surface totale (m²) *"
                  name="total_surface"
                  type="number"
                  step="0.01"
                  value={formData.total_surface}
                  onChange={handleChange}
                  error={errors['measurements.0.surface']?.[0]}
                  required
                />
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Link to="/quotations">
              <Button variant="outline">
                Annuler
              </Button>
            </Link>

            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              {saving ? 'Création...' : 'Créer le devis'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default QuotationFormPage;
