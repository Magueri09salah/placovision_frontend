import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
  UserIcon,
  CubeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { quotationAPI } from '../../services/api';

// Product catalog with categories, subcategories, and specifications
const PRODUCT_CATALOG = {
  Plaques: {
    'Plaque Feu': [
      { id: 'pf-12.5', epaisseur: '12.5 mm', dimensions: '(2000–3000) × 1200 mm', price: 15.50, unit: 'm²', coveragePerPiece: 3.33 },
      { id: 'pf-15', epaisseur: '15 mm', dimensions: '(2000–3000) × 1200 mm', price: 18.75, unit: 'm²', coveragePerPiece: 3.33 },
      { id: 'pf-18', epaisseur: '18 mm', dimensions: '(2000–3000) × 1200 mm', price: 22.00, unit: 'm²', coveragePerPiece: 3.33 }
    ],
    'Plaque Hydro': [
      { id: 'ph-12.5', epaisseur: '12.5 mm', dimensions: '(2000–3000) × 1200 mm', price: 14.00, unit: 'm²', coveragePerPiece: 3.33 },
      { id: 'ph-15', epaisseur: '15 mm', dimensions: '(2000–3000) × 1200 mm', price: 17.25, unit: 'm²', coveragePerPiece: 3.33 },
      { id: 'ph-18', epaisseur: '18 mm', dimensions: '(2000–3000) × 1200 mm', price: 20.50, unit: 'm²', coveragePerPiece: 3.33 }
    ],
    'Plaque Standard': [
      { id: 'ps-10', epaisseur: '10 mm', dimensions: '(2000–2600) × 1200 mm', price: 8.50, unit: 'm²', coveragePerPiece: 3.12 },
      { id: 'ps-12.5', epaisseur: '12.5 mm', dimensions: '(2000–3000) × 1200 mm', price: 10.00, unit: 'm²', coveragePerPiece: 3.33 },
      { id: 'ps-15', epaisseur: '15 mm', dimensions: '(2000–3000) × 1200 mm', price: 12.50, unit: 'm²', coveragePerPiece: 3.33 }
    ]
  },
  Ossature: {
    'Montant': [
      { id: 'om-48', epaisseur: '48 mm', dimensions: '3000 mm', price: 3.20, unit: 'unité', coveragePerPiece: null },
      { id: 'om-70', epaisseur: '70 mm', dimensions: '3000 mm', price: 4.10, unit: 'unité', coveragePerPiece: null },
      { id: 'om-90', epaisseur: '90 mm', dimensions: '3000 mm', price: 5.00, unit: 'unité', coveragePerPiece: null }
    ],
    'Rail': [
      { id: 'or-48', epaisseur: '48 mm', dimensions: '3000 mm', price: 2.80, unit: 'unité', coveragePerPiece: null },
      { id: 'or-70', epaisseur: '70 mm', dimensions: '3000 mm', price: 3.50, unit: 'unité', coveragePerPiece: null },
      { id: 'or-90', epaisseur: '90 mm', dimensions: '3000 mm', price: 4.20, unit: 'unité', coveragePerPiece: null }
    ],
    'Fourrure': [
      { id: 'of-standard', epaisseur: '18 mm', dimensions: '3000 mm', price: 2.10, unit: 'unité', coveragePerPiece: null }
    ]
  },
  Isolation: {
    'Laine de Verre': [
      { id: 'ilv-45', epaisseur: '45 mm', dimensions: 'Rouleau 12 m²', price: 35.00, unit: 'rouleau', coveragePerPiece: 12 },
      { id: 'ilv-75', epaisseur: '75 mm', dimensions: 'Rouleau 10 m²', price: 45.00, unit: 'rouleau', coveragePerPiece: 10 },
      { id: 'ilv-100', epaisseur: '100 mm', dimensions: 'Rouleau 8 m²', price: 55.00, unit: 'rouleau', coveragePerPiece: 8 }
    ],
    'Laine de Roche': [
      { id: 'ilr-45', epaisseur: '45 mm', dimensions: 'Panneau 6 m²', price: 42.00, unit: 'panneau', coveragePerPiece: 6 },
      { id: 'ilr-75', epaisseur: '75 mm', dimensions: 'Panneau 5 m²', price: 58.00, unit: 'panneau', coveragePerPiece: 5 },
      { id: 'ilr-100', epaisseur: '100 mm', dimensions: 'Panneau 4 m²', price: 72.00, unit: 'panneau', coveragePerPiece: 4 }
    ],
    'Polystyrène': [
      { id: 'ip-30', epaisseur: '30 mm', dimensions: 'Panneau 1.2 × 0.6 m', price: 8.50, unit: 'panneau', coveragePerPiece: 0.72 },
      { id: 'ip-50', epaisseur: '50 mm', dimensions: 'Panneau 1.2 × 0.6 m', price: 12.00, unit: 'panneau', coveragePerPiece: 0.72 },
      { id: 'ip-80', epaisseur: '80 mm', dimensions: 'Panneau 1.2 × 0.6 m', price: 16.50, unit: 'panneau', coveragePerPiece: 0.72 }
    ]
  },
  Finition: {
    'Enduit': [
      { id: 'fe-joint', epaisseur: 'N/A', dimensions: 'Sac 25 kg', price: 12.00, unit: 'sac', coveragePerPiece: null },
      { id: 'fe-finition', epaisseur: 'N/A', dimensions: 'Sac 25 kg', price: 15.00, unit: 'sac', coveragePerPiece: null }
    ],
    'Bande à Joint': [
      { id: 'fb-papier', epaisseur: 'Papier', dimensions: 'Rouleau 150 m', price: 8.00, unit: 'rouleau', coveragePerPiece: null },
      { id: 'fb-fibre', epaisseur: 'Fibre de verre', dimensions: 'Rouleau 90 m', price: 14.00, unit: 'rouleau', coveragePerPiece: null }
    ],
    'Visserie': [
      { id: 'fv-25', epaisseur: '25 mm', dimensions: 'Boîte 1000 pcs', price: 18.00, unit: 'boîte', coveragePerPiece: null },
      { id: 'fv-35', epaisseur: '35 mm', dimensions: 'Boîte 1000 pcs', price: 20.00, unit: 'boîte', coveragePerPiece: null },
      { id: 'fv-45', epaisseur: '45 mm', dimensions: 'Boîte 500 pcs', price: 16.00, unit: 'boîte', coveragePerPiece: null }
    ]
  }
};

