import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, Leaf, Sparkles, Store, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { api } from '../lib/api';
import type { BannerItem, Category, ContactInfo, Product, TestimonialItem } from '../types';

const HomePage = () => {
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: async () => {
    const response = await api.get('/catalog/categories');
    return response.data.data as Category[];
  }});

  const { data: featuredData } = useQuery({ queryKey: ['featuredProducts'], queryFn: async () => {
    const response = await api.get('/catalog/featured');
    return response.data.data as Product[];
  }});

  const { data: bestSellersData } = useQuery({ queryKey: ['bestSellers'], queryFn: async () => {
    const response = await api.get('/catalog/bestsellers');
    return response.data.data as Product[];
  }});

  const { data: bannersData } = useQuery({ queryKey: ['banners'], queryFn: async () => {
    const response = await api.get('/public/banners');
    return response.data.data as BannerItem[];
  }});

  const { data: testimonialsData } = useQuery({ queryKey: ['testimonials'], queryFn: async () => {
    const response = await api.get('/public/testimonials');
    return response.data.data as TestimonialItem[];
  }});

  const { data: contactData } = useQuery({ queryKey: ['contact'], queryFn: async () => {
    const response = await api.get('/public/contact');
    return response.data.data as ContactInfo;
  }});

  const categories = categoriesData || [];
  const featuredProducts = featuredData || [];
  const bestSellers = bestSellersData || [];
  const banners = bannersData || [];
  const testimonials = testimonialsData || [];
  const contact = contactData;

  return (
    <div className="space-y-12">
      <section className="grid gap-8 overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FFF7D6] px-3 py-2 text-sm font-semibold text-[#8B4513]">
            <Sparkles size={16} /> Premium handcrafted sweets since 1987
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">Authentic SVK Sweets for every celebration.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">From decadent Kova sweets to festival gift boxes, discover classic Indian confections made with tradition, purity, and premium ingredients.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/products" className="rounded-full bg-[#8B4513] px-6 py-3 font-semibold text-white transition hover:bg-[#6f3410]">Shop Collection</Link>
            <Link to="/about" className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:border-[#D4AF37] hover:text-[#8B4513]">About SVK</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-2xl font-semibold text-[#8B4513]">10k+</p>
              <p className="text-sm text-stone-600">Happy customers</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-2xl font-semibold text-[#8B4513]">24/7</p>
              <p className="text-sm text-stone-600">Orders & support</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-2xl font-semibold text-[#8B4513]">4.9★</p>
              <p className="text-sm text-stone-600">Average rating</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-gradient-to-br from-[#FFF7D6] via-white to-[#F2E2C6] p-6">
          <img src={banners[0]?.imageUrl || 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1200&q=80'} alt="SVK sweets hero" className="h-full w-full rounded-[1.5rem] object-cover" />
          <div className="mt-4 rounded-2xl border border-[#D4AF37]/30 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Festival Special</p>
            <p className="mt-2 text-xl font-semibold text-stone-900">Diwali Gift Boxes with premium dry fruit sweets.</p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Categories</p>
            <h2 className="text-3xl font-semibold text-stone-900">Browse by category</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.id}`} className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img src={category.imageUrl || 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80'} alt={category.name} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-stone-900">{category.name}</h3>
                <p className="mt-2 text-sm leading-7 text-stone-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Featured</p>
            <h2 className="text-3xl font-semibold text-stone-900">Featured sweets</h2>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-sm font-semibold text-[#8B4513]">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-stone-200 bg-[#FFF7D6] p-6 lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B4513]">Why choose SVK</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-900">Freshly made with premium ingredients and thoughtful packaging.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: BadgeCheck, title: 'Premium Quality', copy: 'Made with fresh milk, pure ghee, and finest nuts.' },
            { icon: Truck, title: 'Fast Delivery', copy: 'Same-day and scheduled deliveries across the city.' },
            { icon: ShieldCheck, title: 'Hygienic Prep', copy: 'Crafted and packed in clean, modern conditions.' },
            { icon: Leaf, title: 'Authentic Taste', copy: 'Traditional recipes preserved with modern standards.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-4 shadow-sm">
              <item.icon className="text-[#8B4513]" />
              <h3 className="mt-3 text-lg font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Best sellers</p>
            <h2 className="text-3xl font-semibold text-stone-900">Customer favourites</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">About SVK Sweets</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-900">A legacy of indulgence and celebration.</h2>
          <p className="mt-4 text-lg leading-8 text-stone-600">We combine age-old recipes and modern quality practices to bring you premium sweets that delight every generation.</p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#8B4513]">Learn more <ArrowRight size={16} /></Link>
        </div>
        <div className="space-y-4 rounded-[2rem] border border-stone-200 bg-stone-900 p-7 text-white shadow-sm">
          <div className="flex items-center gap-3 text-[#D4AF37]"><Store size={18} /> <span className="font-semibold">Contact SVK Sweets</span></div>
          <p className="text-lg leading-8 text-stone-300">{contact?.address || '12, Anna Salai, Chennai'}</p>
          <p className="text-lg leading-8 text-stone-300">Phone: {contact?.phone || '+91 98765 43210'}</p>
          <p className="text-lg leading-8 text-stone-300">WhatsApp: {contact?.whatsapp || '+91 98765 43210'}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 font-semibold text-stone-900">Start a conversation <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Testimonials</p>
          <h2 className="text-3xl font-semibold text-stone-900">What customers say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 text-[#D4AF37]">{'★'.repeat(item.rating)}</div>
              <p className="mt-4 text-base leading-8 text-stone-600">“{item.message}”</p>
              <div className="mt-5">
                <p className="font-semibold text-stone-900">{item.customerName}</p>
                <p className="text-sm text-stone-500">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
