// src/pages/QuotationFormPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { quotationAPI } from '../../services/quotationApi';

// ============ ICONS ============
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const ArrowPathIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

// ============ CONSTANTES ============

const ROOM_TYPES = [
  { value: 'salon_sejour', label: 'Salon / Séjour', icon: '🛋️' },
  { value: 'chambre', label: 'Chambre', icon: '🛏️' },
  { value: 'cuisine', label: 'Cuisine', icon: '🍳' },
  { value: 'salle_de_bain', label: 'Salle de bain', icon: '🚿' },
  { value: 'wc', label: 'WC', icon: '🚽' },
  { value: 'bureau', label: 'Bureau', icon: '💼' },
  { value: 'garage', label: 'Garage / Local technique', icon: '🚗' },
  { value: 'exterieur', label: 'Extérieur', icon: '🌳' },
  { value: 'autre', label: 'Autre', icon: '📦' },
];

// ✅ 5 types d'ouvrages selon DTU 25.41
const WORK_TYPES = [
  { value: 'habillage_mur', label: 'Habillage BA13 / Contre-cloison', unit: 'm2', unitLabel: 'm²', icon: '🧱', description: 'Ouvrage vertical – 1 face' },
  { value: 'cloison_simple', label: 'Cloison simple ossature', unit: 'm2', unitLabel: 'm²', icon: '🚪', description: 'M48 / M70 / M90' },
  { value: 'cloison_double', label: 'Cloison double ossature', unit: 'm2', unitLabel: 'm²', icon: '🚪', description: 'Épaisseur ≥ 140mm' },
  { value: 'gaine_technique', label: 'Gaine technique BA13', unit: 'm2', unitLabel: 'm²', icon: '📏', description: 'Ouvrage vertical technique' },
  { value: 'plafond_ba13', label: 'Plafond BA13', unit: 'm2', unitLabel: 'm²', icon: '⬆️', description: 'Sur ossature métallique' },
];

const STEPS = [
  { id: 1, name: 'Client' },
  { id: 2, name: 'Pièces' },
  { id: 3, name: 'Travaux' },
  { id: 4, name: 'Récapitulatif' },
];

// ============ PRIX UNITAIRES ============
const PRIX_UNITAIRES = {
  plaque_ba13_standard: 24.12,
  plaque_hydro: 34.20,
  plaque_feu: 0,
  montant_48: 26.16,
  montant_70: 33.00,
  montant_90: 0,
  rail_48: 21.12,
  rail_70: 28.20,
  rail_90: 0,
  fourrure: 21.12,
  isolant: 0, // par m²
  vis_25mm_boite: 62.40, // boîte de 1000
  vis_9mm_boite: 69.60, // boîte de 1000
  suspente: 0.00,
  corniere: 13.44,
  bande_joint_150: 48.00, // rouleau 150m
  bande_joint_300: 85.00, // rouleau 300m
  enduit_sac: 163.20, // sac de 25kg
};

// ============ PLAQUE SELON TYPE DE PIÈCE ============
const PLAQUE_BY_ROOM = {
  salon_sejour: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
  chambre: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
  cuisine: { designation: 'Plaque Hydro', prix: PRIX_UNITAIRES.plaque_hydro },
  salle_de_bain: { designation: 'Plaque Hydro', prix: PRIX_UNITAIRES.plaque_hydro },
  wc: { designation: 'Plaque Hydro', prix: PRIX_UNITAIRES.plaque_hydro },
  bureau: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
  garage: { designation: 'Plaque Feu', prix: PRIX_UNITAIRES.plaque_feu },
  exterieur: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
  autre: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
};

// ============ CONSTANTES DTU 25.41 ============
const DTU = {
  ENTRAXE: 0.60, // 60 cm
  PLAQUE_SURFACE: 3.00, // m² par plaque (120 × 250 cm)
  PROFIL_LONGUEUR: 3.00, // m par profil
  VIS_PAR_BOITE: 1000,
  KG_PAR_SAC_ENDUIT: 25,
};

// ============ FONCTIONS DE CALCUL DTU 25.41 ============

/**
 * Arrondi à l'unité supérieure (règle DTU)
 */
const arrondiSup = (value) => Math.ceil(value);

/**
 * Convertit les vis en boîtes (1 boîte = 1000 vis, minimum 1)
 */
const visToBoites = (nombreVis) => {
  if (nombreVis <= 0) return 0;
  return Math.max(1, Math.ceil(nombreVis / DTU.VIS_PAR_BOITE));
};

