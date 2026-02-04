// src/components/auth/RegisterPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../layout/AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

// ============ VALIDATION DES MOTS DE PASSE ============
const PasswordStrengthIndicator = ({ password }) => {
  const checks = [
    { label: 'Au moins 8 caractères', valid: password.length >= 8 },
    { label: 'Une lettre majuscule', valid: /[A-Z]/.test(password) },
    { label: 'Une lettre minuscule', valid: /[a-z]/.test(password) },
    { label: 'Un chiffre', valid: /[0-9]/.test(password) },
    { label: 'Un caractère spécial (!@#$%...)', valid: /[!@#$%^&*(),.?":{}|<>+-/=]/.test(password) },
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
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setShowPasswordStrength(value.length > 0);
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ============ VALIDATION ============
  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est obligatoire';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est obligatoire';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    if (formData.phone && !/^[\d\s+()-]{8,20}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else {
      const passwordErrors = [];
      if (formData.password.length < 8) passwordErrors.push('au moins 8 caractères');
      if (!/[A-Z]/.test(formData.password)) passwordErrors.push('une lettre majuscule');
      if (!/[a-z]/.test(formData.password)) passwordErrors.push('une lettre minuscule');
      if (!/[0-9]/.test(formData.password)) passwordErrors.push('un chiffre');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) passwordErrors.push('un caractère spécial');

      if (passwordErrors.length > 0) {
        newErrors.password = `Le mot de passe doit contenir ${passwordErrors.join(', ')}`;
      }
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ SOUMISSION ============
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setAlert(null);

    try {
      const payload = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || null,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const result = await register(payload);

      if (!result.success) {
        if (result.errors) {
          setErrors(result.errors);
        }
        setAlert({ type: 'error', message: result.error || 'Une erreur est survenue' });
        return;
      }

      navigate('/dashboard');

    } catch (error) {
      console.error('Erreur inscription:', error);

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors || {};
        setErrors(validationErrors);

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
      title="Créer un compte"
      subtitle="Rejoignez-nous en quelques secondes"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

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

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="mt-6"
        >
          S'inscrire
        </Button>

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