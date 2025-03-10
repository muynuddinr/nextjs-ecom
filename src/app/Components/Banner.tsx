'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerSlides = [
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070',
      title: 'Summer Collection 2024',
      description: 'Discover the latest trends in fashion with up to 40% off',
      buttonText: 'Shop Now',
      buttonLink: '/new-arrivals'
    },
    {
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070',
      title: 'Luxury Fashion',
      description: 'Exclusive designer collections at special prices',
      buttonText: 'View Collection',
      buttonLink: '/luxury'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071',
      title: 'Premium Accessories',
      description: 'Complete your look with our premium accessories',
      buttonText: 'Explore Now',
      buttonLink: '/accessories'
    }
  ];

  const featuredCategories = [
    { 
      name: 'Mens', 
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974',
      link: '/mens',
      description: 'Stylish menswear collection'
    },
    { 
      name: 'Womens', 
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070',
      link: '/womens',
      description: 'Elegant womenswear designs'
    },
    { 
      name: 'Kids', 
      image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=2071',
      link: '/kids',
      description: 'Comfortable kids fashion'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  return (
    <div className="space-y-12 mb-16">
      {/* Hero Banner Slider */}
      <div className="relative h-[600px] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 transform
              ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          >
            <div className="relative h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white space-y-6 px-4 max-w-3xl">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-up">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl animate-fade-up">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.buttonLink}
                    className="inline-block bg-white text-black px-8 py-4 rounded-full 
                             text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 
                             transition duration-300 animate-fade-up"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 
                ${index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group relative h-96 overflow-hidden rounded-2xl"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent 
                            group-hover:from-black/80 transition duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 group-hover:transform group-hover:-translate-y-2 
                             transition duration-300">
                  {category.name}
                </h3>
                <p className="text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 
                             group-hover:translate-y-0 transition duration-300">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
