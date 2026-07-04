import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '../context/CartContext';
import { createOrderRecord, getStoredOrders, saveOrders, getProductImageForName } from '../lib/sweetStore';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  deliveryAddress: z.string().min(10, 'Please enter your delivery address'),
  houseNumber: z.string().optional(),
  street: z.string().optional(),
  landmark: z.string().optional(),
  village: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  paymentMethod: z.enum(['COD', 'RAZORPAY']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema), defaultValues: { paymentMethod: 'COD' } });
  const watchedPhone = watch('phone');
  const [matchedOrders, setMatchedOrders] = useState<any[]>([]);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const onSubmit = (values: CheckoutFormValues) => {
    const manualAddress = [values.houseNumber, values.street, values.landmark, values.village, values.city, values.state, values.pincode]
      .filter(Boolean)
      .join(', ');
    const deliveryAddress = manualAddress.trim().length >= 10 ? manualAddress : values.deliveryAddress;
    // If Razorpay selected, create a server order and open Razorpay Checkout
    if (values.paymentMethod === 'RAZORPAY') {
      (async () => {
        try {
          const resp = await fetch(`${window.location.origin.replace(/:\d+$/, '') || ''}:4000/api/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: Math.round(subtotal * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` }),
          });
          const json = await resp.json();
          if (!json?.ok) throw new Error(json?.error || 'Order creation failed');
          const razorOrder = json.order;
          const keyId = json.key_id;

          // Load Razorpay script
          await new Promise((resolve, reject) => {
            const src = 'https://checkout.razorpay.com/v1/checkout.js';
            if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
            const s = document.createElement('script');
            s.src = src;
            s.onload = () => resolve(true);
            s.onerror = () => reject(new Error('Failed to load Razorpay script'));
            document.body.appendChild(s);
          });

          const options = {
            key: keyId,
            amount: razorOrder.amount,
            currency: razorOrder.currency,
            name: 'SVK Sweets',
            description: 'Order payment',
            order_id: razorOrder.id,
            handler: async function (response: any) {
              // verify signature server-side
              const verifyResp = await fetch(`${window.location.origin.replace(/:\d+$/, '') || ''}:4000/api/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }),
              });
              const verifyJson = await verifyResp.json();
              if (!verifyJson?.ok) {
                alert('Payment verification failed');
                return;
              }

              const order = createOrderRecord({
                customerName: values.customerName,
                phone: values.phone,
                deliveryAddress,
                paymentMethod: values.paymentMethod,
                totalAmount: subtotal,
                items: items.map((item) => ({
                  productId: item.id,
                  productName: item.name,
                  quantity: item.quantity,
                  weightOption: item.selectedWeight ?? '250g',
                  price: item.price,
                  imageUrl: item.imageUrl || getProductImageForName(item.name),
                })),
                latitude: coords?.latitude,
                longitude: coords?.longitude,
              });
              order.paymentStatus = 'Paid';
              order.status = 'Accepted';
              const existingOrders = getStoredOrders();
              saveOrders([order, ...existingOrders]);
              clearCart();
              setSubmittedOrder(order.orderNumber);
              window.dispatchEvent(new CustomEvent('svk:new-order', { detail: order }));
              setTimeout(() => navigate(`/track-order?order=${order.orderNumber}`), 1200);
            },
            modal: { escape: false },
          } as any;

          // @ts-ignore
          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (e) {
          alert('Failed to initiate Razorpay checkout: ' + e);
        }
      })();
      return;
    }

    const order = createOrderRecord({
      customerName: values.customerName,
      phone: values.phone,
      deliveryAddress,
      paymentMethod: values.paymentMethod,
      totalAmount: subtotal,
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        weightOption: item.selectedWeight ?? '250g',
        price: item.price,
        imageUrl: item.imageUrl || getProductImageForName(item.name),
      })),
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    });

    const existingOrders = getStoredOrders();
    saveOrders([order, ...existingOrders]);
    clearCart();
    setSubmittedOrder(order.orderNumber);
    window.dispatchEvent(new CustomEvent('svk:new-order', { detail: order }));
    setTimeout(() => navigate(`/track-order?order=${order.orderNumber}`), 1200);
  };

  useEffect(() => {
    if (!watchedPhone || watchedPhone.trim().length < 4) {
      setMatchedOrders([]);
      return;
    }
    const all = getStoredOrders();
    setMatchedOrders(all.filter((o) => o.phone?.includes(watchedPhone.trim())));
  }, [watchedPhone]);

  if (!items.length) {
    return <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-sm"><h1 className="text-3xl font-semibold text-stone-900">Your cart is empty</h1><p className="mt-3 text-stone-600">Add items before checkout.</p></div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Checkout</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-semibold text-stone-700">Customer name</label>
            <input {...register('customerName')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            {errors.customerName && <p className="mt-2 text-sm text-red-500">{errors.customerName.message}</p>}
          </div>
            <div>
              <label className="text-sm font-semibold text-stone-700">Phone number</label>
              <input {...register('phone')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
              {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone.message}</p>}
              {matchedOrders.length > 0 && (
                <div className="mt-3 space-y-2 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm">
                  <p className="font-semibold">Previous orders matching this number</p>
                  {matchedOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between">
                      <span>{o.orderNumber} · {o.deliveryAddress}</span>
                      <a href={`/track-order?order=${o.orderNumber}`} className="text-[#8B4513] font-semibold">Track</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          <div>
            <label className="text-sm font-semibold text-stone-700">Delivery address</label>
            <textarea {...register('deliveryAddress')} rows={4} placeholder="Full HNo, street, landmark, village, city, state, pincode" className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            {errors.deliveryAddress && <p className="mt-2 text-sm text-red-500">{errors.deliveryAddress.message}</p>}
            <button type="button" onClick={() => {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setCoords({ latitude: lat, longitude: lon });
                try {
                  const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
                  const data = await resp.json();
                  const addr = data.address || {};
                  setValue('houseNumber', addr.house_number || '');
                  setValue('street', addr.road || addr.pedestrian || '');
                  setValue('landmark', addr.suburb || addr.neighbourhood || addr.village || '');
                  setValue('village', addr.village || addr.town || addr.suburb || '');
                  setValue('city', addr.city || addr.town || addr.village || '');
                  setValue('state', addr.state || '');
                  setValue('pincode', addr.postcode || '');
                  const formatted = data.display_name || `Current location: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                  setValue('deliveryAddress', formatted);
                } catch (e) {
                  const coords = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                  setValue('deliveryAddress', `Current location: ${coords}`);
                }
              }, () => {
                // ignore location errors for now
              });
            }} className="mt-3 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200">Use current location</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-stone-700">House / Flat no.</label>
              <input {...register('houseNumber')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700">Street name</label>
              <input {...register('street')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700">Landmark</label>
              <input {...register('landmark')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700">Village / locality</label>
              <input {...register('village')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700">City</label>
              <input {...register('city')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700">State</label>
              <input {...register('state')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-700">Pincode</label>
              <input {...register('pincode')} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            </div>
          </div>
         
          <div>
            <label className="text-sm font-semibold text-stone-700">Payment option</label>
            <div className="mt-3 flex gap-4">
              <label className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2"><input type="radio" value="COD" {...register('paymentMethod')} /> Cash on Delivery</label>
              <label className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2"><input type="radio" value="RAZORPAY" {...register('paymentMethod')} /> Razorpay</label>
            </div>
            <details className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
              <summary className="font-semibold">Razorpay Test Integration (read before testing)</summary>
              <div className="mt-2 space-y-2">
                <p>This app uses Razorpay in Test Mode for integration testing. Use only Test API keys and test cards/UPI flows. No real money is charged.</p>
                <p className="text-xs text-stone-500">Helpful: use UPI ID <code>success@razorpay</code> for successful UPI test, or test cards from Razorpay docs.</p>
                <p className="text-xs"><a href="https://razorpay.com/docs/build/llm-docs/payments/payment-gateway/web-integration/custom/go-live-checklist.md" target="_blank" rel="noreferrer" className="text-[#8B4513] font-semibold">Razorpay integration docs</a></p>
              </div>
            </details>
          </div>
          <button className="w-full rounded-full bg-[#8B4513] px-6 py-3 font-semibold text-white">Place Order</button>
        </form>
        {submittedOrder && <p className="mt-4 text-sm font-semibold text-emerald-600">Order placed successfully. Tracking ID: {submittedOrder}</p>}
      </div>
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-900">Order Summary</h2>
        <div className="mt-6 space-y-3">
          {items.map((item) => <div key={`${item.id}-${item.selectedWeight}`} className="flex items-center justify-between text-sm text-stone-600"><span>{item.name} × {item.quantity}</span><span>₹{item.price * item.quantity}</span></div>)}
        </div>
        <div className="mt-6 border-t border-stone-200 pt-4 flex items-center justify-between text-lg font-semibold text-stone-900"><span>Total</span><span>₹{subtotal}</span></div>
      </div>
    </div>
  );
};

export default CheckoutPage;
