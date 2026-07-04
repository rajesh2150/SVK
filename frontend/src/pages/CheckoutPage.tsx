import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  deliveryAddress: z.string().min(10, 'Please enter your delivery address'),
  paymentMethod: z.enum(['COD', 'RAZORPAY']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema), defaultValues: { paymentMethod: 'COD' } });

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      const payload = {
        customerName: values.customerName,
        phone: values.phone,
        deliveryAddress: values.deliveryAddress,
        paymentMethod: values.paymentMethod,
        totalAmount: subtotal,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity, weightOption: item.selectedWeight }))
      };
      const response = await api.post('/orders/checkout', payload);
      const orderNumber = response.data.data.orderNumber;
      clearCart();
      setSubmittedOrder(orderNumber);
      setTimeout(() => navigate(`/track-order?order=${orderNumber}`), 1200);
    } catch (error) {
      console.error(error);
    }
  };

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
          </div>
          <div>
            <label className="text-sm font-semibold text-stone-700">Delivery address</label>
            <textarea {...register('deliveryAddress')} rows={4} className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" />
            {errors.deliveryAddress && <p className="mt-2 text-sm text-red-500">{errors.deliveryAddress.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-stone-700">Payment option</label>
            <div className="mt-3 flex gap-4">
              <label className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2"><input type="radio" value="COD" {...register('paymentMethod')} /> Cash on Delivery</label>
              <label className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2"><input type="radio" value="RAZORPAY" {...register('paymentMethod')} /> Razorpay</label>
            </div>
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
