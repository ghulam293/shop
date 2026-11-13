import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Grid, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function CategoryCards() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const categories = [
    {
      id: 'uniforms',
      nameEn: 'Uniforms',
      nameAr: 'الزي المدرسي',
      descEn: 'Official polo shirts, shirts & uniform sets',
      descAr: 'قمصان البولو والزي الرسمي المعتمد',
      image: '/products/polo-shirt-front.jpg',
      link: '/uniforms?category=school-uniforms',
      count: 'Official Sets',
      group: 'CLOTHING',
      tag: 'Best Seller'
    },
    {
      id: 'trousers',
      nameEn: "Boys' Trousers",
      nameAr: 'بناطيل الأولاد',
      descEn: 'Tailored gray and navy formal trousers',
      descAr: 'بناطيل رمادية وكحلية بقصة مريحة',
      image: '/products/boys-gray-trousers.jpg',
      link: '/uniforms?category=boys-trousers',
      count: 'Sizes 24 - 40',
      group: 'CLOTHING',
      tag: 'Durable'
    },
    {
      id: 'skirts',
      nameEn: "Girls' Skirts",
      nameAr: 'تنانير البنات',
      descEn: 'Classic pleated and A-line school skirts',
      descAr: 'تنانير بكسرات كلاسيكية وجودة عالية',
      image: '/products/girls-gray-skirt.jpg',
      link: '/uniforms?category=girls-skirts',
      count: 'Sizes 22 - 38',
      group: 'CLOTHING',
      tag: 'Pleated'
    },
    {
      id: 'shoes',
      nameEn: 'Shoes & Footwear',
      nameAr: 'الأحذية المدرسية',
      descEn: 'Oxford black leather & athletic shoes',
      descAr: 'أحذية جلدية سوداء وأحذية رياضية',
      image: '/products/boys-black-shoes.jpg',
      link: '/uniforms?category=shoes',
      count: 'Sizes 28 - 44',
      group: 'FOOTWEAR',
      tag: 'Pure Leather'
    },
    {
      id: 'accessories',
      nameEn: 'Accessories',
      nameAr: 'الإكسسوارات',
      descEn: 'Formal black belts, ties & cotton socks',
      descAr: 'أحزمة جلدية وجوارب قطنية ناعمة',
      image: '/images/cat-accessories.jpg',
      link: '/uniforms?category=accessories',
      count: 'Belts & Socks',
      group: 'ACCESSORIES',
      tag: 'Essentials'
    },
    {
      id: 'books-stationery',
      nameEn: 'Books & Stationery',
      nameAr: 'الكتب والقرطاسية',
      descEn: 'Cambridge curriculum, science & math textbooks',
      descAr: 'مناهج كامبريدج وكتب العلوم والرياضيات واللغة',
      image: '/images/cat-books.jpg',
      link: '/uniforms?category=stationery-books',
      count: 'Curriculum Books',
      group: 'STUDY',
      tag: 'Official Syllabus'
    },
    {
      id: 'school-bags',
      nameEn: 'School Bags & Backpacks',
      nameAr: 'الحقائب المدرسية',
      descEn: 'Ergonomic multi-compartment backpacks',
      descAr: 'حقائب ظهر مريحة ومتعددة الجيوب',
      image: '/images/cat-bags.jpg',
      link: '/uniforms?category=school-bags',
      count: 'Water-Resistant',
      group: 'ESSENTIALS',
      tag: 'Ergonomic'
    },
    {
      id: 'lunch-boxes',
      nameEn: 'Lunchware & Drinkware',
      nameAr: 'علب الطعام ومطارات الماء',
      descEn: 'BPA-free thermal lunch boxes & water bottles',
      descAr: 'مطارات حافظة للحرارة وعلب طعام آمنة',
      image: '/images/cat-lunchbox.jpg',
      link: '/uniforms?category=lunch-boxes',
      count: 'BPA-Free',
      group: 'ESSENTIALS',
      tag: 'Thermal'
    },
    {
      id: 'electronics',
      nameEn: 'Electronics & Gadgets',
      nameAr: 'الإلكترونيات وملحقاتها',
      descEn: 'Scientific calculators, chargers & cables',
      descAr: 'آلات حاسبة علمية، شواحن وملحقات تقنية',
      image: '/images/cat-electronics.jpg',
      link: '/uniforms?category=electronics',
      count: 'Accessories',
      group: 'TECH',
      tag: 'Approved Models'
    },
    {
      id: 'fitness-sports',
      nameEn: 'Fitness & Sports Gear',
      nameAr: 'اللياقة والرياضة',
      descEn: 'Athletic wear, sport shoes & gym bags',
      descAr: 'ملابس رياضية، أحذية للجري وحقائب رياضية',
      image: '/images/cat-sports.jpg',
      link: '/uniforms?category=fitness-sports',
      count: 'Training Gear',
      group: 'TECH',
      tag: 'Athletics'
    },
    {
      id: 'travel-outdoor',
      nameEn: 'Travel & Outdoor',
      nameAr: 'السفر والرحلات',
      descEn: 'Luggage bags, organizers & travel accessories',
      descAr: 'حقائب سفر مدمجة، منظمات ومستلزمات الرحلات',
      image: '/images/cat-travel.jpg',
      link: '/uniforms?category=travel-outdoor',
      count: 'Travel Gear',
      group: 'ESSENTIALS',
      tag: 'Lightweight'
    }
  ];

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (selectedGroup !== 'ALL' && cat.group !== selectedGroup) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          cat.nameEn.toLowerCase().includes(q) ||
          cat.nameAr.includes(q) ||
          cat.descEn.toLowerCase().includes(q) ||
          cat.descAr.includes(q)
        );
      }
      return true;
    });
  }, [categories, selectedGroup, searchQuery]);

  return (
    <section id="categories" style={{ padding: '2.5rem 1.25rem 4rem', backgroundColor: '#fcfcfc', minHeight: '80vh' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        
        {/* Top Clean Showcase Header */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #ebdada',
          padding: '2rem 1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(128, 0, 32, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#800020', fontWeight: '800', fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Sparkles size={16} color="#D4AF37" />
                <span>{isRTL ? 'جميع الأقسام والفئات المتاحة' : 'Complete Store Catalog'}</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                fontWeight: '900',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                {isRTL ? 'تسوق جميع الفئات والأقسام' : 'Browse All Categories'}
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: '0.4rem 0 0' }}>
                {isRTL
                  ? 'استعرض جميع الأقسام (11 قسماً) مع صور توضيحية ومنتجات متوفرة للشراء المباشر.'
                  : 'Explore all 11 official departments with demo pictures and in-stock items ready for immediate order.'}
              </p>
            </div>

            {/* Live Search Inside Categories */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search size={18} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '14px', top: '50%', transform: 'translateY(-50%)', color: '#800020' }} />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن فئة (أحذية، كتب، ملابس)...' : 'Filter categories (shoes, books, uniforms)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: isRTL ? '0.75rem 2.75rem 0.75rem 1rem' : '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #d1d5db',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#800020'; e.target.style.backgroundColor = '#ffffff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.backgroundColor = '#f9fafb'; }}
              />
            </div>
          </div>

          {/* Filter Pills Row */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #f3e8eb', paddingTop: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#800020', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginEnd: '0.5rem' }}>
              <Filter size={14} />
              <span>{isRTL ? 'تصفية سريعة:' : 'Quick Filter:'}</span>
            </span>
            {[
              { id: 'ALL', labelEn: 'All Categories (11)', labelAr: 'جميع الفئات (11)' },
              { id: 'CLOTHING', labelEn: 'Clothing & Uniforms', labelAr: 'الملابس والزي' },
              { id: 'FOOTWEAR', labelEn: 'Shoes & Footwear', labelAr: 'الأحذية' },
              { id: 'STUDY', labelEn: 'Books & Stationery', labelAr: 'الكتب والقرطاسية' },
              { id: 'ESSENTIALS', labelEn: 'Bags & Daily Essentials', labelAr: 'الحقائب والمستلزمات' },
              { id: 'TECH', labelEn: 'Electronics & Sports', labelAr: 'الإلكترونيات والرياضة' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGroup(tab.id)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: selectedGroup === tab.id ? '800' : '600',
                  border: selectedGroup === tab.id ? '1px solid #800020' : '1px solid #e5e7eb',
                  backgroundColor: selectedGroup === tab.id ? '#800020' : '#ffffff',
                  color: selectedGroup === tab.id ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {isRTL ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid - Displays ALL 11 Categories with Demo Pictures */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.35rem'
        }}>
          {filteredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                border: '1.5px solid #ebdada',
                borderRadius: '16px',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(128, 0, 32, 0.05)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(128, 0, 32, 0.14)';
                e.currentTarget.style.borderColor = '#800020';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(128, 0, 32, 0.05)';
                e.currentTarget.style.borderColor = '#ebdada';
              }}
            >
              {/* Tag Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                [isRTL ? 'right' : 'left']: '12px',
                zIndex: 2,
                backgroundColor: '#800020',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '0.22rem 0.65rem',
                borderRadius: '9999px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}>
                {cat.tag}
              </div>

              {/* Demo Product Picture Box */}
              <div style={{
                height: '190px',
                backgroundColor: '#fbf9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                overflow: 'hidden',
                position: 'relative',
                borderBottom: '1px solid #f3e8eb'
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
                  onMouseEnter={(e) => { e.target.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Category Info Area */}
              <div style={{ padding: '1.15rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: '800',
                      color: '#111827',
                      margin: 0
                    }}>
                      {isRTL ? cat.nameAr : cat.nameEn}
                    </h3>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: '#800020',
                      backgroundColor: '#fbf2f4',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      border: '1px solid #f0d5db'
                    }}>
                      {cat.count}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 1rem', lineHeight: '1.45' }}>
                    {isRTL ? cat.descAr : cat.descEn}
                  </p>
                </div>

                {/* Bottom Action Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#800020',
                  color: '#ffffff',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  transition: 'background-color 0.2s ease'
                }}>
                  <span>{isRTL ? 'استعراض المنتجات' : 'Explore Category'}</span>
                  <ArrowRight
                    size={16}
                    color="#ffffff"
                    style={{
                      transform: isRTL ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ebdada' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
              {isRTL ? 'لم يتم العثور على فئات مطابقة' : 'No matching categories found'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGroup('ALL'); }}
              style={{
                marginTop: '1rem',
                padding: '0.65rem 1.25rem',
                backgroundColor: '#800020',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {isRTL ? 'إعادة ضبط البحث' : 'Reset Search'}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
