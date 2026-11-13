import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function CategoryCards() {
  const { isRTL } = useLanguage();

  const categories = [
    {
      id: 'uniforms',
      nameEn: 'Uniforms',
      nameAr: 'الزي المدرسي',
      image: '/products/polo-shirt-front.jpg',
      link: '/uniforms?category=school-uniforms',
      count: 'Official'
    },
    {
      id: 'trousers',
      nameEn: 'Trousers',
      nameAr: 'بناطيل الأولاد',
      image: '/products/boys-gray-trousers.jpg',
      link: '/uniforms?category=boys-trousers',
      count: 'Regular Fit'
    },
    {
      id: 'skirts',
      nameEn: 'Skirts',
      nameAr: 'تنانير البنات',
      image: '/products/girls-gray-skirt.jpg',
      link: '/uniforms?category=girls-skirts',
      count: 'Pleated'
    },
    {
      id: 'shoes',
      nameEn: 'Shoes',
      nameAr: 'الأحذية',
      image: '/products/boys-black-shoes.jpg',
      link: '/uniforms?category=shoes',
      count: 'All Sizes'
    },
    {
      id: 'accessories',
      nameEn: 'Accessories',
      nameAr: 'الإكسسوارات',
      image: '/images/cat-accessories.jpg',
      link: '/uniforms?category=accessories',
      count: 'Belts & Socks'
    },
    {
      id: 'books-stationery',
      nameEn: 'Books & Stationery',
      nameAr: 'الكتب والقرطاسية',
      image: '/images/cat-books.jpg',
      link: '/uniforms?category=stationery-books',
      count: 'Curriculum'
    },
    {
      id: 'school-bags',
      nameEn: 'School Bags',
      nameAr: 'الحقائب المدرسية',
      image: '/images/cat-bags.jpg',
      link: '/uniforms?category=school-bags',
      count: 'Ergonomic'
    },
    {
      id: 'lunch-boxes',
      nameEn: 'Lunch Boxes & Drinkware',
      nameAr: 'علب الطعام ومطارات الماء',
      image: '/images/cat-lunchbox.jpg',
      link: '/uniforms?category=lunch-boxes',
      count: 'BPA-Free'
    },
    {
      id: 'electronics',
      nameEn: 'Electronics & Mobile',
      nameAr: 'الإلكترونيات وملحقات الهاتف',
      image: '/images/cat-electronics.jpg',
      link: '/uniforms?category=electronics',
      count: 'Accessories'
    },
    {
      id: 'fitness-sports',
      nameEn: 'Sports & Fitness',
      nameAr: 'اللياقة والرياضة',
      image: '/images/cat-sports.jpg',
      link: '/uniforms?category=fitness-sports',
      count: 'Athletics'
    },
    {
      id: 'travel-outdoor',
      nameEn: 'Travel & Outdoor',
      nameAr: 'السفر والرحلات',
      image: '/images/cat-travel.jpg',
      link: '/uniforms?category=travel-outdoor',
      count: 'Travel Gear'
    }
  ];

  return (
    <section id="categories" style={{ padding: '3rem 1.25rem 4rem', backgroundColor: '#fcfcfc' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        
        {/* Section Heading matching Reference Screenshot */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '2px solid #f3e8eb',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '4px', height: '28px', backgroundColor: '#800020', borderRadius: '4px' }} />
            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              {isRTL ? 'تسوق حسب الفئة' : 'Shop by Category'}
            </h2>
          </div>

          <Link
            to="/uniforms"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#800020',
              fontWeight: '700',
              fontSize: '0.92rem',
              textDecoration: 'none'
            }}
          >
            <span>{isRTL ? 'عرض جميع المنتجات' : 'View All Products'}</span>
            <ArrowRight size={16} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </Link>
        </div>

        {/* Categories Grid - Matching Screenshot 4 perfectly */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '1.15rem'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                border: '1px solid #ebdada',
                borderRadius: '14px',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(128, 0, 32, 0.04)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 22px rgba(128, 0, 32, 0.12)';
                e.currentTarget.style.borderColor = '#800020';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(128, 0, 32, 0.04)';
                e.currentTarget.style.borderColor = '#ebdada';
              }}
            >
              {/* Product Picture Area */}
              <div style={{
                height: '140px',
                backgroundColor: '#fbf9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    // Fallback to placeholder if image load fails
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Bottom Maroon Pill Bar matching reference */}
              <div style={{
                backgroundColor: '#800020',
                color: '#ffffff',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: '700',
                fontSize: '0.86rem',
                transition: 'background-color 0.2s ease'
              }}>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isRTL ? cat.nameAr : cat.nameEn}
                </span>
                <ArrowRight
                  size={15}
                  color="#ffffff"
                  style={{
                    flexShrink: 0,
                    transform: isRTL ? 'rotate(180deg)' : 'none'
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
