'use client';

import React from 'react';
import ProductsComponent from '../components/Products';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Product List</h1>
      <ProductsComponent />
    </div>
  );
};

export default Home;
