// src/pages/QuotationFormPage.jsx
// VERSION SIMPLIFIÉE : 3 types d'ouvrages + épaisseur cloison + ouvertures (fenêtres/portes) + isolant optionnel

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

const InformationCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
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

const WORK_TYPES = [
  { value: 'habillage_mur', label: 'Habillage BA13', icon: '🧱', description: 'Ouvrage vertical – 1 face' },
  { value: 'cloison', label: 'Cloison', icon: '🚪', description: 'Selon épaisseur : M48/M70/Double' },
  { value: 'plafond_ba13', label: 'Plafond BA13', icon: '⬆️', description: 'Sur ossature métallique' },
];

const EPAISSEUR_OPTIONS = [
  { value: '72', label: '≤ 72 mm', sublabel: 'M48 / R48', montant: 'montant_48', rail: 'rail_48', isDouble: false },
  { value: '100', label: '≤ 100 mm', sublabel: 'M70 / R70', montant: 'montant_70', rail: 'rail_70', isDouble: false },
  { value: '140', label: '≥ 140 mm', sublabel: 'Double M48/R48', montant: 'montant_48', rail: 'rail_48', isDouble: true },
];

// Types d'ouvertures
const OUVERTURE_TYPES = [
  { value: 'fenetre', label: 'Fenêtre', icon: '🪟' },
  { value: 'porte', label: 'Porte', icon: '🚪' },
];

// ✅ Types d'isolant (optionnel)
const ISOLANT_OPTIONS = [
  { value: 'none', label: 'Sans isolant', prix: 0 },
  { value: 'laine_minerale_easy', label: 'Laine minérale Easy Volcalis', prix: 26.40 },
  { value: 'laine_minerale_confort', label: 'Laine minérale Confort Volcalis', prix: 36.00 },
  { value: 'laine_verre', label: 'Laine de verre', prix: 21.60 },
  { value: 'laine_roche', label: 'Laine de roche ROCKMUR', prix: 47.40 },
];

const STEPS = [
  { id: 1, name: 'Client' },
  { id: 2, name: 'Pièces' },
  { id: 3, name: 'Travaux' },
  { id: 4, name: 'Récapitulatif' },
];

const PRIX_UNITAIRES = {
  plaque_ba13_standard: 24.12,
  plaque_hydro: 34.20,
  plaque_feu: 42.00,
  plaque_outguard: 97.2,
  montant_48: 26.16,
  montant_70: 33.00,
  rail_48: 21.12,
  rail_70: 28.20,
  fourrure: 21.12,
  vis_25mm_boite: 62.40,
  vis_9mm_boite: 69.60,
  suspente: 0.00,
  corniere: 13.44,
  bande_joint_150: 48.00,
  bande_joint_300: 85.00,
  enduit_sac: 163.20,
};

const PLAQUE_BY_ROOM = {
  salon_sejour: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
  chambre: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
  cuisine: { designation: 'Plaque Hydro', prix: PRIX_UNITAIRES.plaque_hydro },
  salle_de_bain: { designation: 'Plaque Hydro', prix: PRIX_UNITAIRES.plaque_hydro },
  wc: { designation: 'Plaque Hydro', prix: PRIX_UNITAIRES.plaque_hydro },
  bureau: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
  garage: { designation: 'Plaque Feu', prix: PRIX_UNITAIRES.plaque_feu },
  exterieur: { designation: 'Plaque OutGuard', prix: PRIX_UNITAIRES.plaque_outguard },
  autre: { designation: 'Plaque BA13 standard', prix: PRIX_UNITAIRES.plaque_ba13_standard },
};

const DTU = {
  ENTRAXE: 0.60,
  PLAQUE_SURFACE: 3.00,
  PROFIL_LONGUEUR: 3.00,
  VIS_PAR_BOITE: 1000,
  KG_PAR_SAC_ENDUIT: 25,
};

// ============ FONCTIONS DE CALCUL ============
const arrondiSup = (value) => Math.ceil(value);
const visToBoites = (nombreVis) => nombreVis <= 0 ? 0 : Math.max(1, Math.ceil(nombreVis / DTU.VIS_PAR_BOITE));
const kgToSacs = (kg) => kg <= 0 ? 0 : Math.ceil(kg / DTU.KG_PAR_SAC_ENDUIT);

