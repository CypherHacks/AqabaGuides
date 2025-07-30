// src/components/Sponsors.tsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ExternalLink, Eye, Download } from 'lucide-react';

// PDF imports
import AgilityPDF from '../Comp/Agility.pdf';
import ALVPDF from '../Comp/ALV.pdf';
import AqabaCompanyPDF from '../Comp/AqabaCompany.pdf';
import AqabaPortPDF from '../Comp/AqabaPort.pdf';
import BADRPDF from '../Comp/BADR.pdf';
import BankPDF from '../Comp/Bank.pdf';
import CMAPDF from '../Comp/CMA.pdf';
import EaglesPDF from '../Comp/Eagles.pdf';
import GACPDF from '../Comp/GAC.pdf';
import GoldenPDF from '../Comp/Golden.pdf';
import KHIAPDF from '../Comp/KHIA.pdf';
import MaritimePDF from '../Comp/Maritime.pdf';
import MEEESPDF from '../Comp/MEEES.pdf';
import NASPDF from '../Comp/NAS.pdf';
import NRECPDF from '../Comp/NREC.pdf';
import OrangePDF from '../Comp/Orange.pdf';
import PBIPDF from '../Comp/pbi.pdf';
import PILPDF from '../Comp/PIL.pdf';
import StudiesPDF from '../Comp/Studies.pdf';
import TLSPDF from '../Comp/TLS.pdf';
import NafithPDF from '../Comp/Nafith.pdf';

interface Sponsor {
  id: string;
  name_en: string;
  name_ar: string;
  logo: string;
  profileUrl?: string;
  pdfUrl: string;
}

