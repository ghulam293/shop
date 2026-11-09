import React from 'react';
import HeroBanner from '../components/HeroBanner.js';
import TrustFeatures from '../components/TrustFeatures.js';
import CategoryCards from '../components/CategoryCards.js';
import '../styles/home.css';

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      {/* 1. Hero Banner with Real School Building */}
      <HeroBanner />

      {/* 2. Trust Badges Row */}
      <TrustFeatures />

      {/* 3. Shop by Category (6 cards) */}
      <CategoryCards />
    </div>
  );
}

