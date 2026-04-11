import { Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShopContent from '../../components/ShopContent';

const products = [
  { id: 1, name: 'Reverie Bracelet', price: '₨ 15,000', description: 'A timeless bracelet that evokes a sense of elegance and beauty.', image: '/b1.png' },
  { id: 2, name: 'Moonlit Bracelet', price: '₨ 8,000', description: 'A serene bracelet with a delicate design, perfect for any occasion.', image: '/b2.png' },
  { id: 3, name: 'Dream Bracelet', price: '₨ 3,500', description: 'A minimalist bracelet that whispers subtle elegance.', image: '/b3.png' },
  { id: 4, name: 'Starlight Bracelet', price: '₨ 2,000', description: 'A burst of color with a beaded design that catches the light.', image: '/b4.png' },
  { id: 5, name: 'Celestial Glow Necklace', price: '₨ 50,000', description: 'A necklace that captures the radiance of the stars in a beautiful glow.', image: '/n1.png' },
  { id: 6, name: 'Serenity Necklace', price: '₨ 25,000', description: 'A graceful necklace that flows effortlessly with your movements.', image: '/n2.png' },
  { id: 7, name: 'Whispers of Heart', price: '₨ 10,000', description: 'A delicate necklace with a heart-shaped pendant, perfect for gifting.', image: '/n3.png' },
  { id: 8, name: 'Timeless Bond Rings', price: '₨ 30,000', description: 'Matching rings that symbolize an everlasting connection.', image: '/r2.png' },
  { id: 9, name: 'Eternity Ring', price: '₨ 75,000', description: 'A dazzling ring that captures the essence of eternity with its brilliance.', image: '/r3.png' },
  { id: 10, name: 'Starlight Droplets', price: '₨ 40,000', description: 'Elegant earrings that capture the essence of starlight in a beautiful design.', image: '/e2.png' },
  { id: 11, name: 'Silver Moon', price: '₨ 5,000', description: 'A modern hoop earring design inspired by the moon's glow.', image: '/e3.png' },
  { id: 12, name: 'Whispering Pearl', price: '₨ 12,000', description: 'Elegant pearl earrings that add a whisper of sophistication to any look.', image: '/e4.png' },
];

export default function Shop() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <ShopContent products={products} />
      </Suspense>
      <Footer />
    </>
  );
}