const sponsorsData: Sponsor[] = [
  {
    id: '1',
    name_en: 'Agility',
    name_ar: 'أجيليتي',
    logo: 'https://seeklogo.com/images/A/agility-logistics-logo-FBD3359CD5-seeklogo.com.png',
    profileUrl: 'https://www.agility.com/',
    pdfUrl: AgilityPDF,
  },
  {
    id: '2',
    name_en: 'Aqaba Logistics Village (ALV)',
    name_ar: 'قرية العقبة اللوجستية (ALV)',
    logo: 'https://media.licdn.com/dms/image/v2/C4E1BAQFjdZb4C_opFw/company-background_10000/company-background_10000/0/1583989719012?e=2147483647&v=beta&t=EAM23bbbQacQPZs15zLy5m93S3BMUD9iHfXBBoYRw88',
    profileUrl: 'https://www.alv.jo/',
    pdfUrl: ALVPDF,
  },
  {
    id: '3',
    name_en: 'Aqaba Company for Port Management & Operation',
    name_ar: 'شركة العقبة لإدارة وتشغيل الموانئ',
    logo: 'https://acpom.com.jo/ebv4.0/root_storage/ar/eb_homepage/logo1acpomemptybg.png',
    pdfUrl: AqabaCompanyPDF,
  },
  {
    id: '4',
    name_en: 'Aqaba Port Marine Services Company',
    name_ar: 'شركة خدمات الموانئ البحرية في العقبة',
    logo: 'https://www.apms.jo/wsimages/logo.png',
    profileUrl: 'https://www.apms.jo/',
    pdfUrl: AqabaPortPDF,
  },
  {
    id: '5',
    name_en: 'Badr Marine Repairs and Services Co.',
    name_ar: 'بدر للإصلاح وخدمات الملاحة البحرية',
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQF6uaigyYkLKQ/company-logo_200_200/company-logo_200_200/0/1691861062269/badrmarine_logo?e=2147483647&v=beta&t=zSOJxeLxAkfaxOxZO1FuoLnHTVGYAHaii0AKZ_DhGFs',
    profileUrl: 'https://www.badrmarine.com/',
    pdfUrl: BADRPDF,
  },
  {
    id: '6',
    name_en: 'The Housing Bank for Trade and Finance',
    name_ar: 'بنك الإسكان للتجارة والتمويل',
    logo: 'https://www.jordanfinancialservices.com/sites/default/files/images/logos/hb_logo_-_en-01.jpg',
    profileUrl: 'https://www.hbtf.com/',
    pdfUrl: BankPDF,
  },
  {
    id: '7',
    name_en: 'CMA CGM',
    name_ar: 'سي إم إيه سي جي إم (CMA CGM)',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVe_2Y2KKHo7iNmDu2DDb1XEKEpp1fKk8vnQ&s',
    profileUrl: 'https://www.cma-cgm.com/',
    pdfUrl: CMAPDF,
  },
  {
    id: '8',
    name_en: 'Eagle Hills',
    name_ar: 'إيجل هيلز',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxmRJxYAMVsmLBTftBMgVumM6LtjY8oFh_Bg&s',
    profileUrl: 'https://eaglehillsjordan.com/',
    pdfUrl: EaglesPDF,
  },
  {
    id: '9',
    name_en: 'Gulf Agency Company',
    name_ar: 'شركة الخليج للوكالات',
    logo: 'https://play-lh.googleusercontent.com/Aay14jRKjMeAsyAICdJ82G1nU-DLQpZSpLJ2_Jt4BuElgvTexhNRDXUT5DbQSwngBSo=w600-h300-pc0xffffff-pd',
    profileUrl: 'https://www.gac.com/',
    pdfUrl: GACPDF,
  },
  {
    id: '10',
    name_en: 'Golden Triangle for Investment Co.',
    name_ar: 'المثلث الذهبي للاستثمار',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR735kDdneXm3SgU039UvVwnQEtHMmGDGtpiw&s',
    pdfUrl: GoldenPDF,
  },
  {
    id: '11',
    name_en: 'King Hussein International Airport',
    name_ar: 'مطار الملك حسين الدولي',
    logo: 'https://khiaops.com/aac/images/logo_e.jpg',
    profileUrl: 'http://www.aac.jo/',
    pdfUrl: KHIAPDF,
  },
  {
    id: '12',
    name_en: 'Jordan Maritime Authority',
    name_ar: 'الهيئة البحرية الأردنية',
    logo: 'https://jma.gov.jo/wp-content/uploads/2021/02/logo-mini2.png',
    profileUrl: 'http://www.jma.gov.jo/',
    pdfUrl: MaritimePDF,
  },
  {
    id: '13',
    name_en: 'MEEES Corp.',
    name_ar: 'شركة MEEES',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFJ5VTwJaRjhQO-nC_FdpseiSuZ0lf-6GB4w&s',
    profileUrl: 'https://www.meeescorp.com/',
    pdfUrl: MEEESPDF,
  },
  {
    id: '14',
    name_en: 'National Aviation Services (NAS)',
    name_ar: 'الخدمات الوطنية للطيران (NAS)',
    logo: 'https://nas.aero/img/logo.png',
    profileUrl: 'https://www.nas.aero/',
    pdfUrl: NASPDF,
  },
  {
    id: '15',
    name_en: 'National Real Estate Company',
    name_ar: 'الشركة الوطنية العقارية',
    logo: 'https://companieslogo.com/img/orig/NRE.KW_BIG-e910aa99.png?t=1720244493',
    profileUrl: 'https://nrecjordan.com/',
    pdfUrl: NRECPDF,
  },
  {
    id: '16',
    name_en: 'Orange Jordan',
    name_ar: 'أورنج الأردن',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg',
    profileUrl: 'https://orange.jo/',
    pdfUrl: OrangePDF,
  },
  {
    id: '17',
    name_en: 'PBI Aqaba Industrial Estate LLP',
    name_ar: 'PBI العقبة للصناعات',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSecViOFFTbsT1Jso4AZFIxWupLxjeU5_E1fw&s',
    profileUrl: 'https://pbiaqaba-jo.com/',
    pdfUrl: PBIPDF,
  },
  {
    id: '18',
    name_en: 'Pacific International Lines (PIL)',
    name_ar: 'خطوط باسيفيك الدولية (PIL)',
    logo: 'https://www.moe.gov.sg/-/media/sgis/industries/2022-pacific-international-lines.jpg?h=120&hash=19D85CA4A631D909C7A49EFF51B5EF14',
    profileUrl: 'https://www.pilship.com/',
    pdfUrl: PILPDF,
  },
  {
    id: '19',
    name_en: 'Jordan Academy for Maritime Studies',
    name_ar: 'الأكاديمية الأردنية للدراسات البحرية',
    logo: 'https://jams.edu.jo/wp-content/uploads/2020/09/Logo1-white-jams-1.jpg',
    profileUrl: 'https://jams.edu.jo/',
    pdfUrl: StudiesPDF,
  },
  {
    id: '20',
    name_en: 'Trust For Logistic Services Ltd.',
    name_ar: 'ترست لخدمات اللوجستيات المحدودة',
    logo: 'https://amcham.jo/wp-content/uploads/2020/06/Trust-for-Logistics.jpg',
    profileUrl: 'https://amcham.jo/?sptp_member=trust-for-logistics',
    pdfUrl: TLSPDF,
  },
  {
    id: '21',
    name_en: 'Nafith Logistics Services Co',
    name_ar: 'شركة نافذ للخدمات اللوجستية',
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEArXlZQEK4vg/company-logo_200_200/company-logo_200_200/0/1739096075595/nafith_logistics_logo?e=2147483647&v=beta&t=PjTBNr_9XN1_xr1n5KCWWtKp9P2Ny4O4XKM5mbDDIyI',
    profileUrl: 'https://www.nafith.com/',
    pdfUrl: NafithPDF,
  },
];

