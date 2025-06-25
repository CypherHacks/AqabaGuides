// src/App.tsx
import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import SubcategoryView from './components/SubcategoryView';
import BusinessListing from './components/BusinessListing';
import BusinessDetail from './components/BusinessDetail';
import AboutPage from './components/AboutPage';
import ListBusinessPage from './components/ListBusinessPage';
import Footer from './components/Footer';

function HomePage() {
  const navigate = useNavigate();
  const handleCategorySelect = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <>
      <Hero />
      <CategoryGrid onCategorySelect={handleCategorySelect} />
    </>
  );
}

function SubcategoriesPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const handleSubcategorySelect = (catId: string, subId: string) => {
    navigate(`/categories/${catId}/${subId}`);
  };

  return (
    <SubcategoryView
      categoryId={categoryId!}
      onBack={handleBack}
      onSubcategorySelect={handleSubcategorySelect}
    />
  );
}

function BusinessesPage() {
  const { categoryId, subcategoryId } = useParams<{
    categoryId: string;
    subcategoryId: string;
  }>();
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const handleBusinessSelect = (businessId: string) => {
    navigate(`/business/${businessId}`);
  };

  return (
    <BusinessListing
      categoryId={categoryId!}
      subcategoryId={subcategoryId!}
      onBack={handleBack}
      onBusinessSelect={handleBusinessSelect}
    />
  );
}

function BusinessDetailPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <BusinessDetail
      businessId={businessId!}
      onBack={handleBack}
    />
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories/:categoryId" element={<SubcategoriesPage />} />
        <Route
          path="/categories/:categoryId/:subcategoryId"
          element={<BusinessesPage />}
        />
        <Route path="/business/:businessId" element={<BusinessDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/list-your-business" element={<ListBusinessPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
