import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Filter, ChevronDown, Check, Lock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { getCatalogProducts } from '../services/productStore.js';

export default function UniformsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [addedItem, setAddedItem] = useState(null);
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('featured');

  // Unified reactive product catalog reading from persistent store
  const [allProducts, setAllProducts] = useState(() => getCatalogProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setAllProducts(getCatalogProducts());
    };
    window.addEventListener('ips-products-updated', handleUpdate);
    return () => window.removeEventListener('ips-products-updated', handleUpdate);
  }, []);

  // Filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category match
      if (selectedCategory !== 'all') {
        const matchesCategory =
          product.category === selectedCategory ||
          product.subCategory === selectedCategory ||
          (selectedCategory === 'school-uniforms' && (product.category === 'school-uniforms' || product.subCategory === 'boys-trousers' || product.subCategory === 'girls-skirts')) ||
          (selectedCategory === 'boys-trousers' && product.subCategory === 'boys-trousers') ||
          (selectedCategory === 'girls-skirts' && product.subCategory === 'girls-skirts') ||
          (selectedCategory === 'shoes' && (product.category === 'shoes' || product.subCategory === 'shoes')) ||
          (selectedCategory === 'accessories' && (product.category === 'accessories' || product.subCategory === 'accessories')) ||
          (selectedCategory === 'stationery-books' && product.category === 'stationery-books') ||
          (selectedCategory === 'school-bags' && product.category === 'school-bags') ||
          (selectedCategory === 'lunch-boxes' && product.category === 'lunch-boxes') ||
          (selectedCategory === 'healthcare' && product.category === 'healthcare') ||
          (selectedCategory === 'fitness-sports' && product.category === 'fitness-sports') ||
          (selectedCategory === 'electronics' && product.category === 'electronics') ||
          (selectedCategory === 'toys-educational' && product.category === 'toys-educational') ||
          (selectedCategory === 'gifts-craft' && product.category === 'gifts-craft') ||
          (selectedCategory === 'household' && product.category === 'household') ||
          (selectedCategory === 'travel-outdoor' && product.category === 'travel-outdoor');
        if (!matchesCategory) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matches =
          (product.nameEn && product.nameEn.toLowerCase().includes(query)) ||
          (product.nameAr && product.nameAr.toLowerCase().includes(query)) ||
          (product.sku && product.sku.toLowerCase().includes(query)) ||
          (product.descEn && product.descEn.toLowerCase().includes(query));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return a.id - b.id;
    });
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/uniforms' },
          message: isRTL ? 'يرجى تسجيل الدخول أولاً لإتمام الشراء والطلب.' : 'Please log in to purchase and place an order.'
        }
      });
      return;
    }
    addToCart(product, product.defaultSize, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  // Complete curated collections list dynamically counted from store
  const categoriesList = useMemo(() => [
    { id: 'all', label: isRTL ? `جميع التشكيلات (${allProducts.length})` : `All Collections (${allProducts.length})`, count: allProducts.length, image: '/products/polo-shirt-front.jpg' },
    { id: 'school-uniforms', label: isRTL ? '1. الزي المدرسي والملابس' : '1. School Uniforms & Attire', count: allProducts.filter(p => p.category === 'school-uniforms').length, image: '/products/polo-shirt-front.jpg' },
    { id: 'boys-trousers', label: isRTL ? '• بناطيل الأولاد' : "• Boys' Trousers", count: allProducts.filter(p => p.subCategory === 'boys-trousers').length, image: '/products/boys-gray-trousers.jpg' },
    { id: 'girls-skirts', label: isRTL ? '• تنانير البنات' : "• Girls' Skirts", count: allProducts.filter(p => p.subCategory === 'girls-skirts').length, image: '/products/girls-gray-skirt.jpg' },
    { id: 'shoes', label: isRTL ? '• الأحذية المدرسية' : '• Footwear Collection', count: allProducts.filter(p => p.subCategory === 'shoes' || p.category === 'shoes').length, image: '/products/boys-black-shoes.jpg' },
    { id: 'accessories', label: isRTL ? '• الإكسسوارات (أحزمة وجوارب)' : '• Belts & Accessories', count: allProducts.filter(p => p.subCategory === 'accessories' || p.category === 'accessories').length, image: '/products/school-accessories-set.jpg' },
    { id: 'school-bags', label: isRTL ? '2. الحقائب المدرسية والمستلزمات' : '2. School Bags & Packs', count: allProducts.filter(p => p.category === 'school-bags').length, image: '/products/school-bags-accessories.jpg' },
    { id: 'stationery-books', label: isRTL ? '3. الكتب والقرطاسية الأكاديمية' : '3. Academic Books & Stationery', count: allProducts.filter(p => p.category === 'stationery-books').length, image: '/products/cambridge-english-book.jpg' },
    { id: 'lunch-boxes', label: isRTL ? '4. علب الطعام ومطارات المشروبات' : '4. Dining & Drinkware', count: allProducts.filter(p => p.category === 'lunch-boxes').length, image: '/products/lunch-boxes-drinkware.jpg' },
    { id: 'healthcare', label: isRTL ? '5. الرعاية الصحية والعناية' : '5. Wellness & Personal Care', count: allProducts.filter(p => p.category === 'healthcare').length, image: '/products/healthcare-personal-care.jpg' },
    { id: 'fitness-sports', label: isRTL ? '6. اللياقة والرياضة البدنية' : '6. Athletics & Sports Gear', count: allProducts.filter(p => p.category === 'fitness-sports').length, image: '/products/fitness-sports-equipment.jpg' },
    { id: 'electronics', label: isRTL ? '7. الإلكترونيات وملحقات التقنية' : '7. Electronics & Tech Gear', count: allProducts.filter(p => p.category === 'electronics').length, image: '/products/electronics-mobile-accessories.jpg' },
    { id: 'toys-educational', label: isRTL ? '8. ألعاب الذكاء والتعليم' : '8. Educational & STEM Play', count: allProducts.filter(p => p.category === 'toys-educational').length, image: '/products/toys-educational-products.jpg' },
    { id: 'gifts-craft', label: isRTL ? '9. الهدايا والأعمال الفنية' : '9. Fine Arts, Crafts & Gifts', count: allProducts.filter(p => p.category === 'gifts-craft').length, image: '/products/gifts-art-craft.jpg' },
    { id: 'household', label: isRTL ? '10. المستلزمات والمنظمات المنزلية' : '10. Household Essentials', count: allProducts.filter(p => p.category === 'household').length, image: '/products/household-daily-essentials.jpg' },
    { id: 'travel-outdoor', label: isRTL ? '11. السفر والرحلات الخارجية' : '11. Travel & Outdoor Luggage', count: allProducts.filter(p => p.category === 'travel-outdoor').length, image: '/products/travel-outdoor-accessories.jpg' }
  ], [allProducts, isRTL]);

  return (
    <div className="uniforms-page-container">
      {/* Top Banner */}
      <div className="uniforms-hero-bar" style={{ backgroundColor: '#ffffff', borderBottom: '1.5px solid #ebdada', padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#9E2A2B', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              <Sparkles size={15} color="#D4AF37" />
              <span>{isRTL ? 'كتالوج المتجر الراقي' : 'Curated Store Catalog'}</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#111827', margin: 0 }}>
              {isRTL ? 'جميع المنتجات والتشكيلات الراقية' : 'All Products & Curated Collections'}
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: '3px 0 0' }}>
              {filteredProducts.length} {isRTL ? 'منتجات مختارة بجودة عالية ومتوفرة للطلب' : 'curated high-quality products in stock'}
            </p>
          </div>

          {/* Quick Login Bar if Unauthenticated */}
          {!isAuthenticated && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '0.65rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.82rem'
            }}>
              <Lock size={16} color="#b45309" />
              <span style={{ color: '#92400e', fontWeight: '600' }}>
                {isRTL ? 'تسجيل الدخول مطلوب للشراء' : 'Login required to checkout'}
              </span>
              <button
                type="button"
                onClick={() => login('demo@shop.com', 'customer123')}
                style={{
                  backgroundColor: '#9E2A2B',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.76rem',
                  cursor: 'pointer'
                }}
              >
                ⚡ {isRTL ? 'دخول فوري' : '1-Click Login'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1360px', margin: '2rem auto', padding: '0 1rem', display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar Category Filter with High-Resolution Landscape Photos */}
        <aside style={{
          width: '290px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #ebdada',
          padding: '1.25rem 1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          flexShrink: 0
        }} className="hide-mobile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3e8eb' }}>
            <Filter size={18} color="#9E2A2B" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              {isRTL ? 'التشكيلات المختارة' : 'Curated Collections'}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '72vh', overflowY: 'auto' }}>
            {categoriesList.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.45rem 0.55rem',
                    borderRadius: '8px',
                    border: active ? '1.5px solid #800020' : '1px solid transparent',
                    backgroundColor: active ? '#fdf2f4' : 'transparent',
                    color: active ? '#800020' : '#374151',
                    fontWeight: active ? '800' : '600',
                    fontSize: '0.82rem',
                    textAlign: isRTL ? 'right' : 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={cat.image}
                    alt=""
                    style={{
                      width: '42px',
                      height: '32px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      border: '1px solid #ebdada',
                      flexShrink: 0
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '700' }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Product Grid */}
        <main style={{ flex: 1 }}>
          
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            backgroundColor: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #ebdada',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.86rem', color: '#6b7280' }}>
              {isRTL ? 'عرض' : 'Showing'} <strong>{filteredProducts.length}</strong> {isRTL ? 'منتجات' : 'products'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.84rem', color: '#374151', fontWeight: '600' }}>
                {isRTL ? 'الترتيب:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontWeight: '600'
                }}
              >
                <option value="featured">{isRTL ? 'المميز' : 'Featured'}</option>
                <option value="price_asc">{isRTL ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
                <option value="price_desc">{isRTL ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1.5px solid #ebdada',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Curated Collection Chip Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  [isRTL ? 'right' : 'left']: '10px',
                  zIndex: 2,
                  backgroundColor: '#9E2A2B',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  padding: '0.22rem 0.65rem',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 6px rgba(158, 42, 43, 0.25)',
                  letterSpacing: '0.02em'
                }}>
                  {isRTL ? (prod.collectionAr || 'تشكيلة راقية') : (prod.collectionEn || 'Curated Collection')}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(prod)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    [isRTL ? 'left' : 'right']: '10px',
                    zIndex: 2,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: '1px solid #e5e7eb',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={16} color={isInWishlist(prod.id) ? '#dc2626' : '#9ca3af'} fill={isInWishlist(prod.id) ? '#dc2626' : 'none'} />
                </button>

                {/* Product Image Clickable Link */}
                <Link
                  to={`/product/${prod.id}`}
                  style={{
                    height: '190px',
                    backgroundColor: '#faf8f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    overflow: 'hidden',
                    borderBottom: '1px solid #f3e8eb',
                    textDecoration: 'none'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.nameEn}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Link>

                {/* Product Info */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#800020', fontWeight: '800', textTransform: 'uppercase' }}>
                      {prod.sku}
                    </span>
                    <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                      <h4 style={{
                        fontSize: '0.98rem',
                        fontWeight: '800',
                        color: '#111827',
                        margin: '0.25rem 0 0.4rem',
                        lineHeight: '1.3'
                      }}>
                        {isRTL ? prod.nameAr : prod.nameEn}
                      </h4>
                    </Link>
                    <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0 0 0.75rem', lineHeight: '1.4' }}>
                      {isRTL ? prod.descAr : prod.descEn}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3e8eb', paddingTop: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block' }}>
                        {isRTL ? 'السعر' : 'Price'}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#800020' }}>
                        OMR {prod.price.toFixed(3)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(prod)}
                      style={{
                        backgroundColor: addedItem === prod.id ? '#16a34a' : '#800020',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 6px rgba(128, 0, 32, 0.2)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {addedItem === prod.id ? (
                        <>
                          <Check size={14} />
                          <span>{isRTL ? 'تمت!' : 'Added!'}</span>
                        </>
                      ) : !isAuthenticated ? (
                        <>
                          <Lock size={14} />
                          <span>{isRTL ? 'شراء' : 'Buy'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          <span>{isRTL ? 'أضف' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #ebdada' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                {isRTL ? 'لا توجد منتجات مطابقة لهذا القسم' : 'No products found in this category'}
              </p>
              <button
                onClick={() => setSearchParams({ category: 'all' })}
                style={{
                  marginTop: '0.85rem',
                  padding: '0.6rem 1.25rem',
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
