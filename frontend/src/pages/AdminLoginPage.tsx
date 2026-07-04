import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_AUTH_STORAGE_KEY, isAdminCredentialsValid } from '../lib/sweetStore';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isAdminCredentialsValid(username, password)) {
      localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify({ username, password }));
      navigate('/admin');
      return;
    }
    setError('Invalid admin credentials');
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-stone-900">Admin Login</h1>
      <p className="mt-3 text-stone-600">Access the SVK Sweets management dashboard.</p>
      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" placeholder="Password" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-full bg-[#8B4513] px-6 py-3 font-semibold text-white">Sign in</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
