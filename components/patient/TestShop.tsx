import React, { useState } from 'react';

interface Test {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export const TestShop: React.FC = () => {
  const [tests] = useState<Test[]>([
    {
      id: '1',
      name: 'Teste de Ansiedade (STAI)',
      description: 'Avaliação de níveis de ansiedade estado e traço',
      price: 49.9,
      category: 'Psicológico',
    },
    {
      id: '2',
      name: 'Teste de Depressão (BDI)',
      description: 'Inventário de Depressão de Beck',
      price: 49.9,
      category: 'Psicológico',
    },
    {
      id: '3',
      name: 'Teste de Personalidade (MBTI)',
      description: 'Indicador de Tipo de Myers-Briggs',
      price: 79.9,
      category: 'Personalidade',
    },
    {
      id: '4',
      name: 'Teste de Inteligência Emocional',
      description: 'Avaliação de competências emocionais',
      price: 59.9,
      category: 'Emocional',
    },
  ]);

  const [cart, setCart] = useState<Test[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (test: Test) => {
    setCart([...cart, test]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Loja de Testes</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          🛒 Carrinho
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="mb-3">
              <h3 className="font-semibold text-slate-900">{test.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{test.category}</p>
            </div>
            <p className="text-sm text-slate-600 mb-4">{test.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-teal-600">R$ {test.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart(test)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Carrinho de Compras</h2>
          {cart.length === 0 ? (
            <p className="text-slate-600">Seu carrinho está vazio</p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-teal-600">R$ {total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors">
                  Finalizar Compra
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
