"use client";
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

export default function ShopContent({ products }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  return (
    <div className="shop-container">
      <h1>Jewellery Collection</h1>
      {query && <p>Showing results for: "{query}"</p>}
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}