const CATEGORIES = Object.keys(PRODUCT_CATALOG);

const STEPS = [
  { id: 1, name: 'Client', icon: UserIcon },
  { id: 2, name: 'Produits', icon: CubeIcon },
  { id: 3, name: 'Récapitulatif', icon: DocumentTextIcon }
];

const QuotationFormPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    site_address: '',
    site_city: '',
    work_type: 'cloison'
  });

  const [productRows, setProductRows] = useState([
    { id: Date.now(), category: '', subcategory: '', specification: '', quantity: 1, surface: '', suggestedQuantity: null, quantityModified: false }
  ]);

  const workTypeOptions = [
    { value: 'cloison', label: 'Cloison' },
    { value: 'plafond', label: 'Plafond' },
    { value: 'doublage', label: 'Doublage' },
    { value: 'habillage', label: 'Habillage' }
  ];

  const categoryOptions = CATEGORIES.map(cat => ({ value: cat, label: cat }));

  const getSubcategories = (category) => {
    if (!category || !PRODUCT_CATALOG[category]) return [];
    return Object.keys(PRODUCT_CATALOG[category]).map(sub => ({ value: sub, label: sub }));
  };

  const getSpecifications = (category, subcategory) => {
    if (!category || !subcategory || !PRODUCT_CATALOG[category]?.[subcategory]) return [];
    return PRODUCT_CATALOG[category][subcategory].map(spec => ({
      value: spec.id,
      label: `${spec.epaisseur} - ${spec.dimensions}`,
      price: spec.price,
      unit: spec.unit
    }));
  };

  const getProductInfo = (category, subcategory, specificationId) => {
    if (!category || !subcategory || !specificationId) return null;
    const specs = PRODUCT_CATALOG[category]?.[subcategory] || [];
    return specs.find(s => s.id === specificationId) || null;
  };

  const totalAmount = useMemo(() => {
    return productRows.reduce((sum, row) => {
      const productInfo = getProductInfo(row.category, row.subcategory, row.specification);
      if (!productInfo) return sum;
      const quantity = row.quantity || 0;
      // Price is per piece/unit, so total = price * quantity
      return sum + (productInfo.price * quantity);
    }, 0);
  }, [productRows]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProductRowChange = (rowId, field, value) => {
    setProductRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const updated = { ...row, [field]: value };
      
      if (field === 'category') {
        updated.subcategory = '';
        updated.specification = '';
        updated.quantity = 1;
        updated.suggestedQuantity = null;
      } else if (field === 'subcategory') {
        updated.specification = '';
        updated.quantity = 1;
        updated.suggestedQuantity = null;
      } else if (field === 'specification') {
        // When specification changes, recalculate quantity based on current surface
        const productInfo = getProductInfo(row.category, row.subcategory, value);
        if (productInfo?.coveragePerPiece && updated.surface) {
          const surface = parseFloat(updated.surface) || 0;
          const suggestedQty = Math.ceil(surface / productInfo.coveragePerPiece);
          updated.quantity = suggestedQty;
          updated.suggestedQuantity = suggestedQty;
        }
      } else if (field === 'surface') {
        // When surface changes, auto-calculate quantity if product has coverage info
        const productInfo = getProductInfo(row.category, row.subcategory, row.specification);
        if (productInfo?.coveragePerPiece) {
          const surface = parseFloat(value) || 0;
          const suggestedQty = Math.ceil(surface / productInfo.coveragePerPiece);
          updated.quantity = suggestedQty;
          updated.suggestedQuantity = suggestedQty;
        }
      } else if (field === 'quantity') {
        // User manually changed quantity, keep track that it's modified
        updated.quantityModified = true;
      }
      
      return updated;
    }));
  };

  const addProductRow = () => {
    setProductRows(prev => [
      ...prev,
      { id: Date.now(), category: '', subcategory: '', specification: '', quantity: 1, surface: '', suggestedQuantity: null, quantityModified: false }
    ]);
  };

  const removeProductRow = (rowId) => {
    if (productRows.length === 1) return;
    setProductRows(prev => prev.filter(row => row.id !== rowId));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.client_name.trim()) newErrors.client_name = ['Le nom du client est requis'];
    if (!formData.site_address.trim()) newErrors.site_address = ['L\'adresse du chantier est requise'];
    if (!formData.site_city.trim()) newErrors.site_city = ['La ville est requise'];
    if (formData.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
      newErrors.client_email = ['Email invalide'];
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const validRows = productRows.filter(row => {
      if (!row.category || !row.subcategory || !row.specification) return false;
      const quantity = row.quantity || 0;
      return quantity > 0;
    });

    if (validRows.length === 0) {
      setFormError('Veuillez ajouter au moins un produit complet avec une quantité.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFormError(null);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setFormError(null);

    const validRows = productRows.filter(row => {
      if (!row.category || !row.subcategory || !row.specification) return false;
      const quantity = row.quantity || 0;
      return quantity > 0;
    });

    try {
      const measurements = validRows.map(row => {
        const productInfo = getProductInfo(row.category, row.subcategory, row.specification);
        const surface = parseFloat(row.surface) || 0;
        const quantity = row.quantity || 0;
        const total = productInfo.price * quantity;

        return {
          description: `${row.category} - ${row.subcategory} (${productInfo.epaisseur})`,
          surface,
          quantity,
          unit: productInfo.unit,
          unit_price: productInfo.price,
          total
        };
      });

      const payload = {
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        site_address: formData.site_address,
        site_city: formData.site_city,
        work_type: formData.work_type,
        measurements,
        total_amount: totalAmount
      };

      await quotationAPI.createQuotation(payload);
      navigate('/quotations');
    } catch (error) {
      const response = error.response;
      if (response?.status === 422) {
        setErrors(response.data.errors || {});
      } else {
        setFormError(response?.data?.message || 'Une erreur inattendue est survenue.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Step 1: Client Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-neutral-800 mb-6 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-600" />
          Informations client
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Nom du client"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              error={errors.client_name?.[0]}
              required
              placeholder="Entrez le nom du client"
            />
          </div>
          <Input
            label="Email"
            name="client_email"
            type="email"
            value={formData.client_email}
            onChange={handleChange}
            error={errors.client_email?.[0]}
            placeholder="email@exemple.com"
          />
          <Input
            label="Téléphone"
            name="client_phone"
            value={formData.client_phone}
            onChange={handleChange}
            error={errors.client_phone?.[0]}
            placeholder="+212 6XX XXX XXX"
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-neutral-800 mb-6 flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-indigo-600" />
          Informations chantier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Adresse du chantier"
              name="site_address"
              value={formData.site_address}
              onChange={handleChange}
              error={errors.site_address?.[0]}
              required
              placeholder="Entrez l'adresse complète"
            />
          </div>
          <Input
            label="Ville"
            name="site_city"
            value={formData.site_city}
            onChange={handleChange}
            error={errors.site_city?.[0]}
            required
            placeholder="Casablanca"
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Type d'ouvrage
            </label>
            <select
              name="work_type"
              value={formData.work_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              {workTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  // Step 2: Products
  const renderStep2 = () => (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          <CubeIcon className="w-5 h-5 text-indigo-600" />
          Sélection des produits
        </h2>
        <Button
          type="button"
          variant="outline"
          onClick={addProductRow}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un produit
        </Button>
      </div>

      <div className="space-y-4">
        {productRows.map((row, index) => {
          const subcategories = getSubcategories(row.category);
          const specifications = getSpecifications(row.category, row.subcategory);
          const productInfo = getProductInfo(row.category, row.subcategory, row.specification);
          const unitPrice = productInfo?.price || 0;
          const surface = parseFloat(row.surface) || 0;
          const quantity = row.quantity || 0;
          const rowTotal = unitPrice * quantity; // Price per piece * quantity

          return (
            <div
              key={row.id}
              className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">
                  Produit #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeProductRow(row.id)}
                  disabled={productRows.length === 1}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Catégorie
                  </label>
                  <select
                    value={row.category}
                    onChange={(e) => handleProductRowChange(row.id, 'category', e.target.value)}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                  >
                    <option value="">Sélectionner...</option>
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Sous-catégorie
                  </label>
                  <select
                    value={row.subcategory}
                    onChange={(e) => handleProductRowChange(row.id, 'subcategory', e.target.value)}
                    disabled={!row.category}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Sélectionner...</option>
                    {subcategories.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Spécifications
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={row.specification}
                      onChange={(e) => handleProductRowChange(row.id, 'specification', e.target.value)}
                      disabled={!row.subcategory}
                      className="flex-1 px-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Sélectionner...</option>
                      {specifications.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {productInfo && (
                      <div className="relative group">
                        <InformationCircleIcon className="w-5 h-5 text-indigo-500 cursor-help flex-shrink-0" />
                        <div className="absolute z-50 bottom-full right-0 mb-2 hidden group-hover:block w-56">
                          <div className="bg-neutral-800 text-white text-xs rounded-lg p-3 shadow-lg">
                            <div className="font-semibold mb-2 text-indigo-300">{row.subcategory}</div>
                            <div className="space-y-1">
                              <p><span className="text-neutral-400">Épaisseur:</span> {productInfo.epaisseur}</p>
                              <p><span className="text-neutral-400">Dimensions:</span> {productInfo.dimensions}</p>
                              <p><span className="text-neutral-400">Prix:</span> {productInfo.price.toFixed(2)} €/{productInfo.unit}</p>
                            </div>
                            <div className="absolute bottom-0 right-4 translate-y-full">
                              <div className="border-8 border-transparent border-t-neutral-800"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {/* Surface */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Surface (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 25"
                    value={row.surface}
                    onChange={(e) => handleProductRowChange(row.id, 'surface', e.target.value)}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm text-center"
                  />
                  {productInfo?.coveragePerPiece && (
                    <p className="text-xs text-neutral-500 mt-1 text-center">
                      1 pièce ≈ {productInfo.coveragePerPiece} m²
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Quantité (pièces)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => handleProductRowChange(row.id, 'quantity', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm text-center ${
                        row.suggestedQuantity && row.quantity === row.suggestedQuantity
                          ? 'border-green-300 bg-green-50'
                          : 'border-neutral-300'
                      }`}
                    />
                  </div>
                  {row.suggestedQuantity && (
                    <p className="text-xs text-green-600 mt-1 text-center flex items-center justify-center gap-1">
                      <CheckIcon className="w-3 h-3" />
                      Suggestion: {row.suggestedQuantity} pièces
                    </p>
                  )}
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Prix unitaire
                  </label>
                  <div className="px-3 py-2.5 bg-neutral-100 rounded-lg text-sm text-center font-medium text-neutral-700">
                    {unitPrice > 0 ? `${unitPrice.toFixed(2)} €` : '—'}
                  </div>
                </div>

                {/* Row Total */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Total ligne
                  </label>
                  <div className="px-3 py-2.5 bg-indigo-50 rounded-lg text-sm text-center font-semibold text-indigo-700">
                    {rowTotal > 0 ? `${rowTotal.toFixed(2)} €` : '—'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex justify-end items-center gap-4">
          <span className="text-lg font-medium text-neutral-700">Total du devis :</span>
          <span className="text-2xl font-bold text-indigo-600">{totalAmount.toFixed(2)} €</span>
        </div>
      </div>
    </Card>
  );

  // Step 3: Summary
  const renderStep3 = () => {
    const validRows = productRows.filter(row => {
      if (!row.category || !row.subcategory || !row.specification) return false;
      const quantity = row.quantity || 0;
      return quantity > 0;
    });

    return (
      <div className="space-y-6">
        {/* Client Summary */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            Récapitulatif client
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Nom:</span>
              <span className="ml-2 font-medium text-neutral-800">{formData.client_name}</span>
            </div>
            {formData.client_email && (
              <div>
                <span className="text-neutral-500">Email:</span>
                <span className="ml-2 font-medium text-neutral-800">{formData.client_email}</span>
              </div>
            )}
            {formData.client_phone && (
              <div>
                <span className="text-neutral-500">Téléphone:</span>
                <span className="ml-2 font-medium text-neutral-800">{formData.client_phone}</span>
              </div>
            )}
            <div>
              <span className="text-neutral-500">Adresse:</span>
              <span className="ml-2 font-medium text-neutral-800">{formData.site_address}, {formData.site_city}</span>
            </div>
            <div>
              <span className="text-neutral-500">Type d'ouvrage:</span>
              <span className="ml-2 font-medium text-neutral-800 capitalize">{formData.work_type}</span>
            </div>
          </div>
        </Card>

        {/* Products Summary */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <CubeIcon className="w-5 h-5 text-indigo-600" />
            Récapitulatif produits
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-2 font-medium text-neutral-600">Produit</th>
                  <th className="text-center py-3 px-2 font-medium text-neutral-600">Surface</th>
                  <th className="text-center py-3 px-2 font-medium text-neutral-600">Qté (pièces)</th>
                  <th className="text-right py-3 px-2 font-medium text-neutral-600">Prix unit.</th>
                  <th className="text-right py-3 px-2 font-medium text-neutral-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {validRows.map((row, index) => {
                  const productInfo = getProductInfo(row.category, row.subcategory, row.specification);
                  const surface = parseFloat(row.surface) || 0;
                  const quantity = row.quantity || 0;
                  const rowTotal = productInfo.price * quantity; // Price per piece * quantity

                  return (
                    <tr key={row.id} className="border-b border-neutral-100">
                      <td className="py-3 px-2">
                        <div className="font-medium text-neutral-800">{row.subcategory}</div>
                        <div className="text-neutral-500 text-xs">{productInfo.epaisseur} - {productInfo.dimensions}</div>
                      </td>
                      <td className="py-3 px-2 text-center text-neutral-700">{surface > 0 ? `${surface} m²` : '—'}</td>
                      <td className="py-3 px-2 text-center text-neutral-700">{quantity}</td>
                      <td className="py-3 px-2 text-right text-neutral-700">{productInfo.price.toFixed(2)} €</td>
                      <td className="py-3 px-2 text-right font-medium text-neutral-800">{rowTotal.toFixed(2)} €</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-indigo-50">
                  <td colSpan="4" className="py-4 px-2 text-right font-semibold text-neutral-800">
                    Total du devis :
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-xl text-indigo-600">
                    {totalAmount.toFixed(2)} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/quotations">
            <Button variant="outline" className="flex items-center gap-2 mb-4">
              <ArrowLeftIcon className="w-4 h-4" />
              Retour aux devis
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-800">Nouveau devis</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckIcon className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? 'text-indigo-600' : 'text-neutral-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-colors ${
                      currentStep > step.id ? 'bg-indigo-600' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {formError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p>{formError}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Précédent
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Link to="/quotations">
              <Button variant="outline">Annuler</Button>
            </Link>
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Suivant
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <CheckIcon className="w-5 h-5" />
                {saving ? 'Création...' : 'Créer le devis'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuotationFormPage;