import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { quotationAPI } from '../../services/api';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

const QuotationListPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quotationAPI.getQuotations()
      .then(res => {
        // adapte selon ta réponse API
        setQuotations(res.data?.data ?? res.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Devis</h1>
        <Link
          to="/quotations/create"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Nouveau devis
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-neutral-500">
          Chargement des devis...
        </div>
      )}

      {/* Empty state */}
      {!loading && quotations.length === 0 && (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 mb-4">
            <DocumentTextIcon className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            Aucun devis créé
          </h2>

          <p className="text-neutral-500 mb-6">
            Vous n’avez encore créé aucun devis.<br />
            Commencez par créer votre premier devis client.
          </p>

          <Link
            to="/quotations/create"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            Créer un devis
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && quotations.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-100 text-sm">
              <tr>
                <th className="p-3 text-left">Référence</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Surface</th>
                <th className="p-3 text-left">Montant</th>
                <th className="p-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {quotations.map(q => (
                <tr key={q.id} className="border-t hover:bg-neutral-50">
                  <td className="p-3 font-medium">{q.reference}</td>
                  <td className="p-3">{q.client_name}</td>
                  <td className="p-3">{q.total_surface} m²</td>
                  <td className="p-3 font-semibold">
                    {Number(q.estimated_amount).toLocaleString()} DH
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/quotations/${q.id}`}
                      className="text-primary font-medium hover:underline"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default QuotationListPage;
