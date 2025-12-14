import React, { useState, useEffect } from 'react';
import { Menu, Phone, Calendar as CalendarIcon, MapPin, Instagram, X } from 'lucide-react';
import Calendar from './components/Calendar';
import FadeIn from './components/FadeIn';
import { IMAGES, NAV_ITEMS, TEXT } from './constants';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isCyclingDrinkModalOpen, setIsCyclingDrinkModalOpen] = useState(false);
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const heroImages = [
    IMAGES.hero1,
    IMAGES.hero2,
    `/images/hero/${encodeURIComponent('スクリーンショット 2025-12-14 15.16.16.png')}`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openMenuModal = () => setIsMenuModalOpen(true);
  const closeMenuModal = () => setIsMenuModalOpen(false);
  const openCyclingDrinkModal = () => setIsCyclingDrinkModalOpen(true);
  const closeCyclingDrinkModal = () => setIsCyclingDrinkModalOpen(false);

  useEffect(() => {
    if (isMenuModalOpen || isCyclingDrinkModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuModalOpen, isCyclingDrinkModalOpen]);

  return (
    <div className="min-h-screen bg-background text-dark font-serif overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent">
        <h1 className="text-sm md:text-base font-bold tracking-wider z-50">
          おばんざいアゲハ食堂
        </h1>
        <div className="z-50">
          <button 
            onClick={toggleMenu}
            className="w-12 h-12 flex flex-col justify-center items-center gap-1.5 group"
          >
            {isMenuOpen ? (
               <X className="w-8 h-8 text-dark" />
            ) : (
              <>
                <span className="w-6 sm:w-8 h-0.5 bg-dark block transition-all group-hover:w-8 sm:group-hover:w-10"></span>
                <span className="w-6 sm:w-8 h-0.5 bg-dark block transition-all group-hover:w-5 sm:group-hover:w-6"></span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Overlay Navigation */}
      <div className={`fixed inset-0 bg-[#f4f4f2] z-30 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex`}>
        <div className="hidden md:block w-1/2 h-full bg-cover bg-center transition-all duration-700" style={{backgroundImage: `url(${IMAGES.visual6})`}}>
          <div className="w-full h-full bg-black/10"></div>
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center p-6 sm:p-8 relative">
           <nav className="flex flex-col gap-6 sm:gap-8">
             {NAV_ITEMS.map((item) => (
               <a 
                 key={item.id}
                 href={item.link} 
                 onClick={() => setIsMenuOpen(false)}
                 className="group flex items-center gap-4 sm:gap-6 text-2xl sm:text-3xl md:text-4xl font-light hover:text-primary transition-colors touch-manipulation"
               >
                 <span className="text-xs sm:text-sm font-sans text-secondary group-hover:text-primary transition-colors">{item.num}</span>
                 <span className="font-serif">{item.label}</span>
               </a>
             ))}
           </nav>
           <div className="absolute bottom-10 flex gap-6 text-secondary">
             <a href="#" className="hover:text-primary"><Phone /></a>
             <a href="https://www.instagram.com/agehashokudou/" target="_blank" rel="noreferrer" className="hover:text-primary"><Instagram /></a>
           </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {heroImages.map((src, index) => {
          // 日本語ファイル名の場合はエンコード
          const imageSrc = src.includes('スクリーンショット') 
            ? `/images/hero/${encodeURIComponent('スクリーンショット 2025-12-14 15.16.16.png')}`
            : src;
          return (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${
                activeHeroImage === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url(${imageSrc})`, transitionProperty: 'opacity, transform' }}
            >
               <div className="absolute inset-0 bg-black/35"></div>
            </div>
          );
        })}
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 py-8 md:p-4 z-10">
          <FadeIn delay={500}>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed mb-4 md:mb-6 whitespace-pre-wrap tracking-widest text-white [text-shadow:_2px_2px_8px_rgba(0,0,0,0.8),_0_0_20px_rgba(0,0,0,0.5)]">
              <span className="block sm:hidden">
                自然と季節が奏でる、{'\n'}小鉢のひと皿。からだが喜ぶ、{'\n'}美しい調和を。
              </span>
              <span className="hidden sm:block">
                {TEXT.hero.main}
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={1000}>
            <p className="text-xs sm:text-sm md:text-base leading-loose whitespace-pre-wrap font-sans text-white/95 [text-shadow:_1px_1px_6px_rgba(0,0,0,0.8),_0_0_15px_rgba(0,0,0,0.4)] max-w-2xl px-2">
              {TEXT.hero.sub}
            </p>
          </FadeIn>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white">
          <div className="w-[1px] h-16 bg-white mx-auto mb-2"></div>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* Concept Section */}
      <section id="concept" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
           <FadeIn className="absolute -top-8 sm:-top-12 left-0 text-[6rem] sm:text-[8rem] md:text-[10rem] text-gray-100 font-sans font-bold select-none -z-10 opacity-50">
             01
           </FadeIn>
           <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
             <div className="w-full md:w-1/2">
                <FadeIn direction="up">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <img src={IMAGES.concept} alt="Concept" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                  </div>
                </FadeIn>
             </div>
             <div className="w-full md:w-1/2">
               <FadeIn delay={200}>
                 <span className="text-primary tracking-widest text-sm font-sans font-bold block mb-4">Concept</span>
                 <h3 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-6 md:mb-8 whitespace-pre-wrap">
                   {TEXT.concept}
                 </h3>
                 <a href="#concept-detail" className="inline-block border-b border-dark pb-1 text-xs sm:text-sm tracking-widest hover:text-primary hover:border-primary transition-colors touch-manipulation">
                   Read More
                 </a>
               </FadeIn>
             </div>
           </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8 sm:gap-12 md:gap-24 relative">
          <FadeIn className="absolute -top-8 sm:-top-12 right-0 text-[6rem] sm:text-[8rem] md:text-[10rem] text-gray-100 font-sans font-bold select-none -z-10 opacity-50">
             02
          </FadeIn>
          <div className="w-full md:w-1/2">
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img src={IMAGES.menu} alt="Menu" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
              </div>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/2 text-right md:text-left">
             <FadeIn delay={200}>
               <span className="text-primary tracking-widest text-sm font-sans font-bold block mb-4">Menu</span>
               <h3 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-6 md:mb-8 whitespace-pre-wrap">
                 {TEXT.menu}
               </h3>
               <div className="flex flex-col gap-2 mb-6 sm:mb-8 text-secondary text-xs sm:text-sm font-sans">
                 <p>アゲハ小鉢定食￥1,650</p>
                 <div className="flex flex-col gap-1">
                   <p>喜びとしてのイエロープリン (かぼちゃプリン)</p>
                   <p>オリジナルロゴステッカー付</p>
                   <p>¥800</p>
                 </div>
                 <p>ブラジルコーヒー440</p>
               </div>
               <button 
                 onClick={openMenuModal}
                 className="inline-block border-b border-dark pb-1 text-xs sm:text-sm tracking-widest hover:text-primary hover:border-primary transition-colors cursor-pointer touch-manipulation"
               >
                 メニュー一覧
               </button>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* Cycling Drink Section */}
      <section id="cycling-drink" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-24 relative">
          <FadeIn className="absolute -top-8 sm:-top-12 left-0 text-[6rem] sm:text-[8rem] md:text-[10rem] text-gray-100 font-sans font-bold select-none -z-10 opacity-50">
             02-2
          </FadeIn>
          <div className="w-full md:w-2/5 max-w-md">
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img 
                  src={IMAGES.cyclingDrinkTop}
                  alt="Cycling Drink" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                />
              </div>
            </FadeIn>
          </div>
          <div className="w-full md:w-3/5">
            <FadeIn delay={200}>
              <span className="text-primary tracking-widest text-sm font-sans font-bold block mb-4">Cycling Drink</span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-6 md:mb-8 whitespace-pre-wrap">
                橋を渡りきった、その後の一杯
              </h3>
              <p className="text-secondary mb-4 md:mb-6 leading-relaxed text-sm sm:text-base">
                潮風を受けて走った体を、内側からゆっくり整えます。
              </p>
              <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8 text-secondary text-xs sm:text-sm font-sans">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">グリーンスムージー</p>
                  <p>¥605</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">柑橘レモンソーダ</p>
                  <p>¥495</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">バナナシェイク</p>
                  <p>¥605</p>
                </div>
                <p className="text-xs mt-2 opacity-75">※サイクリング後の疲労回復におすすめ</p>
              </div>
              <button 
                onClick={openCyclingDrinkModal}
                className="inline-block border-b border-dark pb-1 text-xs sm:text-sm tracking-widest hover:text-primary hover:border-primary transition-colors cursor-pointer touch-manipulation"
              >
                ドリンクメニュー一覧
               </button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Cycling Drink Modal */}
      {isCyclingDrinkModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8"
          onClick={closeCyclingDrinkModal}
        >
          <div 
            className="relative w-full h-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-sm overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-serif">Cycling Drink</h3>
              <button
                onClick={closeCyclingDrinkModal}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors touch-manipulation"
                aria-label="閉じる"
              >
                <X className="w-6 h-6 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-gray-50">
              <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                {/* グリーンスムージー */}
                <div className="bg-white rounded-sm p-4 sm:p-6 shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                        <img 
                          src={IMAGES.cyclingDrinkGreenSmoothie}
                          alt="グリーンスムージー"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <h4 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3 text-primary">グリーンスムージー</h4>
                      <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">¥605</p>
                      <p className="text-sm sm:text-base text-secondary leading-relaxed">
                        新鮮な緑の野菜とフルーツをブレンドした、栄養たっぷりのスムージー。サイクリング後の疲れた体に必要なビタミンとミネラルを補給できます。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 柑橘レモンソーダ */}
                <div className="bg-white rounded-sm p-4 sm:p-6 shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row-reverse gap-4 sm:gap-6">
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                        <img 
                          src={IMAGES.cyclingDrinkLemonSoda}
                          alt="柑橘レモンソーダ"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <h4 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3 text-primary">柑橘レモンソーダ</h4>
                      <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">¥495</p>
                      <p className="text-sm sm:text-base text-secondary leading-relaxed">
                        地元産レモンを使った爽やかな炭酸ドリンク。サイクリング後の喉の渇きを癒し、疲労回復に効果的なビタミンCを豊富に含んでいます。
                      </p>
                    </div>
                  </div>
                </div>

                {/* バナナシェイク */}
                <div className="bg-white rounded-sm p-4 sm:p-6 shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                        <img 
                          src={IMAGES.cyclingDrinkBananaShake}
                          alt="バナナシェイク"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <h4 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3 text-primary">バナナシェイク</h4>
                      <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">¥605</p>
                      <p className="text-sm sm:text-base text-secondary leading-relaxed">
                        濃厚でクリーミーなバナナシェイク。サイクリングで消費したエネルギーを素早く補給し、筋肉の回復をサポートします。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-secondary">
                    ※サイクリング後の疲労回復におすすめ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Section */}
      <section id="visual" className="py-12 sm:py-16 md:py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
           <FadeIn>
            <span className="text-6xl sm:text-7xl md:text-9xl text-gray-200 font-bold absolute left-1/2 -translate-x-1/2 -top-6 sm:-top-8 md:-top-10 -z-10">03</span>
            <h2 className="text-3xl sm:text-4xl font-serif mb-2 relative z-10">Visual</h2>
           </FadeIn>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-8 auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[300px]">
           {[
             IMAGES.visual1,
             `/images/visual/${encodeURIComponent('スクリーンショット 2025-12-14 15.23.05.png')}`,
             IMAGES.visual3,
             IMAGES.visual4,
             `/images/visual/${encodeURIComponent('スクリーンショット 2025-12-14 15.39.22.png')}`,
             IMAGES.visual5
           ].map((img, i) => (
             <FadeIn key={i} delay={i * 100} className={`rounded-sm overflow-hidden relative group ${i === 1 || i === 4 ? 'md:row-span-1' : ''} ${i === 0 ? 'row-span-2' : ''}`}>
               <img src={img} alt="Visual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             </FadeIn>
           ))}
        </div>
        <div className="text-center mt-12">
          <FadeIn>
            <a href="#visual" className="inline-block px-8 py-3 border border-dark text-sm tracking-widest hover:bg-dark hover:text-white transition-colors">
              View Gallery
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section id="articles" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <FadeIn>
              <span className="text-6xl sm:text-7xl md:text-9xl text-gray-200 font-bold absolute left-1/2 -translate-x-1/2 -top-6 sm:-top-8 md:-top-10 -z-10">04</span>
              <h2 className="text-3xl sm:text-4xl font-serif mb-2 relative z-10">Media</h2>
            </FadeIn>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Article Card */}
            <FadeIn>
              <article className="bg-background rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <div className="aspect-[16/9] bg-gray-200 overflow-hidden relative">
                  <img 
                    src={IMAGES.articleImage}
                    alt="記事" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // フォールバック: 既存の画像を使用
                      e.currentTarget.src = IMAGES.concept;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <span className="text-xs text-white font-sans tracking-widest uppercase bg-black/50 px-2 sm:px-3 py-1 rounded-sm inline-block">Tabiiro</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <span className="text-xs text-secondary font-sans tracking-widest uppercase mb-2 block">Media</span>
                  <h3 className="text-lg sm:text-xl font-serif mb-2 sm:mb-3">おばんざい アゲハ食堂</h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed mb-3 sm:mb-4">
                    心と体に優しい味が嬉しい因島の食堂
                  </p>
                  <a 
                    href="https://tabiiro.jp/gourmet/s/315800-onomichi-agehashokudou/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary hover:underline inline-flex items-center gap-2 touch-manipulation"
                  >
                    続きを読む
                    <span>→</span>
                  </a>
                </div>
              </article>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="access" className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-background relative">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
             <Calendar />
          </FadeIn>
        </div>
      </section>

      {/* Access Section */}
      <section id="access-info" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#3e4638] text-white">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12">
            <div className="w-full md:w-1/2">
               <FadeIn>
                 <span className="text-primary/80 tracking-widest text-sm font-sans font-bold block mb-4">04 Access</span>
                 <h3 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-6 sm:mb-8 whitespace-pre-wrap">
                   {TEXT.access}
                 </h3>
                 <div className="space-y-3 sm:space-y-4 font-sans text-xs sm:text-sm md:text-base opacity-80">
                   <p>〒722-2323<br/>広島県尾道市因島土生町1896-17 1F</p>
                   <p className="mt-3 sm:mt-4">
                     <span className="font-bold">【アクセス】</span><br/>
                     JR「尾道駅」から因島行きバスで 約25分<br/>
                     しまなみ海道「因島北IC」より車で 約10〜15分<br/>
                     しまなみ海道サイクリングロードから 自転車でそのまま来店可能
                   </p>
                 </div>
                 <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
                   <a href="https://share.google/5fQELDgst3HRuAtNK" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/30 px-4 sm:px-6 py-2 sm:py-3 hover:bg-white hover:text-primary transition-colors rounded-sm text-xs sm:text-sm touch-manipulation">
                      <MapPin size={14} className="sm:w-4 sm:h-4" /> Google Map
                   </a>
                 </div>
               </FadeIn>
            </div>
            <div className="w-full md:w-1/2 h-[200px] sm:h-[280px] md:h-[400px] grayscale hover:grayscale-0 transition-all duration-500 rounded-sm overflow-hidden">
               <img src={IMAGES.access} alt="Access" className="w-full h-full object-cover" />
            </div>
         </div>
      </section>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8"
          onClick={closeMenuModal}
        >
          <div 
            className="relative w-full h-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-sm overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-serif">メニュー一覧</h3>
              <button
                onClick={closeMenuModal}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors touch-manipulation"
                aria-label="閉じる"
              >
                <X className="w-6 h-6 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 sm:p-4 bg-gray-50 flex flex-col items-center justify-center">
              <img
                src={IMAGES.menuImage}
                alt="メニュー一覧"
                className="max-w-full h-auto"
                style={{ 
                  maxHeight: 'calc(95vh - 140px)',
                  width: 'auto',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#2a3026] text-gray-400 py-16 px-6 font-sans text-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white text-lg font-serif mb-6">おばんざいアゲハ食堂</h2>
            <p className="mb-4">070-8342-8452</p>
            <p className="text-xs text-gray-500">
               ※ お席のご予約も承っております。<br/>
               ※ 貸切やイベント開催により変更がございます。
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Menu</h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map(item => (
                <li key={item.id}><a href={item.link} className="hover:text-primary transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/agehashokudou/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs">
          おばんざいアゲハ食堂
        </div>
      </footer>


      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
         <a href="tel:07083428452" className="flex flex-col items-center gap-1 text-xs text-dark">
           <Phone size={20} />
           <span>Call</span>
         </a>
         <a href="#access" className="flex flex-col items-center gap-1 text-xs text-dark">
           <CalendarIcon size={20} />
           <span>Reserve</span>
         </a>
         <a href="https://share.google/5fQELDgst3HRuAtNK" className="flex flex-col items-center gap-1 text-xs text-dark">
           <MapPin size={20} />
           <span>Map</span>
         </a>
      </div>
    </div>
  );
};

export default App;