/**
 * Convertit les kg d'enduit en sacs (1 sac = 25 kg)
 */
const kgToSacs = (kg) => {
  if (kg <= 0) return 0;
  return Math.ceil(kg / DTU.KG_PAR_SAC_ENDUIT);
};

/**
 * Convertit les mètres linéaires de bande à joint en rouleaux
 */
const bandeToRouleaux = (ml) => {
  if (ml <= 0) return { designation: 'Bande à joint 150m', quantity: 0, prix: PRIX_UNITAIRES.bande_joint_150 };
  
  if (ml <= 150) {
    return { designation: 'Bande à joint 150m', quantity: 1, prix: PRIX_UNITAIRES.bande_joint_150 };
  } else if (ml <= 300) {
    return { designation: 'Bande à joint 300m', quantity: 1, prix: PRIX_UNITAIRES.bande_joint_300 };
  } else {
    const nbRouleaux = Math.ceil(ml / 300);
    return { designation: 'Bande à joint 300m', quantity: nbRouleaux, prix: PRIX_UNITAIRES.bande_joint_300 };
  }
};

/**
 * Calcul des matériaux selon le type d'ouvrage - DTU 25.41
 */
const calculateMaterialsForWork = (workType, longueur, hauteur, roomType) => {
  const L = parseFloat(longueur) || 0;
  const H = parseFloat(hauteur) || 0;
  const surface = L * H;
  
  if (surface <= 0) return [];

  const plaque = PLAQUE_BY_ROOM[roomType] || PLAQUE_BY_ROOM.autre;
  const materials = [];
  let itemIndex = 0;

  const addMaterial = (designation, quantity, unit, unitPrice) => {
    materials.push({
      id: `${workType}-${itemIndex++}`,
      designation,
      quantity_calculated: quantity,
      quantity_adjusted: quantity,
      unit,
      unit_price: unitPrice,
      total_ht: quantity * unitPrice,
      is_modified: false,
    });
  };

  switch (workType) {
    // ============ 1. HABILLAGE BA13 / CONTRE-CLOISON ============
    case 'habillage_mur': {
      // Plaques BA13 = Surface ÷ 3
      const nbPlaques = arrondiSup(surface / DTU.PLAQUE_SURFACE);
      addMaterial(plaque.designation, nbPlaques, 'unité', plaque.prix);

      // Montants = (L ÷ 0,60) + 1
      const nbMontants = arrondiSup((L / DTU.ENTRAXE) + 1);
      addMaterial('Montant 48', nbMontants, 'unité', PRIX_UNITAIRES.montant_48);

      // Rails = (L × 2) ÷ 3,00
      const nbRails = arrondiSup((L * 2) / DTU.PROFIL_LONGUEUR);
      addMaterial('Rail 48', nbRails, 'unité', PRIX_UNITAIRES.rail_48);

      // Isolant = Surface (m²)
      const isolant = arrondiSup(surface);
      addMaterial('Isolant (laine de verre)', isolant, 'm²', PRIX_UNITAIRES.isolant);

      // Vis TTPC 25 mm ≈ 20 vis / m²
      const vis25 = arrondiSup(surface * 20);
      const boitesVis25 = visToBoites(vis25);
      addMaterial('Vis TTPC 25 mm', boitesVis25, 'boîte', PRIX_UNITAIRES.vis_25mm_boite);

      // Vis TTPC 9 mm ≈ 3 vis / m²
      const vis9 = arrondiSup(surface * 3);
      const boitesVis9 = visToBoites(vis9);
      addMaterial('Vis TTPC 9 mm', boitesVis9, 'boîte', PRIX_UNITAIRES.vis_9mm_boite);

      // Bandes à joint ≈ 3 ml / m²
      const bandeML = arrondiSup(surface * 3);
      const bande = bandeToRouleaux(bandeML);
      addMaterial(bande.designation, bande.quantity, 'rlx', bande.prix);

      // Enduit ≈ 0,5 kg / m²
      const enduitKg = surface * 0.5;
      const enduitSacs = kgToSacs(enduitKg);
      addMaterial('Enduit', enduitSacs, 'sac', PRIX_UNITAIRES.enduit_sac);

      break;
    }

    // ============ 2. CLOISON SIMPLE OSSATURE ============
    case 'cloison_simple': {
      // Plaques BA13 = (Surface × 2) ÷ 3 (2 faces)
      const nbPlaques = arrondiSup((surface * 2) / DTU.PLAQUE_SURFACE);
      addMaterial(plaque.designation, nbPlaques, 'unité', plaque.prix);

      // Montants = (L ÷ 0,60) + 1
      const nbMontants = arrondiSup((L / DTU.ENTRAXE) + 1);
      addMaterial('Montant 70', nbMontants, 'unité', PRIX_UNITAIRES.montant_70);

      // Rails = (L × 2) ÷ 3,00
      const nbRails = arrondiSup((L * 2) / DTU.PROFIL_LONGUEUR);
      addMaterial('Rail 70', nbRails, 'unité', PRIX_UNITAIRES.rail_70);

      // Isolant = Surface (m²)
      const isolant = arrondiSup(surface);
      addMaterial('Isolant (laine de verre)', isolant, 'm²', PRIX_UNITAIRES.isolant);

      // Vis TTPC 25 mm ≈ 40 vis / m²
      const vis25 = arrondiSup(surface * 40);
      const boitesVis25 = visToBoites(vis25);
      addMaterial('Vis TTPC 25 mm', boitesVis25, 'boîte', PRIX_UNITAIRES.vis_25mm_boite);

      // Vis TTPC 9 mm ≈ 4 vis / m²
      const vis9 = arrondiSup(surface * 4);
      const boitesVis9 = visToBoites(vis9);
      addMaterial('Vis TTPC 9 mm', boitesVis9, 'boîte', PRIX_UNITAIRES.vis_9mm_boite);

      // Bandes à joint ≈ 6 ml / m²
      const bandeML = arrondiSup(surface * 6);
      const bande = bandeToRouleaux(bandeML);
      addMaterial(bande.designation, bande.quantity, 'rlx', bande.prix);

      // Enduit ≈ 1 kg / m²
      const enduitKg = surface * 1;
      const enduitSacs = kgToSacs(enduitKg);
      addMaterial('Enduit', enduitSacs, 'sac', PRIX_UNITAIRES.enduit_sac);

      break;
    }

    // ============ 3. CLOISON DOUBLE OSSATURE ============
    case 'cloison_double': {
      // Plaques BA13 = (Surface × 2) ÷ 3 (2 faces)
      const nbPlaques = arrondiSup((surface * 2) / DTU.PLAQUE_SURFACE);
      addMaterial(plaque.designation, nbPlaques, 'unité', plaque.prix);

      // Montants = 2 × ((L ÷ 0,60) + 1) (double ossature)
      const nbMontants = arrondiSup(2 * ((L / DTU.ENTRAXE) + 1));
      addMaterial('Montant 70', nbMontants, 'unité', PRIX_UNITAIRES.montant_70);

      // Rails = 2 × ((L × 2) ÷ 3,00)
      const nbRails = arrondiSup(2 * ((L * 2) / DTU.PROFIL_LONGUEUR));
      addMaterial('Rail 70', nbRails, 'unité', PRIX_UNITAIRES.rail_70);

      // Isolant = Surface × 2 (m²)
      const isolant = arrondiSup(surface * 2);
      addMaterial('Isolant (laine de verre)', isolant, 'm²', PRIX_UNITAIRES.isolant);

      // Vis TTPC 25 mm ≈ 45 vis / m²
      const vis25 = arrondiSup(surface * 45);
      const boitesVis25 = visToBoites(vis25);
      addMaterial('Vis TTPC 25 mm', boitesVis25, 'boîte', PRIX_UNITAIRES.vis_25mm_boite);

      // Vis TTPC 9 mm ≈ 6 vis / m²
      const vis9 = arrondiSup(surface * 6);
      const boitesVis9 = visToBoites(vis9);
      addMaterial('Vis TTPC 9 mm', boitesVis9, 'boîte', PRIX_UNITAIRES.vis_9mm_boite);

      // Bandes à joint ≈ 6 ml / m²
      const bandeML = arrondiSup(surface * 6);
      const bande = bandeToRouleaux(bandeML);
      addMaterial(bande.designation, bande.quantity, 'rlx', bande.prix);

      // Enduit ≈ 1,2 kg / m²
      const enduitKg = surface * 1.2;
      const enduitSacs = kgToSacs(enduitKg);
      addMaterial('Enduit', enduitSacs, 'sac', PRIX_UNITAIRES.enduit_sac);

      break;
    }

    // ============ 4. GAINE TECHNIQUE BA13 ============
    case 'gaine_technique': {
      // Plaques BA13 = Surface ÷ 3
      const nbPlaques = arrondiSup(surface / DTU.PLAQUE_SURFACE);
      addMaterial(plaque.designation, nbPlaques, 'unité', plaque.prix);

      // Montants = (L ÷ 0,60) + 1 (L = développement)
      const nbMontants = arrondiSup((L / DTU.ENTRAXE) + 1);
      addMaterial('Montant 48', nbMontants, 'unité', PRIX_UNITAIRES.montant_48);

      // Rails = (L × 2) ÷ 3,00
      const nbRails = arrondiSup((L * 2) / DTU.PROFIL_LONGUEUR);
      addMaterial('Rail 48', nbRails, 'unité', PRIX_UNITAIRES.rail_48);

      // Vis TTPC 25 mm ≈ 15 vis / m²
      const vis25 = arrondiSup(surface * 15);
      const boitesVis25 = visToBoites(vis25);
      addMaterial('Vis TTPC 25 mm', boitesVis25, 'boîte', PRIX_UNITAIRES.vis_25mm_boite);

      // Vis TTPC 9 mm ≈ 3 vis / m²
      const vis9 = arrondiSup(surface * 3);
      const boitesVis9 = visToBoites(vis9);
      addMaterial('Vis TTPC 9 mm', boitesVis9, 'boîte', PRIX_UNITAIRES.vis_9mm_boite);

      // Bandes à joint ≈ 2 ml / m²
      const bandeML = arrondiSup(surface * 2);
      const bande = bandeToRouleaux(bandeML);
      addMaterial(bande.designation, bande.quantity, 'rlx', bande.prix);

      // Enduit ≈ 0,3 kg / m²
      const enduitKg = surface * 0.3;
      const enduitSacs = kgToSacs(enduitKg);
      addMaterial('Enduit', enduitSacs, 'sac', PRIX_UNITAIRES.enduit_sac);

      break;
    }

    // ============ 5. PLAFOND BA13 ============
    case 'plafond_ba13': {
      // Pour le plafond: L = longueur, H = largeur (l)
      const l = H; // largeur
      
      // Plaques BA13 = Surface ÷ 3
      const nbPlaques = arrondiSup(surface / DTU.PLAQUE_SURFACE);
      addMaterial(plaque.designation, nbPlaques, 'unité', plaque.prix);

      // Fourrures = (l ÷ 0,60) × L ÷ 3,00
      const nbFourrures = arrondiSup((l / DTU.ENTRAXE) * L / DTU.PROFIL_LONGUEUR);
      addMaterial('Fourrure', nbFourrures, 'unité', PRIX_UNITAIRES.fourrure);

      // Suspentes ≈ Surface × 2,5
      const nbSuspentes = arrondiSup(surface * 2.5);
      addMaterial('Suspente', nbSuspentes, 'unité', PRIX_UNITAIRES.suspente);

      // Cornières périphériques = ((L + l) × 2) ÷ 3,00
      const nbCornieres = arrondiSup(((L + l) * 2) / DTU.PROFIL_LONGUEUR);
      addMaterial('Cornière périphérique', nbCornieres, 'unité', PRIX_UNITAIRES.corniere);

      // Vis TTPC 25 mm ≈ 22 vis / m²
      const vis25 = arrondiSup(surface * 22);
      const boitesVis25 = visToBoites(vis25);
      addMaterial('Vis TTPC 25 mm', boitesVis25, 'boîte', PRIX_UNITAIRES.vis_25mm_boite);

      // Bandes à joint ≈ 3 ml / m²
      const bandeML = arrondiSup(surface * 3);
      const bande = bandeToRouleaux(bandeML);
      addMaterial(bande.designation, bande.quantity, 'rlx', bande.prix);

      // Enduit ≈ 0,5 kg / m²
      const enduitKg = surface * 0.5;
      const enduitSacs = kgToSacs(enduitKg);
      addMaterial('Enduit', enduitSacs, 'sac', PRIX_UNITAIRES.enduit_sac);

      break;
    }

    default:
      break;
  }

  return materials;
};

