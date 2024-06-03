'use client';

import React from 'react';
import ProductsComponent from '../components/Products';
import ThemeToggler from '@/components/ThemeToggler';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold pb-2">Native Production</h1>
      <ThemeToggler />
      <ProductsComponent />
    </div>
  );
};

export default Home;