const bandeToRouleaux = (ml) => {
  if (ml <= 0) return { designation: 'Bande à joint 150m', quantity: 0, prix: PRIX_UNITAIRES.bande_joint_150 };
  if (ml <= 150) return { designation: 'Bande à joint 150m', quantity: 1, prix: PRIX_UNITAIRES.bande_joint_150 };
  if (ml <= 300) return { designation: 'Bande à joint 300m', quantity: 1, prix: PRIX_UNITAIRES.bande_joint_300 };
  return { designation: 'Bande à joint 300m', quantity: Math.ceil(ml / 300), prix: PRIX_UNITAIRES.bande_joint_300 };
};

// Calcul de la surface des ouvertures
const calculateOuverturesSurface = (ouvertures = []) => {
  return ouvertures.reduce((total, ouv) => {
    const largeur = parseFloat(ouv.largeur) || 0;
    const hauteur = parseFloat(ouv.hauteur) || 0;
    return total + (largeur * hauteur);
  }, 0);
};

// ✅ Fonction de calcul des matériaux avec support isolant optionnel
const calculateMaterialsForWork = (workType, longueur, hauteur, roomType, epaisseur = '72', ouvertures = [], isolant = 'none') => {
  const L = parseFloat(longueur) || 0;
  const H = parseFloat(hauteur) || 0;
  const surfaceBrute = L * H;
  const surfaceOuvertures = calculateOuverturesSurface(ouvertures);
  const surface = Math.max(0, surfaceBrute - surfaceOuvertures);
  
  if (surface <= 0) return [];

  const plaque = PLAQUE_BY_ROOM[roomType] || PLAQUE_BY_ROOM.autre;
  const materials = [];
  let idx = 0;

  const add = (designation, quantity, unit, unitPrice) => {
    materials.push({
      id: `${workType}-${idx++}`,
      designation,
      quantity_calculated: quantity,
      quantity_adjusted: quantity,
      unit,
      unit_price: unitPrice,
      total_ht: quantity * unitPrice,
      is_modified: false,
    });
  };

  // ✅ Fonction pour ajouter l'isolant si sélectionné
  const addIsolant = (surfaceIsolant) => {
    if (isolant && isolant !== 'none') {
      const isolantOption = ISOLANT_OPTIONS.find(o => o.value === isolant);
      if (isolantOption && isolantOption.prix > 0) {
        add(isolantOption.label, arrondiSup(surfaceIsolant), 'm²', isolantOption.prix);
      }
    }
  };

  switch (workType) {
    case 'habillage_mur': {
      // Plaques (vendu au m², surface nette)
      add(plaque.designation, arrondiSup(surface), 'm²', plaque.prix);
      
      // Montants : formule = 2 × (Lignes - 1) × Montants/ligne
      const nbLignesMontants = arrondiSup((L / DTU.ENTRAXE) + 1);
      const montantsParLigne = Math.max(1, arrondiSup(H / DTU.PROFIL_LONGUEUR));
      const totalMontants = 2 * (nbLignesMontants - 1) * montantsParLigne;
      add('Montant M48', totalMontants, 'unité', PRIX_UNITAIRES.montant_48);
      
      // Rails : haut + bas
      add('Rail R48', arrondiSup((L * 2) / DTU.PROFIL_LONGUEUR), 'unité', PRIX_UNITAIRES.rail_48);
      
      // ✅ Isolant optionnel (surface nette)
      addIsolant(surface);
      
      add('Vis TTPC 25 mm', visToBoites(arrondiSup(surface * 20)), 'boîte', PRIX_UNITAIRES.vis_25mm_boite);
      add('Vis TTPC 9 mm', visToBoites(arrondiSup(surface * 3)), 'boîte', PRIX_UNITAIRES.vis_9mm_boite);
      const bande = bandeToRouleaux(arrondiSup(surface * 3));
      add(bande.designation, bande.quantity, 'rlx', bande.prix);
      add('Enduit', kgToSacs(surface * 0.5), 'sac', PRIX_UNITAIRES.enduit_sac);
      break;
    }

    case 'cloison': {
      const config = EPAISSEUR_OPTIONS.find(e => e.value === epaisseur) || EPAISSEUR_OPTIONS[0];
      const isDouble = config.isDouble;
      const montantLabel = config.montant === 'montant_48' ? 'Montant M48' : 'Montant M70';
      const railLabel = config.rail === 'rail_48' ? 'Rail R48' : 'Rail R70';

      // Plaques (2 faces, vendu au m², surface nette)
      add(plaque.designation, arrondiSup(surface * 2), 'm²', plaque.prix);

      // Montants : formule = 2 × (Lignes - 1) × Montants/ligne
      const nbLignesMontants = arrondiSup((L / DTU.ENTRAXE) + 1);
      const montantsParLigne = Math.max(1, arrondiSup(H / DTU.PROFIL_LONGUEUR));
      const totalMontants = 2 * (nbLignesMontants - 1) * montantsParLigne;
      
      // Rails : haut + bas
      const totalRails = arrondiSup((L * 2) / DTU.PROFIL_LONGUEUR);

      if (isDouble) {
        add(montantLabel, totalMontants * 2, 'unité', PRIX_UNITAIRES[config.montant]);
        add(railLabel, totalRails * 2, 'unité', PRIX_UNITAIRES[config.rail]);
        // ✅ Isolant optionnel (surface × 2 pour double)
        addIsolant(surface * 2);
        add('Vis TTPC 25 mm', visToBoites(arrondiSup(surface * 45)), 'boîte', PRIX_UNITAIRES.vis_25mm_boite);
        add('Vis TTPC 9 mm', visToBoites(arrondiSup(surface * 6)), 'boîte', PRIX_UNITAIRES.vis_9mm_boite);
      } else {
        add(montantLabel, totalMontants, 'unité', PRIX_UNITAIRES[config.montant]);
        add(railLabel, totalRails, 'unité', PRIX_UNITAIRES[config.rail]);
        // ✅ Isolant optionnel (surface simple)
        addIsolant(surface);
        add('Vis TTPC 25 mm', visToBoites(arrondiSup(surface * 40)), 'boîte', PRIX_UNITAIRES.vis_25mm_boite);
        add('Vis TTPC 9 mm', visToBoites(arrondiSup(surface * 4)), 'boîte', PRIX_UNITAIRES.vis_9mm_boite);
      }

      const bande = bandeToRouleaux(arrondiSup(surface * 6));
      add(bande.designation, bande.quantity, 'rlx', bande.prix);
      add('Enduit', kgToSacs(isDouble ? surface * 1.2 : surface), 'sac', PRIX_UNITAIRES.enduit_sac);
      break;
    }

    case 'plafond_ba13': {
      const l = H;
      // Plaques (vendu au m²)
      add(plaque.designation, arrondiSup(surface), 'm²', plaque.prix);
      add('Fourrure', arrondiSup((l / DTU.ENTRAXE) * L / DTU.PROFIL_LONGUEUR), 'unité', PRIX_UNITAIRES.fourrure);
      add('Suspente', arrondiSup(surface * 2.5), 'unité', PRIX_UNITAIRES.suspente);
      add('Cornière périphérique', arrondiSup(((L + l) * 2) / DTU.PROFIL_LONGUEUR), 'unité', PRIX_UNITAIRES.corniere);
      add('Vis TTPC 25 mm', visToBoites(arrondiSup(surface * 22)), 'boîte', PRIX_UNITAIRES.vis_25mm_boite);
      const bande = bandeToRouleaux(arrondiSup(surface * 3));
      add(bande.designation, bande.quantity, 'rlx', bande.prix);
      add('Enduit', kgToSacs(surface * 0.5), 'sac', PRIX_UNITAIRES.enduit_sac);
      break;
    }
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

  // Calculated materials
  const [calculatedMaterials, setCalculatedMaterials] = useState({});

  // Recalculate materials when rooms change
  useEffect(() => {
    const newMaterials = {};
    rooms.forEach((room, roomIndex) => {
      room.works.forEach((work, workIndex) => {
        const key = `${roomIndex}-${workIndex}`;
        const existingMaterials = calculatedMaterials[key];
        const materials = calculateMaterialsForWork(
          work.work_type, 
          work.longueur, 
          work.hauteur, 
          room.room_type, 
          work.epaisseur || '72',
          work.ouvertures || [],
          work.isolant || 'none'
        );
        if (!existingMaterials || !existingMaterials.userModified) {
          newMaterials[key] = { items: materials, userModified: false };
        } else {
          newMaterials[key] = {
            ...existingMaterials,
            items: existingMaterials.items.map((item, i) => 
              item.is_modified 
                ? { ...item, quantity_calculated: materials[i]?.quantity_calculated || item.quantity_calculated }
                : (materials[i] || item)
            ),
          };
        }
      });
    });
    setCalculatedMaterials(newMaterials);
  }, [rooms]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalHt = 0;
    Object.values(calculatedMaterials).forEach(({ items }) => {
      if (items) items.forEach(item => { totalHt += item.quantity_adjusted * item.unit_price; });
    });
    const totalTva = totalHt * 0.2;
    return {
      total_ht: Math.round(totalHt * 100) / 100,
      total_tva: Math.round(totalTva * 100) / 100,
      total_ttc: Math.round((totalHt + totalTva) * 100) / 100,
    };
  }, [calculatedMaterials]);

  // ============ HANDLERS ============
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const addRoom = (roomType) => {
    const roomLabel = ROOM_TYPES.find(r => r.value === roomType)?.label || roomType;
    setRooms(prev => [...prev, { room_type: roomType, room_name: roomLabel, works: [] }]);
  };

  const removeRoom = (index) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
    setCalculatedMaterials(prev => {
      const newMaterials = {};
      Object.entries(prev).forEach(([key, value]) => {
        const [roomIdx, workIdx] = key.split('-').map(Number);
        if (roomIdx < index) newMaterials[key] = value;
        else if (roomIdx > index) newMaterials[`${roomIdx - 1}-${workIdx}`] = value;
      });
      return newMaterials;
    });
  };

  const addWorkToRoom = (roomIndex, workType) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: [...room.works, { 
          work_type: workType, 
          longueur: '', 
          hauteur: '', 
          surface: 0, 
          epaisseur: '72',
          ouvertures: [],
          isolant: 'none'
        }],
      };
    }));
  };

  const updateWorkDimension = (roomIndex, workIndex, field, value) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: room.works.map((work, j) => {
          if (j !== workIndex) return work;
          const updated = { ...work, [field]: value };
          const L = parseFloat(updated.longueur) || 0;
          const H = parseFloat(updated.hauteur) || 0;
          const surfaceBrute = L * H;
          const surfaceOuvertures = calculateOuverturesSurface(updated.ouvertures || []);
          return { 
            ...updated, 
            surface: Math.round((surfaceBrute - surfaceOuvertures) * 100) / 100,
            surface_brute: Math.round(surfaceBrute * 100) / 100,
            surface_ouvertures: Math.round(surfaceOuvertures * 100) / 100
          };
        }),
      };
    }));
  };

  const updateWorkEpaisseur = (roomIndex, workIndex, epaisseur) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: room.works.map((work, j) => j !== workIndex ? work : { ...work, epaisseur }),
      };
    }));
    const key = `${roomIndex}-${workIndex}`;
    setCalculatedMaterials(prev => ({ ...prev, [key]: { ...prev[key], userModified: false } }));
  };

  // ✅ Handler pour l'isolant
  const updateWorkIsolant = (roomIndex, workIndex, isolant) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: room.works.map((work, j) => j !== workIndex ? work : { ...work, isolant }),
      };
    }));
    const key = `${roomIndex}-${workIndex}`;
    setCalculatedMaterials(prev => ({ ...prev, [key]: { ...prev[key], userModified: false } }));
  };

  // ============ OUVERTURES HANDLERS ============
  const addOuverture = (roomIndex, workIndex) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: room.works.map((work, j) => {
          if (j !== workIndex) return work;
          return {
            ...work,
            ouvertures: [...(work.ouvertures || []), { type: 'fenetre', largeur: '', hauteur: '' }]
          };
        }),
      };
    }));
  };

  const updateOuverture = (roomIndex, workIndex, ouvertureIndex, field, value) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: room.works.map((work, j) => {
          if (j !== workIndex) return work;
          const newOuvertures = [...(work.ouvertures || [])];
          newOuvertures[ouvertureIndex] = { ...newOuvertures[ouvertureIndex], [field]: value };
          
          // Recalculer les surfaces
          const L = parseFloat(work.longueur) || 0;
          const H = parseFloat(work.hauteur) || 0;
          const surfaceBrute = L * H;
          const surfaceOuvertures = calculateOuverturesSurface(newOuvertures);
          
          return { 
            ...work, 
            ouvertures: newOuvertures,
            surface: Math.round((surfaceBrute - surfaceOuvertures) * 100) / 100,
            surface_brute: Math.round(surfaceBrute * 100) / 100,
            surface_ouvertures: Math.round(surfaceOuvertures * 100) / 100
          };
        }),
      };
    }));
  };

  const removeOuverture = (roomIndex, workIndex, ouvertureIndex) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return {
        ...room,
        works: room.works.map((work, j) => {
          if (j !== workIndex) return work;
          const newOuvertures = (work.ouvertures || []).filter((_, k) => k !== ouvertureIndex);
          
          // Recalculer les surfaces
          const L = parseFloat(work.longueur) || 0;
          const H = parseFloat(work.hauteur) || 0;
          const surfaceBrute = L * H;
          const surfaceOuvertures = calculateOuverturesSurface(newOuvertures);
          
          return { 
            ...work, 
            ouvertures: newOuvertures,
            surface: Math.round((surfaceBrute - surfaceOuvertures) * 100) / 100,
            surface_brute: Math.round(surfaceBrute * 100) / 100,
            surface_ouvertures: Math.round(surfaceOuvertures * 100) / 100
          };
        }),
      };
    }));
  };

  const removeWork = (roomIndex, workIndex) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== roomIndex) return room;
      return { ...room, works: room.works.filter((_, j) => j !== workIndex) };
    }));
    setCalculatedMaterials(prev => {
      const newMaterials = {};
      Object.entries(prev).forEach(([key, value]) => {
        const [rIdx, wIdx] = key.split('-').map(Number);
        if (rIdx === roomIndex) {
          if (wIdx < workIndex) newMaterials[key] = value;
          else if (wIdx > workIndex) newMaterials[`${rIdx}-${wIdx - 1}`] = value;
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
        items: prev[materialKey].items.map((item, i) => i !== itemIndex ? item : {
          ...item,
          quantity_adjusted: newQuantity,
          total_ht: newQuantity * item.unit_price,
          is_modified: newQuantity !== item.quantity_calculated,
        }),
      },
    }));
  };

  const resetMaterialQuantity = (materialKey, itemIndex) => {
    setCalculatedMaterials(prev => {
      const updatedItems = prev[materialKey].items.map((item, i) => i !== itemIndex ? item : {
        ...item,
        quantity_adjusted: item.quantity_calculated,
        total_ht: item.quantity_calculated * item.unit_price,
        is_modified: false,
      });
      return {
        ...prev,
        [materialKey]: {
          ...prev[materialKey],
          userModified: updatedItems.some(i => i.is_modified),
          items: updatedItems,
        },
      };
    });
  };

  // ============ VALIDATION ============
  const validateStep1 = () => {
    const newErrors = {};
    if (!clientInfo.client_name.trim()) newErrors.client_name = 'Le nom du client est requis';
    if (!clientInfo.site_address.trim()) newErrors.site_address = "L'adresse du chantier est requise";
    if (!clientInfo.site_city.trim()) newErrors.site_city = 'La ville est requise';
    if (clientInfo.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.client_email)) {
      newErrors.client_email = 'Email invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (rooms.length === 0) { setFormError('Veuillez ajouter au moins une pièce.'); return false; }
    setFormError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!rooms.some(room => room.works.length > 0)) { setFormError('Veuillez ajouter au moins un travail.'); return false; }
    if (!rooms.every(room => room.works.every(work => work.surface > 0))) { setFormError('Veuillez renseigner les dimensions.'); return false; }
    setFormError(null);
    return true;
  };

  const handleNext = () => {
    setFormError(null);
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const handlePrevious = () => {
    if (currentStep > 1) { setCurrentStep(currentStep - 1); setFormError(null); }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        ...clientInfo,
        client_email: clientInfo.client_email || null,
        client_phone: clientInfo.client_phone || null,
        site_postal_code: clientInfo.site_postal_code || null,
        rooms: rooms.map((room, roomIndex) => ({
          room_type: room.room_type,
          room_name: room.room_name,
          works: room.works.map((work, workIndex) => ({
            work_type: work.work_type,
            epaisseur: work.epaisseur || '72',
            longueur: parseFloat(work.longueur) || 0,
            hauteur: parseFloat(work.hauteur) || 0,
            surface: parseFloat(work.surface) || 0,
            ouvertures: work.ouvertures || [],
            isolant: work.isolant || 'none',
            items: (calculatedMaterials[`${roomIndex}-${workIndex}`]?.items || []).map(item => ({
              designation: item.designation,
              quantity_calculated: item.quantity_calculated,
              quantity_adjusted: item.quantity_adjusted,
              unit: item.unit,
              unit_price: item.unit_price,
            })),
          })),
        })),
      };
      const response = await quotationAPI.create(payload);
      navigate(`/quotations/${response.data.data.id}`);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setFormError('Veuillez corriger les erreurs.');
      } else if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setFormError(error.response?.data?.message || 'Une erreur est survenue.');
      }
    } finally {
      setSaving(false);
    }
  };

  const getOuvertureLabel = (type) => OUVERTURE_TYPES.find(o => o.value === type)?.label || type;
  const getEpaisseurLabel = (epaisseur) => EPAISSEUR_OPTIONS.find(e => e.value === epaisseur)?.label || 'Standard';
  const getIsolantLabel = (isolant) => ISOLANT_OPTIONS.find(o => o.value === isolant)?.label || 'Sans isolant';

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
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentStep >= step.id ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {currentStep > step.id ? <CheckIcon className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? 'text-red-700' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded ${currentStep > step.id ? 'bg-red-700' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client <span className="text-red-500">*</span></label>
                    <input type="text" name="client_name" value={clientInfo.client_name} onChange={handleClientChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.client_name ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.client_name && <p className="mt-1 text-sm text-red-500">{errors.client_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="client_email" value={clientInfo.client_email} onChange={handleClientChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.client_email ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.client_email && <p className="mt-1 text-sm text-red-500">{errors.client_email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input type="text" name="client_phone" value={clientInfo.client_phone} onChange={handleClientChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Informations chantier</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse du chantier <span className="text-red-500">*</span></label>
                    <input type="text" name="site_address" value={clientInfo.site_address} onChange={handleClientChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.site_address ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.site_address && <p className="mt-1 text-sm text-red-500">{errors.site_address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
                    <input type="text" name="site_city" value={clientInfo.site_city} onChange={handleClientChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${errors.site_city ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.site_city && <p className="mt-1 text-sm text-red-500">{errors.site_city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input type="text" name="site_postal_code" value={clientInfo.site_postal_code} onChange={handleClientChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
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
                    <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">{roomType.label}</span>
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
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{roomTypeInfo?.icon}</span>
                            <div>
                              <p className="font-medium text-gray-800">{room.room_name}</p>
                              <p className="text-sm text-gray-500">{room.works.length} travaux</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeRoom(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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

          {/* Step 3: Work Types with Ouvertures and Isolant */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Calcul conforme au DTU 25.41</p>
                    <p>Saisissez les dimensions réelles. Pour les murs et cloisons, vous pouvez ajouter des ouvertures et choisir un type d'isolant.</p>
                  </div>
                </div>
              </div>

              {rooms.map((room, roomIndex) => {
                const roomTypeInfo = ROOM_TYPES.find(r => r.value === room.room_type);
                return (
                  <div key={roomIndex} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">{roomTypeInfo?.icon}</span>
                      <h2 className="text-lg font-semibold text-gray-800">{room.room_name}</h2>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">Choisissez le type de travaux :</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                      {WORK_TYPES.map((workType) => {
                        const isAdded = room.works.some(w => w.work_type === workType.value);
                        return (
                          <button
                            key={workType.value}
                            type="button"
                            onClick={() => !isAdded && addWorkToRoom(roomIndex, workType.value)}
                            disabled={isAdded}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${isAdded ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-red-500 hover:bg-red-50'}`}
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
                          const isCloison = work.work_type === 'cloison';
                          const supportsOuvertures = work.work_type === 'habillage_mur' || work.work_type === 'cloison';
                          const supportsIsolant = work.work_type === 'habillage_mur' || work.work_type === 'cloison';

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
                                <button type="button" onClick={() => removeWork(roomIndex, workIndex)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                                  <TrashIcon className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Épaisseur selector for cloison */}
                              {isCloison && (
                                <div className="mb-4">
                                  <label className="block text-xs font-medium text-gray-600 mb-2">Épaisseur de la cloison</label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {EPAISSEUR_OPTIONS.map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => updateWorkEpaisseur(roomIndex, workIndex, option.value)}
                                        className={`p-2 text-xs rounded-lg border-2 transition-all ${work.epaisseur === option.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}
                                      >
                                        <div className="font-medium">{option.label}</div>
                                        <div className="text-gray-500">{option.sublabel}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Dimensions */}
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Longueur (L)</label>
                                  <div className="flex items-center gap-2">
                                    <input type="number" min="0" step="0.01" placeholder="0.00" value={work.longueur || ''} onChange={(e) => updateWorkDimension(roomIndex, workIndex, 'longueur', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
                                    <span className="text-gray-500 text-sm">m</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">{isPlafond ? 'Largeur (l)' : 'Hauteur (H)'}</label>
                                  <div className="flex items-center gap-2">
                                    <input type="number" min="0" step="0.01" placeholder="0.00" value={work.hauteur || ''} onChange={(e) => updateWorkDimension(roomIndex, workIndex, 'hauteur', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
                                    <span className="text-gray-500 text-sm">m</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Surface nette</label>
                                  <div className="px-3 py-2 bg-green-100 rounded-lg text-sm font-medium text-green-700">{work.surface || 0} m²</div>
                                </div>
                              </div>

                              {/* ✅ Isolant selector */}
                              {supportsIsolant && (
                                <div className="mb-4">
                                  <label className="block text-s font-medium text-gray-600 mb-2">🧶 Isolant (optionnel)</label>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {ISOLANT_OPTIONS.map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => updateWorkIsolant(roomIndex, workIndex, option.value)}
                                        className={`p-2 text-xs rounded-lg border-2 transition-all text-left ${
                                          work.isolant === option.value 
                                            ? 'border-green-500 bg-green-50 text-green-700' 
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                      >
                                        <div className="font-medium">{option.label}</div>
                                        {/* {option.prix > 0 && (
                                          <div className="text-gray-500">{option.prix.toFixed(2)} DH/m²</div>
                                        )} */}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Ouvertures section */}
                              {supportsOuvertures && (
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="text-s font-medium text-gray-600">Ouvertures (fenêtres / portes)</label>
                                    <button
                                      type="button"
                                      onClick={() => addOuverture(roomIndex, workIndex)}
                                      className="flex items-center gap-1 text-s text-green-600 hover:text-green-700 font-medium"
                                    >
                                      <PlusIcon className="w-4 h-4" />
                                      Ajouter une ouverture
                                    </button>
                                  </div>

                                  {work.ouvertures && work.ouvertures.length > 0 && (
                                    <div className="space-y-3">
                                      {work.ouvertures.map((ouverture, ouvertureIndex) => (
                                        <div key={ouvertureIndex} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                          {/* Row 1: Type selector + Delete button */}
                                          <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="flex gap-1 sm:gap-2">
                                              {OUVERTURE_TYPES.map((type) => (
                                                <button
                                                  key={type.value}
                                                  type="button"
                                                  onClick={() => updateOuverture(roomIndex, workIndex, ouvertureIndex, 'type', type.value)}
                                                  className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                                    ouverture.type === type.value
                                                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                                                  }`}
                                                >
                                                  <span className="text-base sm:text-lg">{type.icon}</span>
                                                  <span className="hidden sm:inline">{type.label}</span>
                                                </button>
                                              ))}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => removeOuverture(roomIndex, workIndex, ouvertureIndex)}
                                              className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                            >
                                              <TrashIcon className="w-4 h-4" />
                                            </button>
                                          </div>
                                          
                                          {/* Row 2: Dimensions + Surface - Stacks on mobile */}
                                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                            {/* Dimensions group */}
                                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                              <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500">L:</span>
                                                <input
                                                  type="number"
                                                  min="0"
                                                  step="0.01"
                                                  placeholder="0.00"
                                                  value={ouverture.largeur || ''}
                                                  onChange={(e) => updateOuverture(roomIndex, workIndex, ouvertureIndex, 'largeur', e.target.value)}
                                                  className="w-16 sm:w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                                <span className="text-gray-400 text-xs">m</span>
                                              </div>
                                              
                                              <span className="text-gray-400 font-bold">×</span>
                                              
                                              <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500">H:</span>
                                                <input
                                                  type="number"
                                                  min="0"
                                                  step="0.01"
                                                  placeholder="0.00"
                                                  value={ouverture.hauteur || ''}
                                                  onChange={(e) => updateOuverture(roomIndex, workIndex, ouvertureIndex, 'hauteur', e.target.value)}
                                                  className="w-16 sm:w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                                <span className="text-gray-400 text-xs">m</span>
                                              </div>
                                            </div>
                                            
                                            {/* Surface result - Full width on mobile, right aligned on desktop */}
                                            <div className="px-3 py-1.5 bg-green-100 rounded-lg sm:ml-auto">
                                              <span className="text-sm font-semibold text-green-700 block text-center sm:text-right">
                                                = {((parseFloat(ouverture.largeur) || 0) * (parseFloat(ouverture.hauteur) || 0)).toFixed(2)} m²
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {/* Summary - responsive */}
                                      {work.surface_ouvertures > 0 && (
                                        <div className="flex flex-col sm:flex-row sm:justify-end gap-1 sm:gap-4 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                                          <span className="text-center sm:text-right">Surface brute: <strong>{work.surface_brute || 0} m²</strong></span>
                                          <span className="text-center sm:text-right">Ouvertures: <strong className="text-orange-600">-{work.surface_ouvertures || 0} m²</strong></span>
                                          <span className="text-center sm:text-right">Surface nette: <strong className="text-green-600">{work.surface || 0} m²</strong></span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
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

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <div className="space-y-6">
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
                    <span className="ml-2 font-medium text-gray-800">{clientInfo.site_address}, {clientInfo.site_city}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>📋 Mention DTU :</strong> Les calculs sont établis conformément au DTU 25.41.
                </p>
              </div>

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
                      const isCloison = work.work_type === 'cloison';
                      const hasOuvertures = work.ouvertures && work.ouvertures.length > 0;
                      const hasIsolant = work.isolant && work.isolant !== 'none';

                      return (
                        <div key={workIndex} className="mb-6 last:mb-0">
                          <div className="flex flex-wrap items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                            <span className="text-xl">{workTypeInfo?.icon}</span>
                            <h3 className="font-medium text-gray-700">
                              {workTypeInfo?.label}
                              {isCloison && (
                                <span className="ml-2 text-xs text-gray-500">({getEpaisseurLabel(work.epaisseur)})</span>
                              )}
                            </h3>
                            <span className="text-sm text-gray-500">— {work.longueur}m × {work.hauteur}m = {work.surface} m²</span>
                            {hasOuvertures && (
                              <span className="text-xs text-orange-600">(- {work.surface_ouvertures} m² ouvertures)</span>
                            )}
                          </div>

                          {/* Liste des ouvertures */}
                          {hasOuvertures && (
                            <div className="mb-3 p-2 bg-orange-50 rounded text-xs text-orange-800">
                              <span className="font-medium">Ouvertures déduites : </span>
                              {work.ouvertures.map((ouv, i) => (
                                <span key={i}>
                                  {getOuvertureLabel(ouv.type)} ({ouv.largeur}×{ouv.hauteur}m)
                                  {i < work.ouvertures.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* ✅ Isolant sélectionné */}
                          {hasIsolant && (
                            <div className="mb-3 p-2 bg-green-50 rounded text-xs text-green-800">
                              <span className="font-medium">🧶 Isolant : </span>
                              {getIsolantLabel(work.isolant)}
                            </div>
                          )}

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
                                    <tr key={itemIndex} className={`border-b border-gray-100 ${item.is_modified ? 'bg-yellow-50' : ''}`}>
                                      <td className="py-2 px-3 font-medium text-gray-800">
                                        {item.designation}
                                        {item.is_modified && <span className="ml-2 text-xs text-yellow-600">(modifié)</span>}
                                      </td>
                                      <td className="py-2 px-3 text-center text-gray-500">{item.quantity_calculated}</td>
                                      <td className="py-2 px-3 text-center">
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.quantity_adjusted}
                                          onChange={(e) => updateMaterialQuantity(materialKey, itemIndex, parseFloat(e.target.value) || 0)}
                                          className={`w-20 px-2 py-1 border rounded text-center text-sm ${item.is_modified ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`}
                                        />
                                      </td>
                                      <td className="py-2 px-3 text-center text-gray-600">{item.unit}</td>
                                      <td className="py-2 px-3 text-right text-gray-600">{item.unit_price.toFixed(2)} DH</td>
                                      <td className="py-2 px-3 text-right font-medium text-gray-800">{(item.quantity_adjusted * item.unit_price).toFixed(2)} DH</td>
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

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-3 sm:gap-0 mt-8 pt-6 border-t border-gray-200">
            {/* Bouton Précédent - Hidden on step 1 */}
            <div className="w-full sm:w-auto">
              {currentStep > 1 ? (
                <button 
                  type="button" 
                  onClick={handlePrevious} 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
              ) : (
                <div className="hidden sm:block" /> 
              )}
            </div>
            
            {/* Boutons Annuler + Suivant/Créer */}
            <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
              <Link 
                to="/quotations" 
                className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center transition-colors"
              >
                Annuler
              </Link>
              
              {currentStep < 4 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                >
                  <span>Suivant</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={saving} 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 transition-colors"
                >
                  <CheckIcon className="w-5 h-5" />
                  <span>{saving ? 'Création...' : 'Créer le devis'}</span>
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