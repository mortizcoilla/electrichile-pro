'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MATERIALS, MATERIAL_CATEGORIES } from '@/data/materials';
import { useMaterialStore } from '@/stores/materialStore';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  onBack: () => void;
}

export default function MaterialsScreen({ onBack }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount } = useMaterialStore();

  const filtered = MATERIALS.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todos' || m.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (m: typeof MATERIALS[0]) => {
    addToCart({ id: m.id, name: m.name, quantity: 1, unit: m.unit, unitPrice: m.unitPrice, totalPrice: m.unitPrice });
  };

  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-background">
      <Header title="Materiales" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cable, tablero, interruptor..." className="w-full h-12 pl-10 pr-4 rounded-[10px] border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-primary" />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {MATERIAL_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${category === cat ? 'bg-accent-primary text-background' : 'bg-elevated text-muted border border-border'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((m) => {
            const inCart = cart.find((c) => c.id === m.id);
            return (
              <motion.div key={m.id} layout className="card p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted">{m.description}</p>
                  <p className="text-sm font-semibold text-accent-primary mt-1">{formatCurrency(m.unitPrice)}/{m.unit}</p>
                </div>
                {inCart ? (
                  <div className="flex items-center gap-2 ml-3">
                    <button onClick={() => updateQuantity(m.id, Math.max(1, inCart.quantity - 1))} className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{inCart.quantity}</span>
                    <button onClick={() => updateQuantity(m.id, inCart.quantity + 1)} className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
                      <Plus className="w-4 h-4 text-background" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleAdd(m)} className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center ml-3">
                    <Plus className="w-5 h-5 text-accent-primary" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {itemCount > 0 && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setShowCart(true)} className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-accent-primary text-background flex items-center justify-center shadow-lg z-40">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-danger text-white text-xs flex items-center justify-center">{itemCount}</span>
          </motion.button>
        )}

        <AnimatePresence>
          {showCart && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end" onClick={() => setShowCart(false)}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-surface w-full max-w-md md:max-w-lg rounded-t-2xl md:rounded-2xl p-6 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Carrito</h3>
                  <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-muted" /></button>
                </div>
                {cart.length === 0 ? (
                  <p className="text-sm text-muted text-center py-8">Carrito vacío</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-elevated rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted">{item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center"><Plus className="w-3 h-3 text-background" /></button>
                          <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-accent-danger/20 flex items-center justify-center ml-1"><Trash2 className="w-3 h-3 text-accent-danger" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-lg font-bold text-accent-primary">{formatCurrency(getTotal())}</span>
                      </div>
                      <Button onClick={() => { clearCart(); setShowCart(false); }} variant="outline" className="w-full">Limpiar carrito</Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
