import React from 'react';
import CategoryCards from '../components/CategoryCards.js';
import '../styles/home.css';

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      {/* Show only categories all */}
      <CategoryCards />
    </div>
  );
}
