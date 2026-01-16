// src/components/auth/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../layout/AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

const RegisterPage = () => {
    const location = useLocation();
    const googleData = location.state?.googleData;  
    const isGoogleSignup = !!googleData;

  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: googleData?.first_name || '',
    last_name: googleData?.last_name || '',
    email: googleData?.email || '',
    phone: '',
    password: '',
    password_confirmation: '',
    account_type: 'particulier',
    company_name: '',
    company_ice: '',
    company_address: '',
    company_city: '',
    company_phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

    const validateStep1 = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
        newErrors.first_name = 'Le prénom est obligatoire';
    }

    if (!formData.last_name.trim()) {
        newErrors.last_name = 'Le nom est obligatoire';
    }

    if (!formData.email) {
        newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email invalide';
    }

    // ❗ Password ONLY for normal signup
    if (!isGoogleSignup) {
        if (!formData.password) {
        newErrors.password = 'Le mot de passe est obligatoire';
        } else if (formData.password.length < 8) {
        newErrors.password = 'Minimum 8 caractères';
        }

        if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };


  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.account_type === 'professionnel') {
      if (!formData.company_name.trim()) {
        newErrors.company_name = 'Le nom de l\'entreprise est obligatoire';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);
        setAlert(null);

        try {
            let response;

            if (isGoogleSignup) {
                           
                const payload = {
                    google_id: googleData.google_id,
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    avatar: googleData.avatar,
                    account_type: formData.account_type,
                };

                
                if (formData.account_type === 'professionnel') {
                    payload.company_name = formData.company_name;
                    payload.company_ice = formData.company_ice;
                    payload.company_address = formData.company_address;
                    payload.company_city = formData.company_city;
                    payload.company_phone = formData.company_phone;
                }

           
                response = await api.post('/auth/google/complete', payload);

                localStorage.setItem('token', response.data.data.token);
                navigate('/dashboard');

            } else {
            // 🧾 NORMAL REGISTER
            const result = await register(formData);

            if (!result.success) {
                setAlert({ type: 'error', message: result.error });
                return;
            }

            navigate('/dashboard');
            }
        } catch (error) {
            setAlert({
            type: 'error',
            message: error.response?.data?.message || 'Erreur lors de l’inscription'
            });
        } finally {
            setLoading(false);
        }
    };


  return (
    <AuthLayout 
        title={isGoogleSignup ? 'Finaliser votre inscription' : 'Créer un compte'}
        subtitle={step === 1 ? "Informations personnelles" : "Type de compte"}
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-neutral-200'}`} />
        <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-neutral-200'}`} />
        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-neutral-200'}`} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)} 
          />
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Jean"
                icon={UserIcon}
                error={errors.first_name}
                required
              />
              <Input
                label="Nom"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Dupont"
                error={errors.last_name}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jean.dupont@email.com"
              icon={EnvelopeIcon}
              error={errors.email}
              required
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6 00 00 00 00"
              icon={PhoneIcon}
              error={errors.phone}
            />

            {!isGoogleSignup && (
                <>
                    <Input
                    label="Mot de passe"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={LockClosedIcon}
                    error={errors.password}
                    required
                    />

                    <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                    required
                    />
                </>
            )}


            <Button 
              type="button" 
              onClick={handleNext}
              fullWidth
              className="mt-6"
            >
              Continuer
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Account Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-700">
                Type de compte <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'account_type', value: 'particulier' }})}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-left
                    ${formData.account_type === 'particulier' 
                      ? 'border-primary bg-primary-50' 
                      : 'border-neutral-200 hover:border-primary-200'
                    }
                  `}
                >
                  <UserIcon className={`w-6 h-6 mb-2 ${formData.account_type === 'particulier' ? 'text-primary' : 'text-neutral-400'}`} />
                  <p className={`font-semibold ${formData.account_type === 'particulier' ? 'text-primary' : 'text-neutral-700'}`}>
                    Particulier
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Usage personnel
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'account_type', value: 'professionnel' }})}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-left
                    ${formData.account_type === 'professionnel' 
                      ? 'border-primary bg-primary-50' 
                      : 'border-neutral-200 hover:border-primary-200'
                    }
                  `}
                >
                  <BuildingOfficeIcon className={`w-6 h-6 mb-2 ${formData.account_type === 'professionnel' ? 'text-primary' : 'text-neutral-400'}`} />
                  <p className={`font-semibold ${formData.account_type === 'professionnel' ? 'text-primary' : 'text-neutral-700'}`}>
                    Professionnel
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Entreprise
                  </p>
                </button>
              </div>
            </div>

            {/* Company Fields (if professional) */}
            {formData.account_type === 'professionnel' && (
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  Informations entreprise
                </h3>
                
                <Input
                  label="Nom de l'entreprise"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Ma Société SARL"
                  icon={BuildingOfficeIcon}
                  error={errors.company_name}
                  required
                />

                <Input
                  label="ICE"
                  name="company_ice"
                  value={formData.company_ice}
                  onChange={handleChange}
                  placeholder="000000000000000"
                  icon={IdentificationIcon}
                  error={errors.company_ice}
                />

                <Input
                  label="Adresse"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  placeholder="123 Rue Example"
                  icon={MapPinIcon}
                  error={errors.company_address}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ville"
                    name="company_city"
                    value={formData.company_city}
                    onChange={handleChange}
                    placeholder="Casablanca"
                    error={errors.company_city}
                  />
                  <Input
                    label="Téléphone"
                    name="company_phone"
                    value={formData.company_phone}
                    onChange={handleChange}
                    placeholder="+212 5 00 00 00 00"
                    error={errors.company_phone}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button 
                type="button" 
                variant="secondary"
                onClick={handleBack}
                className="flex-1"
              >
                Retour
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                className="flex-1"
              >
                S'inscrire
              </Button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-neutral-600 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="link">
            Se connecter
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;