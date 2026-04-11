"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from './CartContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { getCartItemCount } = useContext(CartContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header id="header" style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div className="header-top-bar" style={{
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center',
        padding: '10px 16px',
      }}>
        <span style={{ fontSize: '1.5rem' }}>Welcome to Jewelry Online Store</span>
      </div>
      <nav className="navigation" style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '0 16px',
        gap: '8px',
      }}>
        <Link href="/" className="logo">
          <Image src="/logo.jpg" alt="Logo" width={100} height={60} style={{ objectFit: 'contain' }} />
        </Link>
        <ul className="menu" style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', margin: 0, padding: 0, gap: '8px' }}>
          <li><Link href="/" className="active">Home</Link></li>
          <li><Link href="/#jewelry-categories">Category</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/profile">Profile</Link></li>
        </ul>
        <div className="right-nav" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginLeft: 'auto' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />

          </form>
          <Link href="/profile" className="nav-user">
            <i className="fa-solid fa-user"></i>
          </Link>
          <Link href="/cart" className="nav-cart" style={{ position: 'relative' }}>
            <i className="fa-solid fa-cart-shopping"></i>
            {getCartItemCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                lineHeight: '1',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {getCartItemCount()}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}