// ============ COMPOSANT PRINCIPAL ============

const QuotationFormPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  // Step 1: Client Info
  const [clientInfo, setClientInfo] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    site_address: '',
    site_city: '',
    site_postal_code: '',
  });

  // Step 2 & 3: Rooms with works
  const [rooms, setRooms] = useState([]);

  // Calculated materials (with user adjustments)
  const [calculatedMaterials, setCalculatedMaterials] = useState({});

  // ============ CALCULATIONS ============

  // ✅ Recalculate materials when rooms/works change
  useEffect(() => {
    const newMaterials = {};

    rooms.forEach((room, roomIndex) => {
      room.works.forEach((work, workIndex) => {
        const key = `${roomIndex}-${workIndex}`;
        const existingMaterials = calculatedMaterials[key];

        // ✅ Utiliser longueur et hauteur au lieu de surface
        const materials = calculateMaterialsForWork(
          work.work_type,
          work.longueur || 0,
          work.hauteur || 0,
          room.room_type
        );

        if (!existingMaterials) {
          newMaterials[key] = {
            items: materials,
            userModified: false,
          };
        } else if (!existingMaterials.userModified) {
          newMaterials[key] = {
            items: materials,
            userModified: false,
          };
        } else {
          // Garder les modifications utilisateur
          newMaterials[key] = {
            ...existingMaterials,
            items: existingMaterials.items.map((item, i) => {
              if (item.is_modified) {
                return {
                  ...item,
                  quantity_calculated: materials[i]?.quantity_calculated || item.quantity_calculated,
                };
              }
              return materials[i] || item;
            }),
          };
        }
      });
    });

    setCalculatedMaterials(newMaterials);
  }, [rooms]);

  // ✅ Total calculation
  const totals = useMemo(() => {
    let totalHt = 0;

    Object.values(calculatedMaterials).forEach(({ items }) => {
      if (items) {
        items.forEach(item => {
          totalHt += item.quantity_adjusted * item.unit_price;
        });
      }
    });

    const tvaRate = 20;
    const totalTva = totalHt * (tvaRate / 100);
    const totalTtc = totalHt + totalTva;

    return {
      total_ht: Math.round(totalHt * 100) / 100,
      total_tva: Math.round(totalTva * 100) / 100,
      total_ttc: Math.round(totalTtc * 100) / 100,
    };
  }, [calculatedMaterials]);

  // ============ HANDLERS ============

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addRoom = (roomType) => {
    const roomLabel = ROOM_TYPES.find(r => r.value === roomType)?.label || roomType;
    setRooms(prev => [
      ...prev,
      {
        room_type: roomType,
        room_name: roomLabel,
        works: [],
      },
    ]);
  };

  const removeRoom = (index) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
    setCalculatedMaterials(prev => {
      const newMaterials = {};
      Object.entries(prev).forEach(([key, value]) => {
        const [roomIdx] = key.split('-').map(Number);
        if (roomIdx < index) {
          newMaterials[key] = value;
        } else if (roomIdx > index) {
          const [, workIdx] = key.split('-').map(Number);
          newMaterials[`${roomIdx - 1}-${workIdx}`] = value;
        }
      });
      return newMaterials;
    });
  };

  const addWorkToRoom = (roomIndex, workType) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: [
          ...room.works,
          {
            work_type: workType,
            longueur: '',
            hauteur: '',
            surface: 0
          },
        ],
      };
    }));
  };

  // ✅ Mise à jour des dimensions (L et H)
  const updateWorkDimension = (roomIndex, workIndex, field, value) => {
    setRooms(prev =>
      prev.map((room, i) => {
        if (i !== roomIndex) return room;

        return {
          ...room,
          works: room.works.map((work, j) => {
            if (j !== workIndex) return work;

            const updatedWork = {
              ...work,
              [field]: value,
            };

            // Calculer la surface automatiquement
            const L = parseFloat(updatedWork.longueur) || 0;
            const H = parseFloat(updatedWork.hauteur) || 0;

            return {
              ...updatedWork,
              surface: Math.round(L * H * 100) / 100,
            };
          }),
        };
      })
    );
  };

  const removeWork = (roomIndex, workIndex) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: room.works.filter((_, j) => j !== workIndex),
      };
    }));
    setCalculatedMaterials(prev => {
      const newMaterials = {};
      Object.entries(prev).forEach(([key, value]) => {
        const [rIdx, wIdx] = key.split('-').map(Number);
        if (rIdx === roomIndex) {
          if (wIdx < workIndex) {
            newMaterials[key] = value;
          } else if (wIdx > workIndex) {
            newMaterials[`${rIdx}-${wIdx - 1}`] = value;
          }
        } else {
          newMaterials[key] = value;
        }
      });
      return newMaterials;
    });
  };

  const updateMaterialQuantity = (materialKey, itemIndex, newQuantity) => {
    setCalculatedMaterials(prev => ({
      ...prev,
      [materialKey]: {
        ...prev[materialKey],
        userModified: true,
        items: prev[materialKey].items.map((item, i) => {
          if (i !== itemIndex) return item;
          return {
            ...item,
            quantity_adjusted: newQuantity,
            total_ht: newQuantity * item.unit_price,
            is_modified: newQuantity !== item.quantity_calculated,
          };
        }),
      },
    }));
  };

  const resetMaterialQuantity = (materialKey, itemIndex) => {
    setCalculatedMaterials(prev => {
      const updatedItems = prev[materialKey].items.map((item, i) => {
        if (i !== itemIndex) return item;
        return {
          ...item,
          quantity_adjusted: item.quantity_calculated,
          total_ht: item.quantity_calculated * item.unit_price,
          is_modified: false,
        };
      });

      const stillModified = updatedItems.some(item => item.is_modified);

      return {
        ...prev,
        [materialKey]: {
          ...prev[materialKey],
          userModified: stillModified,
          items: updatedItems,
        },
      };
    });
  };

  // ============ VALIDATION ============

  const validateStep1 = () => {
    const newErrors = {};
    if (!clientInfo.client_name.trim()) newErrors.client_name = 'Le nom du client est requis';
    if (!clientInfo.site_address.trim()) newErrors.site_address = 'L\'adresse du chantier est requise';
    if (!clientInfo.site_city.trim()) newErrors.site_city = 'La ville est requise';
    if (clientInfo.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.client_email)) {
      newErrors.client_email = 'Email invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (rooms.length === 0) {
      setFormError('Veuillez ajouter au moins une pièce.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const validateStep3 = () => {
    const hasWorks = rooms.some(room => room.works.length > 0);
    if (!hasWorks) {
      setFormError('Veuillez ajouter au moins un travail.');
      return false;
    }

    const hasValidDimensions = rooms.every(room =>
      room.works.every(work => work.surface > 0)
    );
    if (!hasValidDimensions) {
      setFormError('Veuillez renseigner les dimensions (longueur et hauteur) pour tous les travaux.');
      return false;
    }

    setFormError(null);
    return true;
  };

  // ============ NAVIGATION ============

  const handleNext = () => {
    setFormError(null);

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFormError(null);
    }
  };

  // ============ SUBMIT ============

  const handleSubmit = async () => {
    setSaving(true);
    setFormError(null);

    try {
      const payload = {
        client_name: clientInfo.client_name,
        client_email: clientInfo.client_email || null,
        client_phone: clientInfo.client_phone || null,
        site_address: clientInfo.site_address,
        site_city: clientInfo.site_city,
        site_postal_code: clientInfo.site_postal_code || null,
        rooms: rooms.map((room, roomIndex) => ({
          room_type: room.room_type,
          room_name: room.room_name,
          works: room.works.map((work, workIndex) => {
            const materialKey = `${roomIndex}-${workIndex}`;
            const materials = calculatedMaterials[materialKey]?.items || [];

            return {
              work_type: work.work_type,
              longueur: parseFloat(work.longueur) || 0,
              hauteur: parseFloat(work.hauteur) || 0,
              surface: parseFloat(work.surface) || 0,
              items: materials.map(item => ({
                designation: item.designation,
                quantity_calculated: item.quantity_calculated,
                quantity_adjusted: item.quantity_adjusted,
                unit: item.unit,
                unit_price: item.unit_price,
              })),
            };
          }),
        })),
      };

      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await quotationAPI.create(payload);

      if (response.data?.data?.id) {
        navigate(`/quotations/${response.data.data.id}`);
      } else {
        navigate('/quotations');
      }
    } catch (error) {
      console.error('Erreur:', error);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setFormError('Veuillez corriger les erreurs du formulaire.');
      } else if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setFormError(error.response?.data?.message || 'Une erreur est survenue.');
      }
    } finally {
      setSaving(false);
    }
  };

  // ============ RENDER ============

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/quotations" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Retour</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Nouveau devis</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentStep >= step.id
                          ? 'bg-red-700 text-white'
                          : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {currentStep > step.id ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${currentStep >= step.id ? 'text-red-700' : 'text-gray-500'
                        }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded ${currentStep > step.id ? 'bg-red-700' : 'bg-gray-200'
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

          {/* Step 1: Client Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Informations client</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du client <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="client_name"
                      value={clientInfo.client_name}
                      onChange={handleClientChange}
                      placeholder="Entrez le nom du client"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.client_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.client_name && <p className="mt-1 text-sm text-red-500">{errors.client_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="client_email"
                      value={clientInfo.client_email}
                      onChange={handleClientChange}
                      placeholder="email@exemple.com"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.client_email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.client_email && <p className="mt-1 text-sm text-red-500">{errors.client_email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="text"
                      name="client_phone"
                      value={clientInfo.client_phone}
                      onChange={handleClientChange}
                      placeholder="+212 6XX XXX XXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Informations chantier</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse du chantier <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="site_address"
                      value={clientInfo.site_address}
                      onChange={handleClientChange}
                      placeholder="Entrez l'adresse complète"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.site_address ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.site_address && <p className="mt-1 text-sm text-red-500">{errors.site_address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="site_city"
                      value={clientInfo.site_city}
                      onChange={handleClientChange}
                      placeholder="Casablanca"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.site_city ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.site_city && <p className="mt-1 text-sm text-red-500">{errors.site_city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      name="site_postal_code"
                      value={clientInfo.site_postal_code}
                      onChange={handleClientChange}
                      placeholder="20000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Room Selection */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Sélection des pièces</h2>
              <p className="text-gray-600 mb-6">Cliquez sur les pièces à inclure dans votre devis.</p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {ROOM_TYPES.map((roomType) => (
                  <button
                    key={roomType.value}
                    type="button"
                    onClick={() => addRoom(roomType.value)}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-center group"
                  >
                    <span className="text-3xl mb-2 block">{roomType.icon}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                      {roomType.label}
                    </span>
                    <PlusIcon className="w-5 h-5 mx-auto mt-2 text-gray-400 group-hover:text-red-500" />
                  </button>
                ))}
              </div>

              {rooms.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-800 mb-4">Pièces sélectionnées ({rooms.length})</h3>
                  <div className="space-y-3">
                    {rooms.map((room, index) => {
                      const roomTypeInfo = ROOM_TYPES.find(r => r.value === room.room_type);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{roomTypeInfo?.icon}</span>
                            <div>
                              <p className="font-medium text-gray-800">{room.room_name}</p>
                              <p className="text-sm text-gray-500">{room.works.length} travaux</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRoom(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Work Types and Dimensions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {rooms.map((room, roomIndex) => {
                const roomTypeInfo = ROOM_TYPES.find(r => r.value === room.room_type);

                return (
                  <div key={roomIndex} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">{roomTypeInfo?.icon}</span>
                      <h2 className="text-lg font-semibold text-gray-800">{room.room_name}</h2>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">Choisissez le type de travaux :</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                      {WORK_TYPES.map((workType) => {
                        const isAdded = room.works.some(w => w.work_type === workType.value);
                        return (
                          <button
                            key={workType.value}
                            type="button"
                            onClick={() => !isAdded && addWorkToRoom(roomIndex, workType.value)}
                            disabled={isAdded}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${isAdded
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-red-500 hover:bg-red-50'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{workType.icon}</span>
                              <div>
                                <span className="text-sm font-medium block">{workType.label}</span>
                                <span className="text-xs text-gray-500">{workType.description}</span>
                              </div>
                              {isAdded && <CheckIcon className="w-4 h-4 ml-auto text-green-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {room.works.length > 0 && (
                      <div className="space-y-4 border-t border-gray-200 pt-6">
                        {room.works.map((work, workIndex) => {
                          const workTypeInfo = WORK_TYPES.find(w => w.value === work.work_type);
                          const isPlafond = work.work_type === 'plafond_ba13';
                          
                          return (
                            <div key={workIndex} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{workTypeInfo?.icon}</span>
                                  <div>
                                    <p className="font-medium text-gray-800">{workTypeInfo?.label}</p>
                                    <p className="text-xs text-gray-500">{workTypeInfo?.description}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeWork(roomIndex, workIndex)}
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
                              </div>

                              {/* ✅ Entrées Longueur et Hauteur/Largeur selon DTU */}
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {isPlafond ? 'Longueur (L)' : 'Longueur (L)'}
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={work.longueur || ''}
                                      onChange={(e) =>
                                        updateWorkDimension(roomIndex, workIndex, 'longueur', e.target.value)
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                                    />
                                    <span className="text-gray-500 text-sm">m</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {isPlafond ? 'Largeur (l)' : 'Hauteur (H)'}
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={work.hauteur || ''}
                                      onChange={(e) =>
                                        updateWorkDimension(roomIndex, workIndex, 'hauteur', e.target.value)
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                                    />
                                    <span className="text-gray-500 text-sm">m</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Surface calculée
                                  </label>
                                  <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                                    {work.surface || 0} m²
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 4: Summary with Materials */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Client Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Récapitulatif client</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nom :</span>
                    <span className="ml-2 font-medium text-gray-800">{clientInfo.client_name}</span>
                  </div>
                  {clientInfo.client_email && (
                    <div>
                      <span className="text-gray-500">Email :</span>
                      <span className="ml-2 font-medium text-gray-800">{clientInfo.client_email}</span>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Adresse :</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {clientInfo.site_address}, {clientInfo.site_city}
                    </span>
                  </div>
                </div>
              </div>

              {/* DTU Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>📋 Mention DTU :</strong> Les calculs et quantités sont établis conformément aux règles de calcul et de mise en œuvre du DTU 25.41. Ils sont destinés à un usage de simulation et peuvent être ajustés selon les contraintes réelles du chantier.
                </p>
              </div>

              {/* Materials by Room */}
              {rooms.map((room, roomIndex) => {
                const roomTypeInfo = ROOM_TYPES.find(r => r.value === room.room_type);

                return (
                  <div key={roomIndex} className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                      <span className="text-2xl">{roomTypeInfo?.icon}</span>
                      {room.room_name}
                    </h2>

                    {room.works.map((work, workIndex) => {
                      const workTypeInfo = WORK_TYPES.find(w => w.value === work.work_type);
                      const materialKey = `${roomIndex}-${workIndex}`;
                      const materials = calculatedMaterials[materialKey]?.items || [];

                      return (
                        <div key={workIndex} className="mb-6 last:mb-0">
                          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                            <span className="text-xl">{workTypeInfo?.icon}</span>
                            <h3 className="font-medium text-gray-700">
                              {workTypeInfo?.label}
                            </h3>
                            <span className="text-sm text-gray-500">
                              — {work.longueur}m × {work.hauteur}m = {work.surface} m²
                            </span>
                          </div>

                          {materials.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="text-left py-2 px-3 font-medium text-gray-600">Matériaux</th>
                                    <th className="text-center py-2 px-3 font-medium text-gray-600">Qté calc.</th>
                                    <th className="text-center py-2 px-3 font-medium text-gray-600">Qté ajustée</th>
                                    <th className="text-center py-2 px-3 font-medium text-gray-600">Unité</th>
                                    <th className="text-right py-2 px-3 font-medium text-gray-600">P.U.</th>
                                    <th className="text-right py-2 px-3 font-medium text-gray-600">Total</th>
                                    <th className="w-12"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {materials.map((item, itemIndex) => (
                                    <tr
                                      key={itemIndex}
                                      className={`border-b border-gray-100 ${item.is_modified ? 'bg-yellow-50' : ''}`}
                                    >
                                      <td className="py-2 px-3 font-medium text-gray-800">
                                        {item.designation}
                                        {item.is_modified && (
                                          <span className="ml-2 text-xs text-yellow-600">(modifié)</span>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 text-center text-gray-500">
                                        {item.quantity_calculated}
                                      </td>
                                      <td className="py-2 px-3 text-center">
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.quantity_adjusted}
                                          onChange={(e) => updateMaterialQuantity(materialKey, itemIndex, parseFloat(e.target.value) || 0)}
                                          className={`w-20 px-2 py-1 border rounded text-center text-sm ${item.is_modified ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                                            }`}
                                        />
                                      </td>
                                      <td className="py-2 px-3 text-center text-gray-600">{item.unit}</td>
                                      <td className="py-2 px-3 text-right text-gray-600">
                                        {item.unit_price.toFixed(2)} DH
                                      </td>
                                      <td className="py-2 px-3 text-right font-medium text-gray-800">
                                        {(item.quantity_adjusted * item.unit_price).toFixed(2)} DH
                                      </td>
                                      <td className="py-2 px-3 text-center">
                                        {item.is_modified && (
                                          <button
                                            type="button"
                                            onClick={() => resetMaterialQuantity(materialKey, itemIndex)}
                                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                            title="Réinitialiser"
                                          >
                                            <ArrowPathIcon className="w-4 h-4" />
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Aucun matériau calculé - vérifiez les dimensions</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Totals */}
              <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6">
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex justify-between w-full max-w-xs">
                    <span className="text-gray-600">Total HT :</span>
                    <span className="font-medium text-gray-800">{totals.total_ht.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs">
                    <span className="text-gray-600">TVA (20%) :</span>
                    <span className="font-medium text-gray-800">{totals.total_tva.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs pt-2 border-t border-red-200">
                    <span className="font-semibold text-gray-800">Total TTC :</span>
                    <span className="font-bold text-xl text-red-700">{totals.total_ttc.toFixed(2)} DH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Précédent
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                to="/quotations"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                >
                  Suivant
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  <CheckIcon className="w-5 h-5" />
                  {saving ? 'Création...' : 'Créer le devis'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuotationFormPage;