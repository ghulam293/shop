import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function CategoryCards() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const departments = [
    {
      id: 'school-uniforms',
      deptNumber: 1,
      nameEn: 'Apparel & Clothing',
      nameAr: 'الملابس والأزياء',
      descEn: 'Polo shirts, trousers, pleated skirts, shoes, ties, belts & socks',
      descAr: 'قمصان البولو، البناطيل، التنانير، الأحذية الرسمية والجوارب',
      image: '/products/polo-shirt-front.jpg',
      link: '/uniforms?category=school-uniforms',
      count: 'Apparel',
      group: 'CLOTHING'
    },
    {
      id: 'school-bags',
      deptNumber: 2,
      nameEn: 'Bags & Backpacks',
      nameAr: 'الحقائب وحقائب الظهر',
      descEn: 'Ergonomic backpacks, laptop bags, travel packs & storage cases',
      descAr: 'حقائب ظهر مريحة، حقائب لابتوب، وحافظات السفر اليومية',
      image: '/products/school-bags-accessories.jpg',
      link: '/uniforms?category=school-bags',
      count: 'Bags',
      group: 'ESSENTIALS'
    },
    {
      id: 'stationery-books',
      deptNumber: 3,
      nameEn: 'Stationery & Books',
      nameAr: 'الكتب والقرطاسية',
      descEn: 'Cambridge curriculum, math & science textbooks, notebooks & geometry kits',
      descAr: 'مناهج كامبريدج، كتب الرياضيات والعلوم، دفاتر وأطقم هندسية',
      image: '/products/cambridge-english-book.jpg',
      link: '/uniforms?category=stationery-books',
      count: 'Books',
      group: 'STUDY'
    },
    {
      id: 'lunch-boxes',
      deptNumber: 4,
      nameEn: 'Lunch Boxes & Drinkware',
      nameAr: 'علب الطعام ومطارات المشروبات',
      descEn: 'BPA-free thermal bento lunch boxes & stainless steel water bottles',
      descAr: 'علب طعام حرارية صحية ومطارات ماء ستانلس ستيل مانعة للتسرب',
      image: '/products/lunch-boxes-drinkware.jpg',
      link: '/uniforms?category=lunch-boxes',
      count: 'Drinkware',
      group: 'ESSENTIALS'
    },
    {
      id: 'healthcare',
      deptNumber: 5,
      nameEn: 'Healthcare & Personal Care',
      nameAr: 'الرعاية الصحية والعناية الشخصية',
      descEn: 'First-aid kits, digital thermometers, sanitizers, wet wipes & toiletries',
      descAr: 'حقائب إسعافات أولية، موازين حرارة رقمية، معقمات ومستلزمات العناية',
      image: '/products/healthcare-personal-care.jpg',
      link: '/uniforms?category=healthcare',
      count: 'Healthcare',
      group: 'HEALTH'
    },
    {
      id: 'fitness-sports',
      deptNumber: 6,
      nameEn: 'Fitness & Sports Equipment',
      nameAr: 'اللياقة والرياضة البدنية',
      descEn: 'Dumbbells, resistance bands, jump ropes, sports balls & shaker bottles',
      descAr: 'أثقال تدريب، حبال قفز، كرات رياضية ومطارات البروتين والرياضة',
      image: '/products/fitness-sports-equipment.jpg',
      link: '/uniforms?category=fitness-sports',
      count: 'Fitness',
      group: 'TECH_SPORTS'
    },
    {
      id: 'electronics',
      deptNumber: 7,
      nameEn: 'Electronics & Mobile Accessories',
      nameAr: 'الإلكترونيات وملحقات الهاتف',
      descEn: 'Scientific calculators, fast chargers, braided USB cables & earphones',
      descAr: 'آلات حاسبة علمية معتمدة، شواحن سريعة، كابلات وسماعات سلكية ولاسلكية',
      image: '/products/electronics-mobile-accessories.jpg',
      link: '/uniforms?category=electronics',
      count: 'Electronics',
      group: 'TECH_SPORTS'
    },
    {
      id: 'toys-educational',
      deptNumber: 8,
      nameEn: 'Toys & Educational Products',
      nameAr: 'ألعاب الذكاء والتعليم',
      descEn: 'STEM science experiment kits, building blocks, puzzles & board games',
      descAr: 'أطقم تجارب علمية، مكعبات بناء خشبية وألعاب تفكير وذكاء للأطفال',
      image: '/products/toys-educational-products.jpg',
      link: '/uniforms?category=toys-educational',
      count: 'Educational',
      group: 'STUDY'
    },
    {
      id: 'gifts-craft',
      deptNumber: 9,
      nameEn: 'Gifts, Art & Craft Supplies',
      nameAr: 'الهدايا والأعمال الفنية والإبداع',
      descEn: 'Greeting cards, gift wrapping, watercolor & acrylic paints, brushes & DIY kits',
      descAr: 'بطاقات تهنئة وتغليف، ألوان مائية وزيتية، فراشي رسم وأطقم أشغال يدوية',
      image: '/products/gifts-art-craft.jpg',
      link: '/uniforms?category=gifts-craft',
      count: 'Art & Crafts',
      group: 'STUDY'
    },
    {
      id: 'household',
      deptNumber: 10,
      nameEn: 'Household & Daily Essentials',
      nameAr: 'المستلزمات المنزلية واليومية',
      descEn: 'Multipurpose storage organizer boxes, kitchen accessories & home care',
      descAr: 'صناديق تنظيم وتخزين متعددة، منظمات منزلية ومستلزمات يومية',
      image: '/products/household-daily-essentials.jpg',
      link: '/uniforms?category=household',
      count: 'Home Essentials',
      group: 'ESSENTIALS'
    },
    {
      id: 'travel-outdoor',
      deptNumber: 11,
      nameEn: 'Travel & Outdoor Accessories',
      nameAr: 'السفر والرحلات الخارجية',
      descEn: 'Duffel luggage bags, travel packing organizers, vacuum flasks & outdoor gear',
      descAr: 'حقائب سفر متينة، منظمات حقائب السفر، حافظات ماء ومستلزمات الرحلات',
      image: '/products/travel-outdoor-accessories.jpg',
      link: '/uniforms?category=travel-outdoor',
      count: 'Travel',
      group: 'ESSENTIALS'
    }
  ];

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      if (selectedGroup !== 'ALL' && dept.group !== selectedGroup) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          dept.nameEn.toLowerCase().includes(q) ||
          dept.nameAr.includes(q) ||
          dept.descEn.toLowerCase().includes(q) ||
          dept.descAr.includes(q)
        );
      }
      return true;
    });
  }, [departments, selectedGroup, searchQuery]);

  return (
    <section id="categories" style={{ padding: '2.5rem 1.25rem 4rem', backgroundColor: '#fcfcfc', minHeight: '80vh' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        
        {/* Top Clean Showcase Header */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #ebdada',
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#9E2A2B', fontWeight: '800', fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Sparkles size={16} color="#D4AF37" />
                <span>{isRTL ? 'المتجر الرسمي — فئات المنتجات' : 'Shop Categories'}</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                fontWeight: '900',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                {isRTL ? 'تصفح جميع الفئات' : 'Shop by Category'}
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: '0.4rem 0 0' }}>
                {isRTL
                  ? 'تسوق الملابس، الكتب، الحقائب، الإلكترونيات والمستلزمات اليومية.'
                  : 'Browse quality apparel, textbooks, backpacks, electronics, and daily essentials.'}
              </p>
            </div>

            {/* Live Search Inside Categories */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search size={18} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9E2A2B' }} />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث في الفئات والمنتجات...' : 'Search categories and products...'}
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
                onFocus={(e) => { e.target.style.borderColor = '#9E2A2B'; e.target.style.backgroundColor = '#ffffff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.backgroundColor = '#f9fafb'; }}
              />
            </div>
          </div>

          {/* Filter Pills Row */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #f3e8eb', paddingTop: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#9E2A2B', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginEnd: '0.5rem' }}>
              <Filter size={14} />
              <span>{isRTL ? 'تصفية الفئات:' : 'Categories:'}</span>
            </span>
            {[
              { id: 'ALL', labelEn: 'All Categories', labelAr: 'جميع الفئات' },
              { id: 'CLOTHING', labelEn: 'Apparel & Uniforms', labelAr: 'الملابس والزي' },
              { id: 'STUDY', labelEn: 'Books & Stationery', labelAr: 'الكتب والقرطاسية' },
              { id: 'ESSENTIALS', labelEn: 'Bags & Daily Essentials', labelAr: 'الحقائب والمستلزمات' },
              { id: 'HEALTH', labelEn: 'Healthcare & Wellness', labelAr: 'العناية والرعاية' },
              { id: 'TECH_SPORTS', labelEn: 'Tech & Fitness', labelAr: 'التقنية والرياضة' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGroup(tab.id)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: selectedGroup === tab.id ? '800' : '600',
                  border: selectedGroup === tab.id ? '1px solid #9E2A2B' : '1px solid #e5e7eb',
                  backgroundColor: selectedGroup === tab.id ? '#9E2A2B' : '#ffffff',
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

        {/* Categories Grid - Clean, Modern Cards Without Clutter Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.4rem'
        }}>
          {filteredDepartments.map((dept) => (
            <Link
              key={dept.id}
              to={dept.link}
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
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 14px 30px rgba(128, 0, 32, 0.15)';
                e.currentTarget.style.borderColor = '#800020';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(128, 0, 32, 0.05)';
                e.currentTarget.style.borderColor = '#ebdada';
              }}
            >
              {/* Product Photo Box - Clean and focused */}
              <div style={{
                height: '210px',
                backgroundColor: '#faf8f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                overflow: 'hidden',
                position: 'relative',
                borderBottom: '1px solid #f3e8eb'
              }}>
                <img
                  src={dept.image}
                  alt={dept.nameEn}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.35s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Department Info Area */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <h3 style={{
                      fontSize: '1.12rem',
                      fontWeight: '800',
                      color: '#111827',
                      margin: 0
                    }}>
                      {isRTL ? dept.nameAr : dept.nameEn}
                    </h3>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: '#800020',
                      backgroundColor: '#fbf2f4',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      border: '1px solid #f0d5db',
                      whiteSpace: 'nowrap'
                    }}>
                      {dept.count}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 1.15rem', lineHeight: '1.45' }}>
                    {isRTL ? dept.descAr : dept.descEn}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#9E2A2B',
                  color: '#ffffff',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  boxShadow: '0 2px 8px rgba(158, 42, 43, 0.2)'
                }}>
                  <span>{isRTL ? 'عرض المنتجات' : 'View Products'}</span>
                  <ArrowRight size={16} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #ebdada' }}>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              {isRTL ? 'لم يتم العثور على فئات مطابقة' : 'No matching categories found'}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
