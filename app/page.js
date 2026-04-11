import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <section id="main-banner">
          <div className="main-banner-box">
            <Image src="/banner.jpg" alt="Banner" fill style={{ objectFit: 'cover', borderRadius: '8px' }} priority />
            <div className="main-banner-text">
              <h1>Family Jewelry Collection</h1>
              <p>Designer Jewelry, Necklaces, Bracelets, Earrings</p>
              <Link href="/shop">Shop Now</Link>
            </div>
          </div>
        </section>

        <section id="jewelry-categories" style={{ padding: '60px 0', backgroundColor: '#f8f8f8' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
            boxSizing: 'border-box',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--secondary-color)', marginBottom: '20px' }}>
              Explore Our Jewelry Categories
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // ← responsive, no overflow
              gap: '24px',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {[
                { label: 'Rings', src: '/rings.jpg' },
                { label: 'Bracelets', src: '/bracelets.jpg' },
                { label: 'Earrings', src: '/earrings.jpg' },
                { label: 'Necklaces', src: '/necklaces.jpg' },
              ].map(({ label, src }) => (
                <div key={label} style={{
                  backgroundColor: 'var(--main-light-color)',
                  padding: '24px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box',
                }}>
                  <h3 style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>{label}</h3>
                  <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '20px' }}>
                    <Image
                      src={src}
                      alt={label}
                      fill
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                  <Link href="/shop" style={{ color: 'var(--main-color)', fontWeight: '500', fontSize: '1rem' }}>
                    Shop {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about-us" style={{ backgroundColor: '#fff9ef', padding: '60px 0' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px', boxSizing: 'border-box', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--secondary-color)', marginBottom: '20px' }}>About Us</h2>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6' }}>
              At <strong>Jewelry Online Store</strong>, we specialize in offering premium, handcrafted jewelry that combines tradition with modern elegance.
              Our collection features a variety of meticulously designed necklaces, earrings, bracelets, and rings, perfect for any occasion.
            </p>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6' }}>
              With a focus on quality, customer satisfaction, and affordable luxury, we are committed to bringing you jewelry that adds sparkle and style to your life.
              Join us on this sparkling journey and explore our collections today.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}