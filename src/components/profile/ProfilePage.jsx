// src/components/profile/ProfilePage.jsx

import { useState, useRef, useEffect } from 'react';
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
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // ✅ Initialiser les données quand user change
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
      });
      
      // ✅ Construire l'URL complète de l'avatar
      if (user.avatar) {
        // Si l'avatar commence par http, c'est déjà une URL complète (Google)
        if (user.avatar.startsWith('http')) {
          setAvatarPreview(user.avatar);
        } else {
          // Sinon, construire l'URL du storage Laravel
          const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
          setAvatarPreview(`${baseUrl}/storage/${user.avatar}`);
        }
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ✅ Vérification stricte du type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        setAlert({ type: 'error', message: 'Format d\'image non supporté. Utilisez JPG, PNG, GIF, SVG ou WebP.' });
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setAlert({ type: 'error', message: 'L\'image ne doit pas dépasser 2 Mo.' });
        return;
      }
      
      console.log('Fichier sélectionné:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      // ✅ Préparer les données à envoyer
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      };

      // ✅ Ajouter l'avatar seulement s'il y a un nouveau fichier
      if (avatar) {
        dataToSend.avatar = avatar;
      }

      console.log('Envoi des données:', dataToSend);

      const result = await updateProfile(dataToSend);

      console.log('Résultat:', result);

      if (result.success) {
        setAlert({ type: 'success', message: 'Profil mis à jour avec succès !' });
        setAvatar(null); // Reset le fichier sélectionné
      } else {
        setAlert({ type: 'error', message: result.error || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setAlert({ type: 'error', message: 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cleanup URL.createObjectURL quand le composant est démonté
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // ✅ Si l'image ne charge pas, afficher les initiales
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className={`text-3xl font-bold text-primary ${avatarPreview ? 'hidden' : 'flex'}`}
                    style={{ display: avatarPreview ? 'none' : 'flex' }}
                  >
                    {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-neutral-500">
                Cliquez pour changer votre photo (max 2 Mo)
              </p>
              {avatar && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  ✓ Nouvelle image sélectionnée : {avatar.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                icon={<UserIcon className="w-5 h-5" />}
                required
              />
              <Input
                label="Nom"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                icon={<UserIcon className="w-5 h-5" />}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              icon={<EnvelopeIcon className="w-5 h-5" />}
              disabled
              className="opacity-60"
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={<PhoneIcon className="w-5 h-5" />}
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
                    {user?.account_type || '-'}
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
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;