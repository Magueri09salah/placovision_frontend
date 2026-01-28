// src/components/auth/RegisterPage.jsx

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  IdentificationIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../layout/AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import api from '../../services/api';

// ============ VALIDATION DES MOTS DE PASSE ============
const PasswordStrengthIndicator = ({ password }) => {
  const checks = [
    { label: 'Au moins 8 caractères', valid: password.length >= 8 },
    { label: 'Une lettre majuscule', valid: /[A-Z]/.test(password) },
    { label: 'Une lettre minuscule', valid: /[a-z]/.test(password) },
    { label: 'Un chiffre', valid: /[0-9]/.test(password) },
    { label: 'Un caractère spécial (!@#$%...)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <p className="text-xs font-medium text-neutral-600 mb-2">Exigences du mot de passe :</p>
      <ul className="space-y-1">
        {checks.map((check, index) => (
          <li key={index} className="flex items-center gap-2 text-xs">
            {check.valid ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-neutral-300" />
            )}
            <span className={check.valid ? 'text-green-600' : 'text-neutral-500'}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const googleData = location.state?.googleData;
  const isGoogleSignup = !!googleData;

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
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Afficher l'indicateur de force du mot de passe
    if (name === 'password') {
      setShowPasswordStrength(value.length > 0);
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ============ VALIDATION ÉTAPE 1 ============
  const validateStep1 = () => {
    const newErrors = {};

    // Prénom
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est obligatoire';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Nom
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est obligatoire';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    // Téléphone (optionnel mais si rempli, doit être valide)
    if (formData.phone && !/^[\d\s+()-]{8,20}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    // Mot de passe (seulement pour inscription normale)
    if (!isGoogleSignup) {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est obligatoire';
      } else {
        // Vérifications détaillées
        const passwordErrors = [];

        if (formData.password.length < 8) {
          passwordErrors.push('au moins 8 caractères');
        }
        if (!/[A-Z]/.test(formData.password)) {
          passwordErrors.push('une lettre majuscule');
        }
        if (!/[a-z]/.test(formData.password)) {
          passwordErrors.push('une lettre minuscule');
        }
        if (!/[0-9]/.test(formData.password)) {
          passwordErrors.push('un chiffre');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
          passwordErrors.push('un caractère spécial');
        }

        if (passwordErrors.length > 0) {
          newErrors.password = `Le mot de passe doit contenir ${passwordErrors.join(', ')}`;
        }
      }

      // Confirmation du mot de passe
      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Veuillez confirmer votre mot de passe';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ VALIDATION ÉTAPE 2 ============
  const validateStep2 = () => {
    const newErrors = {};

    if (formData.account_type === 'professionnel') {
      if (!formData.company_name.trim()) {
        newErrors.company_name = 'Le nom de l\'entreprise est obligatoire';
      } else if (formData.company_name.length < 2) {
        newErrors.company_name = 'Le nom de l\'entreprise doit contenir au moins 2 caractères';
      }

      // ICE (optionnel mais si rempli, doit être valide - 15 chiffres au Maroc)
      if (formData.company_ice && !/^\d{15}$/.test(formData.company_ice.replace(/\s/g, ''))) {
        newErrors.company_ice = 'L\'ICE doit contenir 15 chiffres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setAlert(null);
    }
  };

  const handleBack = () => {
    setStep(1);
    setAlert(null);
  };

  // ============ SOUMISSION ============
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);
    setAlert(null);

    try {
      if (isGoogleSignup) {
        // Google signup flow
        const payload = {
          google_id: googleData.google_id,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          avatar: googleData.avatar,
          phone: formData.phone || null,
          account_type: formData.account_type,
        };

        if (formData.account_type === 'professionnel') {
          payload.company_name = formData.company_name;
          payload.company_ice = formData.company_ice;
          payload.company_address = formData.company_address;
          payload.company_city = formData.company_city;
          payload.company_phone = formData.company_phone;
        }

        const response = await api.post('/auth/google/complete', payload);
        localStorage.setItem('token', response.data.data.token);
      navigate('/dashboard');

      } else {
      
        const payload = {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone || null,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          account_type: formData.account_type,
        };

        if (formData.account_type === 'professionnel') {
          payload.company_name = formData.company_name;
          payload.company_ice = formData.company_ice;
          payload.company_address = formData.company_address;
          payload.company_city = formData.company_city;
          payload.company_phone = formData.company_phone;
        }

        const result = await register(payload);

        if (!result.success) {
          // Gérer les erreurs de validation Laravel
          if (result.errors) {
            setErrors(result.errors);
          }
          setAlert({ type: 'error', message: result.error || 'Une erreur est survenue' });
          return;
        }

      navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur inscription:', error);

      // Gérer les erreurs de validation Laravel (422)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors || {};
        setErrors(validationErrors);

        // Afficher le premier message d'erreur
        const firstError = Object.values(validationErrors)[0];
        setAlert({
          type: 'error',
          message: Array.isArray(firstError) ? firstError[0] : firstError
        });
      } else {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
        });
      }
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

        {/* ============ ÉTAPE 1 ============ */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Jean"
                icon={<UserIcon className="w-5 h-5" />}
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
              icon={<EnvelopeIcon className="w-5 h-5" />}
              error={errors.email}
              required
              disabled={isGoogleSignup}
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6 00 00 00 00"
              icon={<PhoneIcon className="w-5 h-5" />}
              error={errors.phone}
            />

            {/* Mot de passe (seulement pour inscription normale) */}
            {!isGoogleSignup && (
              <>
                <div>
                  <Input
                    label="Mot de passe"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<LockClosedIcon className="w-5 h-5" />}
                    error={errors.password}
                    required
                  />
                  {/* Indicateur de force du mot de passe */}
                  {showPasswordStrength && (
                    <PasswordStrengthIndicator password={formData.password} />
                  )}
                </div>

                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<LockClosedIcon className="w-5 h-5" />}
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

        {/* ============ ÉTAPE 2 ============ */}
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
                  onClick={() => handleChange({ target: { name: 'account_type', value: 'particulier' } })}
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
                  onClick={() => handleChange({ target: { name: 'account_type', value: 'professionnel' } })}
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
                  icon={<BuildingOfficeIcon className="w-5 h-5" />}
                  error={errors.company_name}
                  required
                />

                <Input
                  label="ICE (Identifiant Commun de l'Entreprise)"
                  name="company_ice"
                  value={formData.company_ice}
                  onChange={handleChange}
                  placeholder="000000000000000"
                  icon={<IdentificationIcon className="w-5 h-5" />}
                  error={errors.company_ice}
                />

                <Input
                  label="Adresse"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  placeholder="123 Rue Example"
                  icon={<MapPinIcon className="w-5 h-5" />}
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
                    label="Téléphone entreprise"
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