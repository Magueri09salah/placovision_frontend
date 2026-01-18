// src/components/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../layout/AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithToken } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setAlert(null);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    
    setLoading(false);
  };

  return (
    <AuthLayout 
      title="Portail Client" 
      subtitle="Connectez-vous à votre espace"
    >
        <div className="space-y-3 mb-6">
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
            try {
                const res = await api.post('/auth/google', {
                google_token: credentialResponse.credential,
                });

                if (res.data.action === 'login') {
                    await loginWithToken(res.data.data.user, res.data.data.token);
                    navigate('/dashboard');
                }

                if (res.data.action === 'choose_account_type') {
                navigate('/register', {
                    state: {
                    googleData: res.data.data.google_data,
                    },
                });
                }
            } catch (e) {
                setAlert({
                type: 'error',
                message: 'Connexion Google échouée',
                });
            }
            }}
            onError={() => {
            setAlert({
                type: 'error',
                message: 'Connexion Google annulée',
            });
            }}
        />

            <div className="relative text-center text-sm text-neutral-400">
                <span className="bg-white px-2">ou</span>
                <div className="absolute left-0 right-0 top-1/2 border-t" />
            </div>
        </div>


      <form onSubmit={handleSubmit} className="space-y-5">
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)} 
          />
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
          icon={<EnvelopeIcon className="w-5 h-5" />}
          error={errors.email}
          required
          autoComplete="email"
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1 text-sm font-medium text-neutral-700">
              <LockClosedIcon className="w-4 h-4 text-neutral-400" />
              Mot de passe
              <span className="text-primary">*</span>
            </label>
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          className="mt-6"
        >
          Connexion
        </Button>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Pas de compte ?{' '}
          <Link to="/register" className="link">
            Créer un compte
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;