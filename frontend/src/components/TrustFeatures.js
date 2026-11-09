import React from 'react';
import { ShieldCheck, Award, Truck, CreditCard, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export default function TrustFeatures() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <ShieldCheck size={32} strokeWidth={1.8} />,
      title: t('trustUniforms'),
      sub: t('trustUniformsSub')
    },
    {
      icon: <Award size={32} strokeWidth={1.8} />,
      title: t('trustQuality'),
      sub: t('trustQualitySub')
    },
    {
      icon: <Truck size={32} strokeWidth={1.8} />,
      title: t('trustDelivery'),
      sub: t('trustDeliverySub')
    },
    {
      icon: <CreditCard size={32} strokeWidth={1.8} />,
      title: t('trustPayment'),
      sub: t('trustPaymentSub')
    },
    {
      icon: <Headphones size={32} strokeWidth={1.8} />,
      title: t('trustSupport'),
      sub: t('trustSupportSub')
    }
  ];

  return (
    <section className="trust-bar-wrapper">
      <div className="trust-bar-container">
        {features.map((item, idx) => (
          <div key={idx} className="trust-item">
            <div className="trust-icon-box">
              {item.icon}
            </div>
            <div className="trust-text-stack">
              <span className="trust-title">{item.title}</span>
              <span className="trust-sub">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

