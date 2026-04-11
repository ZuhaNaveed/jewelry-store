export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--main-light-color)', color: '#555', textAlign: 'center', padding: '20px 0' }}>
      <div style={{ marginTop: '10px' }}>
        <a href="https://www.instagram.com" style={{ color: 'var(--main-color)', margin: '0 10px' }} target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-instagram"></i> Instagram
        </a>
        <a href="https://www.facebook.com" style={{ color: 'var(--main-color)', margin: '0 10px' }} target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-facebook"></i> Facebook
        </a>
        <a href="https://www.google.com/maps" style={{ color: 'var(--main-color)', margin: '0 10px' }} target="_blank" rel="noopener noreferrer">
          <i className="fa-solid fa-location-dot"></i> Shop Location
        </a>
      </div>
      <p style={{ fontSize: '1rem', color: '#333' }}>© 2025 Jewelry Online Store. All rights reserved.</p>
    </footer>
  );
}