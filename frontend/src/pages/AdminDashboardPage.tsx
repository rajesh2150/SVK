import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getBasicAuthHeader } from '../lib/api';
import type { Category, Product } from '../types';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<{ username: string; password: string } | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('svk-admin-auth');
    if (!stored) {
      navigate('/admin/login');
      return;
    }
    setAuth(JSON.parse(stored));
  }, [navigate]);

  const headers = auth ? getBasicAuthHeader(auth.username, auth.password) : undefined;

  const { data: dashboardData } = useQuery({ queryKey: ['admin-dashboard'], queryFn: async () => {
    const response = await api.get('/admin/dashboard', { headers });
    return response.data.data;
  }, enabled: !!headers });

  const { data: categoriesData } = useQuery({ queryKey: ['admin-categories'], queryFn: async () => {
    const response = await api.get('/admin/categories', { headers });
    return response.data.data as Category[];
  }, enabled: !!headers });

  const { data: productsData } = useQuery({ queryKey: ['admin-products'], queryFn: async () => {
    const response = await api.get('/admin/products', { headers });
    return response.data.data as Product[];
  }, enabled: !!headers });

  const createCategory = async () => {
    if (!auth) return;
    await api.post('/admin/categories', { name: categoryName, active: true }, { headers });
    setCategoryName('');
    window.location.reload();
  };

  const createProduct = async () => {
    if (!auth) return;
    await api.post('/admin/products', { name: productName, price: Number(productPrice), stock: 20, active: true, categoryId: 1 }, { headers });
    setProductName('');
    setProductPrice('');
    window.location.reload();
  };

  if (!auth) return null;

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Admin Dashboard</h1>
        <p className="mt-3 text-stone-600">Manage categories, products, and the storefront from one place.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Products', value: dashboardData?.totalProducts ?? 0 },
          { label: 'Total Categories', value: dashboardData?.totalCategories ?? 0 },
          { label: 'Featured Products', value: dashboardData?.featuredProducts ?? 0 },
          { label: 'Best Sellers', value: dashboardData?.bestSellers ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#8B4513]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">Manage Categories</h2>
          <div className="mt-6 space-y-4">
            <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category" className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" />
            <button onClick={createCategory} className="rounded-full bg-[#8B4513] px-5 py-3 font-semibold text-white">Add Category</button>
          </div>
          <div className="mt-6 space-y-3">
            {(categoriesData || []).map((category) => <div key={category.id} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-700">{category.name}</div>)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">Manage Products</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" />
            <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Price" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" />
          </div>
          <button onClick={createProduct} className="mt-4 rounded-full bg-[#8B4513] px-5 py-3 font-semibold text-white">Add Product</button>
          <div className="mt-6 space-y-3">
            {(productsData || []).slice(0, 6).map((product) => <div key={product.id} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-700">{product.name} — ₹{product.price}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
