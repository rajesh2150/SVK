import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('order') || '');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleTrack = async () => {
    const response = await api.get(`/orders/${orderId}`);
    setResult(response.data.data);
  };

  useEffect(() => {
    if (orderId) handleTrack();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Track your order</h1>
        <p className="mt-3 text-stone-600">Use your order ID and phone number to see live status.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" className="rounded-full border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="rounded-full border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
          <button onClick={handleTrack} className="rounded-full bg-[#8B4513] px-6 py-3 font-semibold text-white">Track</button>
        </div>
      </div>

      {result && (
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">Order #{result.orderNumber}</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
            <span className="rounded-full bg-stone-100 px-3 py-1">Status: {result.status}</span>
            <span className="rounded-full bg-stone-100 px-3 py-1">Payment: {result.paymentStatus}</span>
            <span className="rounded-full bg-stone-100 px-3 py-1">Phone: {result.phone}</span>
          </div>
          <p className="mt-6 text-lg leading-8 text-stone-600">Delivery address: {result.deliveryAddress}</p>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
