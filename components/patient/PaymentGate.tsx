import React, { useState } from 'react';
import { Lock, CreditCard, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { userAPI } from '../../services/supabase-api';
import { useAuth } from '../auth/AuthContext';

interface PaymentGateProps {
    title: string;
    description: string;
    price: number;
    onPaymentSuccess: () => void;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({
    title,
    description,
    price,
    onPaymentSuccess
}) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // Simulação de processamento de pagamento
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Atualizar status no banco de dados
            await userAPI.updateTdahStatus(user.id, { paid: true });

            // Chamar callback de sucesso (que deve recarregar o usuário/estado)
            onPaymentSuccess();
        } catch (err) {
            console.error('Erro ao processar pagamento:', err);
            setError('Erro ao processar pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center text-white">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-slate-300 text-sm">{description}</p>
            </div>

            <div className="p-8 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-600 font-medium">Total a pagar</span>
                    <span className="text-3xl font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                    </span>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Acesso completo ao teste de triagem TDAH</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Relatório detalhado com pontuação por categoria</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Envio automático para seu terapeuta</span>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processando...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            <span>Pagar e Liberar Acesso</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-slate-400">
                    Pagamento seguro via PIX ou Cartão de Crédito
                </p>
            </div>
        </div>
    );
};
