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
import Sponsors from './components/Sponsors';

function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <Hero />
      <CategoryGrid onCategorySelect={id => navigate(`/categories/${id}`)} />
      <Sponsors />
    </>
  );
}

function SubcategoriesPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  return (
    <SubcategoryView
      categoryId={categoryId!}
      onBack={() => navigate(-1)}
      onSubcategorySelect={(cat, sub) => navigate(`/categories/${cat}/${sub}`)}
    />
  );
}

function BusinessesPage() {
  const { categoryId, subcategoryId } = useParams<{
    categoryId: string;
    subcategoryId: string;
  }>();
  const navigate = useNavigate();
  return (
    <BusinessListing
      categoryId={categoryId!}
      subcategoryId={subcategoryId!}
      onBack={() => navigate(-1)}
      onBusinessSelect={id => navigate(`/business/${id}`)}
    />
  );
}

function BusinessDetailPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  return (
    <BusinessDetail
      businessId={businessId!}
      onBack={() => navigate(-1)}
    />
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      
      <main className="relative">
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
          <Route path="*" element={<div className="p-8 text-center">Page Not Found</div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}