import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { quotationAPI } from '../../services/api';

const QuotationDetailPage = () => {
    const { id } = useParams();
    const [quotation, setQuotation] = useState(null);


    useEffect(() => {
        quotationAPI.getQuotation(id).then(res => setQuotation(res.data.data));
    }, [id]);


    const downloadPdf = async () => {
        const res = await quotationAPI.exportPdf(id);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${quotation.reference}.pdf`;
        a.click();
    };


    if (!quotation) return null;

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-semibold mb-4">{quotation.reference}</h1>


            <div className="bg-white p-6 rounded-xl shadow space-y-2">
                <p><strong>Client :</strong> {quotation.client_name}</p>
                <p><strong>Adresse :</strong> {quotation.site_address}</p>
                <p><strong>Surface :</strong> {quotation.total_surface} m²</p>
                <p><strong>Montant :</strong> {quotation.estimated_amount} DH</p>
                <p><strong>Date :</strong> {quotation.created_at}</p>


                <button
                    onClick={downloadPdf}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
                >
                    Exporter PDF
                </button>
            </div>
        </DashboardLayout>
    );
};


export default QuotationDetailPage;