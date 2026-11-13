import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shirt,
  Briefcase,
  BookOpen,
  Coffee,
  HeartPulse,
  Dumbbell,
  Smartphone,
  Puzzle,
  Gift,
  Home,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function CategoryCards() {
  const { isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const departments = [
    {
      id: 'school-uniforms',
      num: '01',
      nameEn: 'School Uniforms & Clothing',
      nameAr: 'الزي المدرسي والملابس',
      categorySlug: 'school-uniforms',
      phase: 'Phase 1 • Core Launch',
      isCore: true,
      icon: Shirt,
      accentColor: '#800020',
      descEn: 'Complete school dress: shirts, trousers, skirts, sweaters, sports uniforms, ties, belts, socks, shoes, jackets and caps.',
      descAr: 'الملابس المدرسية المتكاملة: قمصان، بناطيل، تنانير، سترات، زي رياضي، أحزمة، جوارب وأحذية.',
      sampleItemsEn: 'Polo Shirts • Trousers • Pleated Skirts • Shoes • Belts & Socks',
      sampleItemsAr: 'قمصان بولو • بناطيل • تنانير • أحذية • أحزمة وجوارب',
      link: '/uniforms?category=school-uniforms'
    },
    {
      id: 'school-bags',
      num: '02',
      nameEn: 'School Bags & Accessories',
      nameAr: 'الحقائب المدرسية والمستلزمات',
      categorySlug: 'school-bags',
      phase: 'Phase 1 • Core Launch',
      isCore: true,
      icon: Briefcase,
      accentColor: '#B8860B',
      descEn: 'Items for carrying school and daily needs: school, laptop and travel bags, pencil cases, lunch bags and rain covers.',
      descAr: 'حقائب مدرسية، حقائب لابتوب، مقالم، حقائب سفر، حقائب وجبات وأغطية واقية من المطر.',
      sampleItemsEn: 'Ergonomic Bags • Laptop Cases • Pencil Pouches • Rain Covers',
      sampleItemsAr: 'حقائب طبية • حقائب لابتوب • مقالم مدرسية • أغطية واقية',
      link: '/uniforms?category=school-bags'
    },
    {
      id: 'stationery-books',
      num: '03',
      nameEn: 'Stationery & Books',
      nameAr: 'القرطاسية والكتب المدرسية',
      categorySlug: 'stationery-books',
      phase: 'Phase 1 • Core Launch',
      isCore: true,
      icon: BookOpen,
      accentColor: '#1E3A8A',
      descEn: 'Study and classroom materials: notebooks, pens, geometry boxes, calculators, textbooks, storybooks, files and art supplies.',
      descAr: 'المستلزمات الدراسية: دفاتر، أقلام، أطقم هندسة، حاسبات، كتب دراسية، ملفات وأدوات رسم.',
      sampleItemsEn: 'Cambridge Textbooks • Spiral Notebooks • 10-Pc Geometry Kit • Pens',
      sampleItemsAr: 'كتب كامبريدج • دفاتر سلك • طقم هندسة 10 قطع • أقلام وملفات',
      link: '/uniforms?category=stationery-books'
    },
    {
      id: 'lunch-boxes',
      num: '04',
      nameEn: 'Lunch Boxes & Drinkware',
      nameAr: 'علب الطعام ومطارات المشروبات',
      categorySlug: 'lunch-boxes',
      phase: 'Phase 1 • Core Launch',
      isCore: true,
      icon: Coffee,
      accentColor: '#059669',
      descEn: 'Food and drink carriers: lunch boxes, containers, water bottles, flasks and insulated lunch bags.',
      descAr: 'علب الوجبات الصحية، حافظات الطعام، مطارات المياه الآمنة، ترامس وحقائب عازلة.',
      sampleItemsEn: 'BPA-Free Water Bottles • Bento Lunch Boxes • Thermal Flasks',
      sampleItemsAr: 'مطارات مياه خالية من BPA • علب بينتو مقسمة • ترامس حافظة للحرارة',
      link: '/uniforms?category=lunch-boxes'
    },
    {
      id: 'healthcare',
      num: '05',
      nameEn: 'Healthcare & Personal Care',
      nameAr: 'الرعاية الصحية والعناية الشخصية',
      categorySlug: 'healthcare',
      phase: 'Phase 1 • Trial Range',
      isCore: true,
      icon: HeartPulse,
      accentColor: '#DC2626',
      descEn: 'Basic health and hygiene items, no prescription medicines: first-aid kits, thermometers, sanitizers, masks and toiletries.',
      descAr: 'مستلزمات الصحة والنظافة العامة: حقائب إسعافات أولية، موازين حرارة، معقمات ومناديل صحية.',
      sampleItemsEn: 'Compact First-Aid Kits • Digital Thermometers • Hand Sanitizers',
      sampleItemsAr: 'حقائب إسعافات متكاملة • موازين حرارة رقمية • معقمات ومناديل',
      link: '/uniforms?category=healthcare'
    },
    {
      id: 'fitness-sports',
      num: '06',
      nameEn: 'Fitness & Sports Equipment',
      nameAr: 'معدات اللياقة والرياضة',
      categorySlug: 'fitness-sports',
      phase: 'Phase 2 • Expansion',
      isCore: false,
      icon: Dumbbell,
      accentColor: '#D97706',
      descEn: 'Exercise and sports items: dumbbells, resistance bands, yoga mats, skipping ropes, sports balls, rackets and shaker bottles.',
      descAr: 'مستلزمات التمرين والرياضة: أثقال خفيفة، حبال مقاومة، سجاد يوجا، حبال قفز، كرات ومضارب.',
      sampleItemsEn: 'Yoga Mats • Resistance Bands • Skipping Ropes • Shaker Bottles',
      sampleItemsAr: 'سجاد يوجا مانع للانزلاق • أحبال مقاومة • حبال قفز • زجاجات شيكر',
      link: '/uniforms?category=fitness-sports'
    },
    {
      id: 'electronics',
      num: '07',
      nameEn: 'Electronics & Mobile Accessories',
      nameAr: 'الإلكترونيات وملحقات الهاتف',
      categorySlug: 'electronics',
      phase: 'Phase 1 • Core Launch',
      isCore: true,
      icon: Smartphone,
      accentColor: '#2563EB',
      descEn: 'Small technology accessories: chargers, cables, earphones, power banks, phone covers, USB drives, mice and keyboards.',
      descAr: 'ملحقات التقنية: شواحن سريعة، كابلات، سماعات، بنوك طاقة، فلاشات وفأرة كمبيوتر.',
      sampleItemsEn: 'Fast Chargers • Braided Type-C Cables • Earphones • Power Banks',
      sampleItemsAr: 'شواحن سريعة • كابلات متينة Type-C • سماعات مريحة • باور بانك',
      link: '/uniforms?category=electronics'
    },
    {
      id: 'toys-educational',
      num: '08',
      nameEn: 'Toys & Educational Products',
      nameAr: 'ألعاب الذكاء والتعليم',
      categorySlug: 'toys-educational',
      phase: 'Phase 1 • Trial Range',
      isCore: true,
      icon: Puzzle,
      accentColor: '#7C3AED',
      descEn: 'Learning-based play: educational toys, puzzles, building blocks, science kits and board games.',
      descAr: 'ألعاب تنمية المهارات: ألعاب ذكاء، ألغاز تركيب، مكعبات بناء، تجارب علمية وألعاب لوحية.',
      sampleItemsEn: 'STEM Science Kits • Wooden Puzzles • Building Blocks • Logic Games',
      sampleItemsAr: 'أطقم تجارب STEM • ألغاز خشبية • مكعبات بناء ذكية • ألعاب منطقية',
      link: '/uniforms?category=toys-educational'
    },
    {
      id: 'gifts-craft',
      num: '09',
      nameEn: 'Gifts, Art & Craft',
      nameAr: 'الهدايا والأعمال الفنية والإبداعية',
      categorySlug: 'gifts-craft',
      phase: 'Phase 1 • Trial Range',
      isCore: true,
      icon: Gift,
      accentColor: '#DB2777',
      descEn: 'Occasion and creative items: cards, gifts, wrapping, party decorations, DIY kits and project materials.',
      descAr: 'المناسبات والإبداع: بطاقات تهنئة، هدايا، تغليف راقي، زينة، وأطقم أعمال فنية يدوية.',
      sampleItemsEn: 'Greeting Cards • Gift Wrapping • DIY Craft Kits • Art Project Sets',
      sampleItemsAr: 'بطاقات تهنئة • أوراق وأشرطة تغليف • أطقم أشغال فنية • ألوان وأدوات',
      link: '/uniforms?category=gifts-craft'
    },
    {
      id: 'household',
      num: '10',
      nameEn: 'Household & Daily Essentials',
      nameAr: 'المستلزمات المنزلية اليومية',
      categorySlug: 'household',
      phase: 'Phase 2 • Expansion',
      isCore: false,
      icon: Home,
      accentColor: '#4B5563',
      descEn: 'Home storage and cleaning items: storage boxes, organizers, kitchen accessories, tissue products and small tools.',
      descAr: 'حلول التخزين والنظافة المنزلية: صناديق ومنظمات، إكسسوارات مطبخ، منتجات ورقية وأدوات.',
      sampleItemsEn: 'Storage Organizers • Kitchen Containers • Daily Tissue • Small Tools',
      sampleItemsAr: 'صناديق تنظيم • حافظات مطبخ • مناديل ورقية • أدوات منزلية خفيفة',
      link: '/uniforms?category=household'
    },
    {
      id: 'travel-outdoor',
      num: '11',
      nameEn: 'Travel & Outdoor Accessories',
      nameAr: 'إكسسوارات السفر والرحلات',
      categorySlug: 'travel-outdoor',
      phase: 'Phase 3 • Lifestyle',
      isCore: false,
      icon: Compass,
      accentColor: '#047857',
      descEn: 'Luggage and outdoor gear: suitcases, travel organizers, tents, sleeping bags, lanterns, hiking bags and coolers.',
      descAr: 'مستلزمات السفر والمغامرات: حقائب سفر، منظمات أمتعة، خيام، أكياس نوم، فوانيس ومبردات.',
      sampleItemsEn: 'Travel Packing Cubes • Suitcases • Camping Lanterns • Cooler Bags',
      sampleItemsAr: 'منظمات سفر وحقائب • فوانيس إضاءة للرحلات • حقائب تبريد وحفظ',
      link: '/uniforms?category=travel-outdoor'
    }
  ];

  const filteredDepts = departments.filter(d => {
    if (activeFilter === 'core') return d.isCore;
    if (activeFilter === 'expansion') return !d.isCore;
    return true;
  });

  return (
    <section id="departments" className="classic-departments-section">
      <div className="departments-inner-container">
        
        {/* Section Header */}
        <div className="departments-section-header">
          <div className="dept-header-badge">
            <Layers size={15} style={{ color: '#D4AF37' }} />
            <span>{isRTL ? 'خطة الأقسام الرسمية' : 'Comprehensive Retail Departments'}</span>
          </div>
          
          <h2 className="departments-main-title">
            {isRTL ? 'أقسام المتجر الـ 11 المعتمدة' : 'Our 11 Product Departments'}
          </h2>
          
          <p className="departments-main-subtitle">
            {isRTL
              ? 'متجر متكامل يجمع 11 قسماً متخصصاً تحت سقف واحد لتلبية كافة متطلبات الطلاب، العائلات، المعلمين، والمكاتب في زيارة واحدة.'
              : 'Bringing eleven curated product departments together in one place, so customers can buy school, family, health, fitness, technology, household, and travel items in a single seamless visit.'}
          </p>

          {/* Phase Filter Tabs */}
          <div className="department-filter-tabs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`filter-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
            >
              <span>{isRTL ? 'جميع الأقسام (11)' : 'All 11 Departments'}</span>
            </button>
            <button
              onClick={() => setActiveFilter('core')}
              className={`filter-tab-pill ${activeFilter === 'core' ? 'active' : ''}`}
            >
              <Sparkles size={14} />
              <span>{isRTL ? 'مرحلة الإطلاق الأساسي (7)' : 'Phase 1: Core Launch (7)'}</span>
            </button>
            <button
              onClick={() => setActiveFilter('expansion')}
              className={`filter-tab-pill ${activeFilter === 'expansion' ? 'active' : ''}`}
            >
              <span>{isRTL ? 'مرحلة التوسع ونمط الحياة (4)' : 'Phase 2 & 3: Expansion & Lifestyle (4)'}</span>
            </button>
          </div>
        </div>

        {/* 11 Departments Grid with Classic Professional Design */}
        <div className="departments-card-grid">
          {filteredDepts.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <div key={dept.id} className="dept-luxury-card">
                
                {/* Top Row: Department Number & Phase Tag */}
                <div className="dept-card-topbar">
                  <span className="dept-number-tag">{dept.num}</span>
                  <span className={`dept-phase-badge ${dept.isCore ? 'core-badge' : 'expansion-badge'}`}>
                    {dept.phase}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="dept-card-header">
                  <div className="dept-icon-box" style={{ borderColor: `${dept.accentColor}30`, backgroundColor: `${dept.accentColor}0D` }}>
                    <IconComponent size={24} style={{ color: dept.accentColor }} />
                  </div>
                  <div>
                    <h3 className="dept-title-en">{dept.nameEn}</h3>
                    <h4 className="dept-title-ar">{dept.nameAr}</h4>
                  </div>
                </div>

                {/* Definition & Products */}
                <p className="dept-definition-text">
                  {isRTL ? dept.descAr : dept.descEn}
                </p>

                {/* Sample Products Pill Strip */}
                <div className="dept-sample-strip">
                  <span className="sample-label">{isRTL ? 'أبرز المنتجات:' : 'Key Items:'}</span>
                  <span className="sample-value">{isRTL ? dept.sampleItemsAr : dept.sampleItemsEn}</span>
                </div>

                {/* Bottom Action: View Products Link */}
                <div className="dept-card-footer">
                  <Link to={dept.link} className="dept-explore-btn">
                    <span>{isRTL ? 'تصفح القسم' : 'Explore Department'}</span>
                    <ArrowRight size={16} className="btn-arrow-hover" style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
