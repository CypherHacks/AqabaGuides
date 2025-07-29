// src/pages/AboutPage.tsx
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        {t('about.title')}
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          {t('about.gatewayTitle')}
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          <Trans
            i18nKey="about.gatewayDesc1"
            values={{
              bold1: t('about.bold.entrepreneurs'),
              bold2: t('about.bold.ASEZ'),
            }}
            components={[<strong key="0"/>, <strong key="1"/>]}
          />
        </p>
        <p className="mb-4 text-gray-700 leading-relaxed">
          {t('about.gatewayDesc2')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          {t('about.whyTitle')}
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>{t('about.features.comprehensive.title')}:</strong>{' '}
            {t('about.features.comprehensive.desc')}
          </li>
          <li>
            <strong>{t('about.features.investment.title')}:</strong>{' '}
            {t('about.features.investment.desc')}
          </li>
          <li>
            <strong>{t('about.features.networking.title')}:</strong>{' '}
            {t('about.features.networking.desc')}
          </li>
          <li>
            <strong>{t('about.features.growth.title')}:</strong>{' '}
            {t('about.features.growth.desc')}
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          {t('about.missionTitle')}
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          <Trans
            i18nKey="about.missionDesc1"
            values={{ bold: t('about.bold.brandName') }}
            components={[<strong key="0"/>]}
          />
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>{t('about.mission.point1')}</li>
          <li>{t('about.mission.point2')}</li>
          <li>{t('about.mission.point3')}</li>
        </ul>
      </section>

      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          {t('about.joinTitle')}
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          {t('about.joinDesc')}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
          {t('about.joinButton')}
        </button>
      </section>
    </main>
  );
};

export default AboutPage;
