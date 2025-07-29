// src/pages/ListBusinessPage.tsx
import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

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
  const { t } = useTranslation();
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
      const checked = (e.target as HTMLInputElement).checked;
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
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
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">
          {t('list.heroTitle')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('list.heroDesc')}
        </p>
      </section>

      {/* Benefits Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
          {t('list.benefitsTitle')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              {t('list.benefits.visibility.title')}
            </h3>
            <p className="text-gray-700">
              {t('list.benefits.visibility.desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              {t('list.benefits.advertising.title')}
            </h3>
            <p className="text-gray-700">
              {t('list.benefits.advertising.desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              {t('list.benefits.networking.title')}
            </h3>
            <p className="text-gray-700">
              {t('list.benefits.networking.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">
          {t('list.formTitle')}
        </h2>
        <p className="mb-8 text-gray-600">
          {t('list.formDesc')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name & Industry */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('list.fields.name.label')} *
              </label>
              <input
                name="name"
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('list.fields.name.placeholder')}
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                {t('list.fields.industry.label')} *
              </label>
              <select
                name="industry"
                id="industry"
                required
                value={form.industry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('list.fields.industry.placeholder')}</option>
                {['logistics','tourism','commercial','industrial','other'].map(val => (
                  <option key={val} value={val}>
                    {t(`categories.${val}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              {t('list.fields.contact.label')} *
            </label>
            <input
              name="contact"
              id="contact"
              type="text"
              required
              value={form.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('list.fields.contact.placeholder')}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('list.fields.email.label')} *
              </label>
              <input
                name="email"
                id="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('list.fields.email.placeholder')}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('list.fields.phone.label')} *
              </label>
              <input
                name="phone"
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('list.fields.phone.placeholder')}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t('list.fields.message.label')}
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('list.fields.message.placeholder')}
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
              <Trans i18nKey="list.fields.terms">
                I agree to AqabaGuide’s <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.
              </Trans>
            </label>
          </div>

          {/* Submit Button & Status */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
          >
            {status === 'sending' ? t('list.status.sending') : t('list.button.submit')}
          </button>
          {status === 'sent' && (
            <p className="mt-4 text-center text-green-500">{t('list.status.sent')}</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-center text-red-500">{t('list.status.error')}</p>
          )}
        </form>
      </section>

      {/* CTA Footer */}
      <section className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('list.cta.title')}</h3>
        <p className="mb-4 text-gray-600">
          <Trans i18nKey="list.cta.desc">
            Email us at <a href="mailto:partners@aqabaguide.com" className="text-blue-600 hover:underline">partners@aqabaguide.com</a> or call <a href="tel:+962776911233" className="text-blue-600 hover:underline">+962 7 7691 1233</a>.
          </Trans>
        </p>
      </section>
    </main>
  );
};

export default ListBusinessPage;
