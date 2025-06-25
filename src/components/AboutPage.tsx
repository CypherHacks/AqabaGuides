// src/pages/AboutPage.tsx
import React from 'react';

const AboutPage: React.FC = () => (
  <main className="max-w-screen-xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6 text-blue-800">About AqabaGuide</h1>
    
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Your Gateway to Business Success in ASEZ</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        AqabaGuide is the premier business directory designed to empower <strong>entrepreneurs, investors, and businesses</strong> looking to establish or expand their commercial activities in the <strong>Aqaba Special Economic Zone (ASEZ)</strong>. Our platform serves as a strategic tool, offering precise details on world-class infrastructure projects, logistics services, and investment opportunities in Aqaba.
      </p>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Whether you're a local startup or a global investor, we connect you with the right partners, services, and resources to thrive in one of the Middle East's most dynamic economic hubs.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Why Choose AqabaGuide?</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li><strong>Comprehensive Directory:</strong> Access verified contacts for logistics, trade, tourism, and industrial services in ASEZ.</li>
        <li><strong>Investment Support:</strong> Stay updated with the latest economic developments, incentives, and regulatory frameworks.</li>
        <li><strong>Strategic Networking:</strong> Bridge connections between businesses, government entities, and international investors.</li>
        <li><strong>Economic Growth:</strong> Contribute to Aqaba’s vision as a regional leader in trade, tourism, and innovation.</li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Our Mission</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        At <strong>Ayn Al Aqaba</strong>, we work tirelessly to promote Aqaba’s economic development on local, regional, and international stages. This directory reflects our commitment to:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Creating a <strong>favorable business environment</strong> in ASEZ.</li>
        <li>Supporting the growth of SMEs and large-scale enterprises alike.</li>
        <li>Providing up-to-date, actionable insights for investors and entrepreneurs.</li>
      </ul>
    </section>

    <section className="bg-blue-50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Join Aqaba’s Economic Success Story</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Explore endless possibilities in ASEZ—where strategic location, tax incentives, and cutting-edge infrastructure converge. Let AqabaGuide be your first step toward unlocking new opportunities.
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
        Connect With Us
      </button>
    </section>
  </main>
);

export default AboutPage;