// src/pages/ListBusinessPage.tsx
import React, { useState } from 'react';

interface FormData {
  name: string;
  industry: string;
  contact: string;
  email: string;
  phone: string;
  message: string;
  terms: boolean;
}

const ListBusinessPage: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    industry: '',
    contact: '',
    email: '',
    phone: '',
    message: '',
    terms: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      // checkbox has a checked property
      const checked = (e.target as HTMLInputElement).checked;
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/.netlify/functions/send-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('sent');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">
          Grow Your Business in ASEZ
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join AqabaGuide’s trusted directory and connect with investors, customers,
          and partners in the Aqaba Special Economic Zone.
        </p>
      </section>

      {/* Benefits Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
          Why List With Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Increased Visibility
            </h3>
            <p className="text-gray-700">
              Reach thousands of potential clients and investors searching for
              services in ASEZ.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Premium Advertising
            </h3>
            <p className="text-gray-700">
              Highlight your business with sponsored listings, banners, and
              featured spots.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Networking Opportunities
            </h3>
            <p className="text-gray-700">
              Get invited to exclusive ASEZ investor events and trade forums.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">
          Submit Your Business
        </h2>
        <p className="mb-8 text-gray-600">
          Complete the form below, and our team will contact you within 24 hours
          to discuss listing options, advertising packages, and pricing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name & Industry */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Business Name *
              </label>
              <input
                name="name"
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Aqaba Logistics Solutions"
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry *
              </label>
              <select
                name="industry"
                id="industry"
                required
                value={form.industry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="logistics">Logistics</option>
                <option value="tourism">Tourism</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Person *
            </label>
            <input
              name="contact"
              id="contact"
              type="text"
              required
              value={form.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., John Doe"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                name="email"
                id="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone *
              </label>
              <input
                name="phone"
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="+962 7X XXX XXXX"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Additional Details
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about your business, advertising preferences, or special requests..."
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center">
            <input
              name="terms"
              id="terms"
              type="checkbox"
              required
              checked={form.terms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to AqabaGuide’s{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
              .
            </label>
          </div>

          {/* Submit Button & Status */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
          >
            {status === 'sending' ? 'Sending…' : 'Submit Application'}
          </button>
          {status === 'sent' && (
            <p className="mt-4 text-center text-green-500">✓ Submitted!</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-center text-red-500">✕ Submission failed.</p>
          )}
        </form>
      </section>

      {/* CTA Footer */}
      <section className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Need Help?</h3>
        <p className="mb-4 text-gray-600">
          Email us at{' '}
          <a href="mailto:partners@aqabaguide.com" className="text-blue-600 hover:underline">
            partners@aqabaguide.com
          </a>{' '}
          or call{' '}
          <a href="tel:+962776911233" className="text-blue-600 hover:underline">
            +962 7 7691 1233
          </a>
          .
        </p>
      </section>
    </main>
  );
};

export default ListBusinessPage;
