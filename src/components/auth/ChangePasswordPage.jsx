// src/components/auth/ChangePasswordPage.jsx
import { useState } from 'react';
import { LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';

const ChangePasswordPage = () => {
  const { changePassword } = useAuth();
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
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
    
    if (!formData.current_password) {
      newErrors.current_password = 'Le mot de passe actuel est obligatoire';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'Le nouveau mot de passe est obligatoire';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.new_password)) {
      newErrors.new_password = 'Le mot de passe doit contenir majuscule, minuscule, chiffre et symbole';
    }
    
    if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setAlert(null);

    const result = await changePassword(
      formData.current_password,
      formData.new_password,
      formData.new_password_confirmation
    );

    if (result.success) {
      setAlert({ type: 'success', message: 'Mot de passe modifié avec succès' });
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } else {
      setAlert({ type: 'error', message: result.error });
    }

    setLoading(false);
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(formData.new_password);
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
          <ShieldCheckIcon className="w-7 h-7 text-primary" />
          Sécurité
        </h1>

        <Card>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Changer le mot de passe
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {alert && (
              <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert(null)} 
              />
            )}

            <Input
              label="Mot de passe actuel"
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              icon={LockClosedIcon}
              error={errors.current_password}
              required
            />

            <div>
              <Input
                label="Nouveau mot de passe"
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                icon={LockClosedIcon}
                error={errors.new_password}
                required
              />
              
              {/* Password strength indicator */}
              {formData.new_password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < strength ? strengthColors[strength - 1] : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Force: {strengthLabels[strength - 1] || 'Très faible'}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              name="new_password_confirmation"
              value={formData.new_password_confirmation}
              onChange={handleChange}
              error={errors.new_password_confirmation}
              required
            />

            {/* Password requirements */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <p className="text-sm font-medium text-neutral-700 mb-2">
                Le mot de passe doit contenir:
              </p>
              <ul className="space-y-1 text-sm">
                {[
                  { check: formData.new_password.length >= 8, text: 'Au moins 8 caractères' },
                  { check: /[a-z]/.test(formData.new_password), text: 'Une lettre minuscule' },
                  { check: /[A-Z]/.test(formData.new_password), text: 'Une lettre majuscule' },
                  { check: /\d/.test(formData.new_password), text: 'Un chiffre' },
                  { check: /[@$!%*?&]/.test(formData.new_password), text: 'Un symbole (@$!%*?&)' },
                ].map((req, i) => (
                  <li key={i} className={`flex items-center gap-2 ${req.check ? 'text-green-600' : 'text-neutral-500'}`}>
                    <svg className={`w-4 h-4 ${req.check ? 'text-green-500' : 'text-neutral-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      {req.check ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      )}
                    </svg>
                    {req.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" loading={loading}>
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChangePasswordPage;