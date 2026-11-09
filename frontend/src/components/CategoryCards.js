import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function CategoryCards() {
  const { t, isRTL } = useLanguage();

  const categories = [
    {
      id: 'uniforms',
      nameEn: 'Uniforms',
      nameAr: 'الزي المدرسي',
      image: '/products/polo-shirt-front.jpg',
      link: '/product/1'
    },
    {
      id: 'trousers',
      nameEn: 'Trousers',
      nameAr: 'البناطيل',
      image: '/products/boys-gray-trousers.jpg',
      link: '/product/2'
    },
    {
      id: 'skirts',
      nameEn: 'Skirts',
      nameAr: 'التنانير',
      image: '/products/girls-gray-skirt.jpg',
      link: '/product/3'
    },
    {
      id: 'shoes',
      nameEn: 'Shoes',
      nameAr: 'الأحذية',
      image: '/images/category-shoes.jpg',
      link: '/uniforms?category=shoes'
    },
    {
      id: 'accessories',
      nameEn: 'Accessories',
      nameAr: 'الإكسسوارات',
      image: '/images/category-accessories.jpg',
      link: '/uniforms?category=accessories'
    },
    {
      id: 'books-stationery',
      nameEn: 'Books & Stationery',
      nameAr: 'الكتب والقرطاسية',
      image: '/images/category-books.jpg',
      link: '/uniforms?category=books-stationery'
    }
  ];

  return (
    <section className="category-section-wrapper">
      <div className="category-section-title">
        <span className="category-title-bar" />
        <span>{t('shopByCategory')}</span>
      </div>

      <div className="category-cards-grid">
        {categories.map((cat) => (
          <Link key={cat.id} to={cat.link} className="category-card">
            <div className="category-image-wrap">
              <img
                src={cat.image}
                alt={cat.nameEn}
                className="category-prod-img"
                loading="lazy"
              />
            </div>

            <div className="category-btn-pill">
              <span>{isRTL ? cat.nameAr : cat.nameEn}</span>
              <ArrowRight
                className="category-arrow-icon"
                style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

