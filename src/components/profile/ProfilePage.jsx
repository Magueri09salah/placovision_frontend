// src/components/profile/ProfilePage.jsx
import { useState, useRef } from 'react';
import { UserIcon, EnvelopeIcon, PhoneIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const data = { ...formData };
    if (avatar) {
      data.avatar = avatar;
    }

    const result = await updateProfile(data);

    if (result.success) {
      setAlert({ type: 'success', message: 'Profil mis à jour avec succès' });
      setAvatar(null);
    } else {
      setAlert({ type: 'error', message: result.error });
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">Mon profil</h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {alert && (
              <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert(null)} 
              />
            )}

            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-neutral-500">
                Cliquez pour changer votre photo
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                icon={UserIcon}
                required
              />
              <Input
                label="Nom"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={user?.email}
              icon={EnvelopeIcon}
              disabled
              className="opacity-60"
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={PhoneIcon}
              placeholder="+212 6 00 00 00 00"
            />

            {/* Account info */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                Informations du compte
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Type de compte</p>
                  <p className="font-medium text-neutral-800 capitalize">
                    {user?.account_type}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Rôle</p>
                  <p className="font-medium text-neutral-800">
                    {user?.roles?.[0] || 'Utilisateur'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" loading={loading}>
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;