const Sponsors: React.FC = () => {
  const { t, i18n } = useTranslation();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const handleViewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPdf = (pdfUrl: string, companyName: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${companyName.replace(/\s+/g, '-').toLowerCase()}-profile.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProcessedLogo = (logoUrl: string, companyName: string) => {
    if (logoUrl.includes('favicon') || logoUrl.includes('icon')) {
      return `https://via.placeholder.com/300x150?text=${encodeURIComponent(companyName)}`;
    }
    return logoUrl;
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-100 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            {t('hero.supportersTitle')}
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          
          <p className="text-xl text-slate-600 leading-relaxed font-light">
            {t('hero.supportersDesc')}
          </p>
        </div>

        {/* Enhanced Slider */}
        <div className="relative">
          <Slider {...settings} className="modern-sponsor-slider">
            {sponsorsData.map(sponsor => {
              const displayName = i18n.language === 'ar' ? sponsor.name_ar : sponsor.name_en;

              return (
                <div key={sponsor.id} className="px-4 focus:outline-none">
                  <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02]">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                    
                    {/* Logo Section */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6 rounded-t-3xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                      <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={getProcessedLogo(sponsor.logo, displayName)}
                          alt={displayName}
                          onError={e => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x150?text=${encodeURIComponent(displayName)}`;
                          }}
                          className="max-h-full max-w-full object-contain drop-shadow-md"
                          style={{ filter: 'contrast(1.1) saturate(1.1)' }}
                        />
                      </div>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
                    </div>

                    {/* Content Section */}
                    <div className="relative p-6 flex-grow flex flex-col bg-white/90 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 text-center leading-tight min-h-[3rem] flex items-center justify-center">
                        {displayName}
                      </h3>

                      {/* Action Buttons */}
                      <div className="mt-auto space-y-3">
                        {sponsor.profileUrl && (
                          <a
                            href={sponsor.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                            {t('hero.visitWebsite')}
                            <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                          </a>
                        )}

                        {/* PDF Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleViewPdf(sponsor.pdfUrl)}
                            className="group/view flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Eye className="w-4 h-4 mr-2 group-hover/view:scale-110 transition-transform duration-200" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(sponsor.pdfUrl, displayName)}
                            className="group/download flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Download className="w-4 h-4 mr-2 group-hover/download:scale-110 transition-transform duration-200" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      <style>{`
        /* Modern Slider Styles */
        .modern-sponsor-slider .slick-dots {
          bottom: -60px;
          display: flex !important;
          justify-content: center;
          gap: 8px;
        }
        
        .modern-sponsor-slider .slick-dots li {
          width: auto;
          height: auto;
          margin: 0;
        }
        
        .modern-sponsor-slider .slick-dots li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          opacity: 0.7;
        }
        
        .modern-sponsor-slider .slick-dots li button:hover {
          transform: scale(1.2);
          opacity: 1;
        }
        
        .modern-sponsor-slider .slick-dots li button:before {
          display: none;
        }
        
        .modern-sponsor-slider .slick-dots li.slick-active button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          transform: scale(1.3);
          opacity: 1;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .modern-sponsor-slider .slick-slide {
          padding: 0 8px;
        }
        
        .modern-sponsor-slider .slick-track {
          display: flex;
          align-items: stretch;
        }
        
        .modern-sponsor-slider .slick-slide > div {
          height: 100%;
        }
        
        /* Navigation arrows */
        .modern-sponsor-slider .slick-prev,
        .modern-sponsor-slider .slick-next {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .modern-sponsor-slider .slick-prev:hover,
        .modern-sponsor-slider .slick-next:hover {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-color: #1d4ed8;
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
        }
        
        .modern-sponsor-slider .slick-prev:before,
        .modern-sponsor-slider .slick-next:before {
          font-size: 18px;
          color: #64748b;
          transition: color 0.3s ease;
        }
        
        .modern-sponsor-slider .slick-prev:hover:before,
        .modern-sponsor-slider .slick-next:hover:before {
          color: white;
        }
        
        .modern-sponsor-slider .slick-prev {
          left: -60px;
        }
        
        .modern-sponsor-slider .slick-next {
          right: -60px;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .modern-sponsor-slider .slick-prev,
          .modern-sponsor-slider .slick-next {
            width: 40px;
            height: 40px;
          }
          
          .modern-sponsor-slider .slick-prev {
            left: -50px;
          }
          
          .modern-sponsor-slider .slick-next {
            right: -50px;
          }
          
          .modern-sponsor-slider .slick-prev:before,
          .modern-sponsor-slider .slick-next:before {
            font-size: 16px;
          }
        }
        
        /* Smooth animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modern-sponsor-slider .slick-slide {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Sponsors;