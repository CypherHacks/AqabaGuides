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
  pdfUrl?: string;
  isMain?: boolean;
}

const sponsorsData: Sponsor[] = [
  // --- MAIN SPONSORS ---
  {
    id: 'main1',
    name_en: 'ASEZA',
    name_ar: 'سلطة منطقة العقبة الاقتصادية الخاصة',
    logo: 'https://eservices.aseza.jo/assets/img/Slogo.png',
    profileUrl: 'https://aseza.jo/Default/Ar',
    isMain: true
  },
  {
    id: 'main2',
    name_en: 'ADC',
    name_ar: 'شركة تطوير العقبة',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQypWUsAWEhFz620RmXtGnl4ID9pasnSlfJcw&s',
    profileUrl: 'https://www.adc.jo/',
    isMain: true
  },
  // --- OTHER SPONSORS ---
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
    pdfUrl: NafithPDF,
  },
];

const Sponsors: React.FC = () => {
  const { t, i18n } = useTranslation();

  const mainSponsors = sponsorsData.filter(s => s.isMain);
  const otherSponsors = sponsorsData.filter(s => !s.isMain);

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

  const handleViewPdf = (pdfUrl?: string) => {
    if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPdf = (pdfUrl?: string, companyName?: string) => {
    if (!pdfUrl || !companyName) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${companyName.replace(/\s+/g, '-').toLowerCase()}-profile.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">

        {/* → MAIN SPONSORS */}
        <div className="mb-16 text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-6">
          </h3>
          <div className="flex flex-wrap justify-center gap-10">
            {mainSponsors.map(s => {
              const name = i18n.language === 'ar' ? s.name_ar : s.name_en;
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105"
                  style={{ minWidth: '280px', maxWidth: '350px' }}
                >
                  <div className="h-32 mb-4 flex items-center justify-center bg-white">
                    <img
                      src={s.logo}
                      alt={name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-center mb-4">{name}</h4>
                  {s.profileUrl && (
                    <a
                      href={s.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-indigo-700 font-medium"
                    >
                      {t('hero.visitWebsite')}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* → OTHER SPONSORS SLIDER */}
        <div className="relative">
          <Slider {...settings} className="modern-sponsor-slider">
            {otherSponsors.map(s => {
              const name = i18n.language === 'ar' ? s.name_ar : s.name_en;
              return (
                <div key={s.id} className="px-4 focus:outline-none">
                  <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-white/20 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02]">
                    
                    {/* Logo */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6 rounded-t-3xl">
                      <img
                        src={s.logo}
                        alt={name}
                        onError={e => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x150?text=${encodeURIComponent(name)}`;
                        }}
                        className="max-h-full max-w-full object-contain drop-shadow-md"
                      />
                    </div>

                    {/* Content */}
                    <div className="relative p-6 flex-grow flex flex-col bg-white/90 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 text-center leading-tight">
                        {name}
                      </h3>

                      <div className="mt-auto space-y-3">
                        {s.profileUrl && (
                          <a
                            href={s.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {t('hero.visitWebsite')}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </a>
                        )}

                        {s.pdfUrl && (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleViewPdf(s.pdfUrl)}
                              className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold shadow-sm"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                            </button>
                            <button
                              onClick={() => handleDownloadPdf(s.pdfUrl, name)}
                              className="flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg"
                            >
                              <Download className="w-4 h-4 mr-2" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      {/* (keep your existing <style>…</style> for slick custom styles) */}
    </section>
  );
};

export default Sponsors;
