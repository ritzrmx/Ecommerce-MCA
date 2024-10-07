import React from 'react';
import Hero from '../components/Hero';
import LatestCollectionComponent from '../components/LatestCollection'; // Renamed import
import BestSellerComponent from '../components/BestSeller'; // Renamed import
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import Chatbot from '../components/Chatbot';

// Renamed local component to avoid conflict
const LatestCollection = () => <div>Latest Collections Content</div>;
const BestSeller = () => <div>Best Seller Content</div>;

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollectionComponent /> {/* Use renamed import */}
      <BestSellerComponent /> {/* Use renamed import */}
      <OurPolicy />
      <NewsletterBox />
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
        <Chatbot />
      </div>
    </div>
  );
};

export default Home;