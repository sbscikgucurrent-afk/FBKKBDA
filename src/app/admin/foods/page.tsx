'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Toast, { ToastMessage } from '../../../components/Toast';
import { Plus, Edit2, Trash2, Search, Utensils, X, Image as ImageIcon, Upload } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Biskut');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete state
  const [deletingFood, setDeletingFood] = useState<FoodItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const categories = ['Biskut', 'Makanan', 'Minuman', 'Makanan Ringan', 'Lain-lain'];

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/foods');
      if (res.ok) {
        const data = await res.json();
        setFoods(data.foods || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const openAddModal = () => {
    setEditingFood(null);
    setFormName('');
    setFormCategory('Biskut');
    setFormImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (food: FoodItem) => {
    setEditingFood(food);
    setFormName(food.name);
    setFormCategory(food.category);
    setFormImageUrl(food.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToast({ type: 'error', message: 'Saiz gambar tidak boleh melebihi 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setToast({ type: 'error', message: 'Sila masukkan nama stok makanan.' });
      return;
    }

    setSubmitting(true);
    try {
      let url = '/api/admin/foods';
      let method = 'POST';

      if (editingFood) {
        url = `/api/admin/foods/${editingFood.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          category: formCategory,
          imageUrl: formImageUrl,
          status: 'ACTIVE',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'Gagal menyimpan stok.' });
      } else {
        setToast({
          type: 'success',
          message: editingFood ? 'Stok makanan berjaya dikemas kini!' : 'Stok makanan baharu berjaya ditambah!',
        });
        setIsModalOpen(false);
        fetchFoods();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Ralat rangkaian. Sila cuba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFood = async () => {
    if (!deletingFood) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/foods/${deletingFood.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setToast({
          type: 'success',
          message: `Stok "${deletingFood.name}" berjaya dipadamkan.`,
        });
        setDeletingFood(null);
        fetchFoods();
      } else {
        const data = await res.json();
        setToast({ type: 'error', message: data.error || 'Gagal memadam stok.' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Ralat rangkaian semasa memadam.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFoods = foods.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar userName="Pentadbir" role="ADMIN" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        isOpen={Boolean(deletingFood)}
        title="Padam Stok Makanan"
        message={`Adakah anda pasti mahu memadam stok "${deletingFood?.name}" ini? Tindakan ini tidak boleh dibatalkan.`}
        confirmLabel="YA, PADAM"
        cancelLabel="BATAL"
        isLoading={isDeleting}
        onConfirm={handleDeleteFood}
        onCancel={() => setDeletingFood(null)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pengurusan Stok
              </h1>
              <p className="text-slate-500 text-sm">
                Urus senarai stok makanan, tambah gambar, kemaskini item, atau padam stok.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-200 transition"
            >
              <Plus className="w-5 h-5" />
              <span>+ TAMBAH STOK</span>
            </button>
          </div>

          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama stok atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {loading ? (
            <LoadingSpinner text="Memuatkan senarai stok..." />
          ) : filteredFoods.length === 0 ? (
            <EmptyState
              title="Tiada Stok Ditemui"
              description="Tiada item stok ditemui padan dengan carian anda."
              action={
                <button
                  onClick={openAddModal}
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-sm"
                >
                  Tambah Stok Pertama
                </button>
              }
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                      <th className="py-4 px-6">Gambar &amp; Nama Stok</th>
                      <th className="py-4 px-6">Kategori</th>
                      <th className="py-4 px-6 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredFoods.map((food) => (
                      <tr key={food.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                          {food.imageUrl ? (
                            <img
                              src={food.imageUrl}
                              alt={food.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                              <Utensils className="w-6 h-6" />
                            </div>
                          )}
                          <span>{food.name}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{food.category}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(food)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setDeletingFood(food)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Padam
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingFood ? 'Edit Stok Makanan' : 'Tambah Stok Makanan Baharu'}
            </h3>

            <form onSubmit={handleSaveFood} className="space-y-4">
              {/* Image Preview & Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Gambar Stok</label>
                <div className="flex items-center gap-4">
                  {formImageUrl ? (
                    <div className="relative group">
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600"
                        title="Padam gambar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-semibold">Tiada Gambar</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition">
                      <Upload className="w-4 h-4" />
                      <span>Muat Naik Fail Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Atau tampal URL Gambar..."
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Stok / Makanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biskut Cream Cracker"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center gap-2"
                >
                  {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>SIMPAN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
