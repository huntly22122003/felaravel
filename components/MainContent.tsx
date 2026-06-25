// components/MainContent.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './MainContent.module.css';

interface MainContentProps {
  products?: any[];
  banners?: any[];
  posts?: any[];
}

interface Banner {
  id: number;
  title: string;
  link?: string;
  position: string;
  summary?: string;
  content?: string;
  image_path?: string;
  sort_order?: number;
  is_active: boolean;
}

interface Product {
  id: number;
  category_id: number;
  name: string;
  extraname?: string;
  slug: string;
  code?: string;
  price: number;
  brand?: string;
  origin?: string;
  model_no?: string;
  summary?: string;
  description?: string;
  technic_info?: string;
  thumbnail?: string;
  is_new: boolean;
  is_featured: boolean;
  has_gallery: boolean;
  sort_order: number;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
  };
}

// Hình ảnh mặc định từ Unsplash
const DEFAULT_IMAGES = {
  banner: 'https://images.unsplash.com/photo-1615280825886-fa817c0a06cc?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  product: 'https://images.unsplash.com/photo-1615280825886-fa817c0a06cc?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  smallBanner: 'https://images.unsplash.com/photo-1615280825886-fa817c0a06cc?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

export default function MainContent({ products: initialProducts, banners: initialBanners, posts: initialPosts }: MainContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs cho Intersection Observer
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Dữ liệu mẫu cho posts nếu không có dữ liệu từ API
  const samplePosts = [
    { id: 1, title: 'Hướng dẫn chăm sóc cây kim ngân', date: '23/06/2026' },
    { id: 2, title: 'Top 5 cây cảnh văn phòng đẹp nhất', date: '22/06/2026' },
    { id: 3, title: 'Bí quyết trồng sen đá nở hoa', date: '21/06/2026' },
    { id: 4, title: 'Cây phong thủy hợp tuổi Tý', date: '20/06/2026' },
  ];

  const displayPosts = initialPosts && initialPosts.length > 0 ? initialPosts : samplePosts;

  // Lọc banners theo vị trí
  const getBannersByPosition = useCallback((position: string) => {
    return banners.filter(b => b.position === position && b.is_active !== false);
  }, [banners]);

  // Lấy banner đầu tiên theo vị trí
  const getFirstBannerByPosition = useCallback((position: string) => {
    const filtered = getBannersByPosition(position);
    return filtered.length > 0 ? filtered[0] : null;
  }, [getBannersByPosition]);

  // Lấy tất cả banner theo vị trí và sắp xếp
  const getAllBannersByPosition = useCallback((position: string) => {
    return getBannersByPosition(position).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [getBannersByPosition]);

  // Intersection Observer - tối ưu với useCallback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const index = parseInt(entry.target.getAttribute('data-index') || '0');
      if (entry.isIntersecting) {
        setVisibleSections(prev => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
      }
    });
  }, []);

  // Setup Intersection Observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '0px',
    });

    const currentObserver = observerRef.current;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute('data-index', index.toString());
        currentObserver.observe(ref);
      }
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [handleIntersection]);

  // Load banners từ API hoặc từ props
  useEffect(() => {
    const loadBanners = async () => {
      try {
        if (initialBanners && initialBanners.length > 0) {
          setBanners(initialBanners);
          return;
        }

        // Gọi API để lấy banners
        const response = await fetch('/api/banners');
        if (response.ok) {
          const data = await response.json();
          const bannerList = data.data || data || [];
          setBanners(bannerList);
        } else {
          console.warn('Không thể tải banner từ API');
          setBanners([]);
        }
      } catch (err) {
        console.error('Error loading banners:', err);
        setBanners([]);
      }
    };

    loadBanners();
  }, [initialBanners]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (initialProducts && initialProducts.length > 0) {
          setProducts(initialProducts);
          setLoading(false);
          return;
        }

        let response;
        let data;

        response = await fetch('/api/products/featured');
        if (response.ok) {
          data = await response.json();
          const productList = data.data || data || [];
          if (productList.length > 0) {
            setProducts(productList);
            setLoading(false);
            return;
          }
        }

        response = await fetch('/api/products/new');
        if (response.ok) {
          data = await response.json();
          const productList = data.data || data || [];
          if (productList.length > 0) {
            setProducts(productList);
            setLoading(false);
            return;
          }
        }

        response = await fetch('/api/products?limit=8');
        if (response.ok) {
          data = await response.json();
          const productList = data.data || data || [];
          setProducts(productList);
        } else {
          throw new Error('Failed to fetch products');
        }

      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts]);

  const formatPrice = (price: number) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getProductImage = (product: Product) => {
    if (product.thumbnail && product.thumbnail.trim() !== '') {
      if (product.thumbnail.startsWith('/')) {
        return product.thumbnail;
      }
      if (product.thumbnail.startsWith('storage/')) {
        return `/${product.thumbnail}`;
      }
      if (product.thumbnail.startsWith('http')) {
        return product.thumbnail;
      }
      return `/${product.thumbnail}`;
    }
    // Sử dụng hình ảnh mặc định từ Unsplash
    return DEFAULT_IMAGES.product;
  };

  const getBannerImage = (banner: Banner) => {
    if (banner.image_path && banner.image_path.trim() !== '') {
      if (banner.image_path.startsWith('/')) {
        return banner.image_path;
      }
      if (banner.image_path.startsWith('storage/')) {
        return `/${banner.image_path}`;
      }
      if (banner.image_path.startsWith('http')) {
        return banner.image_path;
      }
      return `/${banner.image_path}`;
    }
    // Sử dụng hình ảnh mặc định từ Unsplash
    return DEFAULT_IMAGES.banner;
  };

  // Tạo mảng để lưu các section
  const sectionElements: JSX.Element[] = [];

  // Main Banner mặc định
  sectionElements.push(
    <div 
      key="default-banner"
      ref={el => sectionRefs.current[sectionElements.length] = el}
      className={`${styles.mainBanner} ${visibleSections.has(sectionElements.length) ? styles.sectionVisible : styles.sectionHidden}`}
    >
      <img 
        src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=400&fit=crop" 
        alt="Banner chính" 
        className={styles.bannerImage}
        loading="lazy"
      />
      <div className={styles.bannerOverlay}>
        <h2 className={styles.bannerTitle}>🌿 Chào mùa xuân mới</h2>
        <p className={styles.bannerSub}>Cây cảnh đẹp - Không gian xanh</p>
        <a href="#" className={styles.bannerButton}>Khám phá ngay</a>
      </div>
    </div>
  );

  // ===== BANNER CHÍNH (Vị trí 4) =====
  const mainBanner = getFirstBannerByPosition('4');
  if (mainBanner) {
    const currentIndex = sectionElements.length;
    sectionElements.push(
      <div 
        key={`main-banner-${mainBanner.id}`}
        ref={el => sectionRefs.current[currentIndex] = el}
        className={`${styles.mainBanner} ${visibleSections.has(currentIndex) ? styles.sectionVisible : styles.sectionHidden}`}
      >
        {mainBanner.link ? (
          <a href={mainBanner.link}>
            <img 
              src={getBannerImage(mainBanner)} 
              alt={mainBanner.title || 'Banner chính'} 
              className={styles.bannerImage}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_IMAGES.banner;
              }}
            />
          </a>
        ) : (
          <img 
            src={getBannerImage(mainBanner)} 
            alt={mainBanner.title || 'Banner chính'} 
            className={styles.bannerImage}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGES.banner;
            }}
          />
        )}
        <div className={styles.bannerOverlay}>
          <h2 className={styles.bannerTitle}>{mainBanner.title || 'Chào mừng bạn'}</h2>
          {mainBanner.summary && (
            <p className={styles.bannerSub}>{mainBanner.summary}</p>
          )}
          {mainBanner.link && (
            <a href={mainBanner.link} className={styles.bannerButton}>
              {mainBanner.content || 'Khám phá ngay'}
            </a>
          )}
        </div>
      </div>
    );
  }

  // ===== BANNER NHỎ (Vị trí 5 - Ngoài cùng trái, 6 - Ngoài cùng phải) =====
  const leftBanners = getAllBannersByPosition('5');
  const rightBanners = getAllBannersByPosition('6');
  
  if (leftBanners.length > 0 || rightBanners.length > 0) {
    const currentIndex = sectionElements.length;
    sectionElements.push(
      <div 
        key="small-banners"
        ref={el => sectionRefs.current[currentIndex] = el}
        className={`${styles.smallBanners} ${visibleSections.has(currentIndex) ? styles.sectionVisible : styles.sectionHidden}`}
      >
        {leftBanners.map((banner, index) => (
          <div key={banner.id || `left-${index}`} className={styles.smallBannerItem}>
            {banner.link ? (
              <a href={banner.link}>
                <img 
                  src={getBannerImage(banner)} 
                  alt={banner.title || `Banner ${index + 1}`} 
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.smallBanner;
                  }}
                />
                <div className={styles.smallBannerContent}>
                  <h4>{banner.title}</h4>
                  {banner.summary && <p>{banner.summary}</p>}
                </div>
              </a>
            ) : (
              <>
                <img 
                  src={getBannerImage(banner)} 
                  alt={banner.title || `Banner ${index + 1}`} 
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.smallBanner;
                  }}
                />
                <div className={styles.smallBannerContent}>
                  <h4>{banner.title}</h4>
                  {banner.summary && <p>{banner.summary}</p>}
                </div>
              </>
            )}
          </div>
        ))}
        
        {rightBanners.map((banner, index) => (
          <div key={banner.id || `right-${index}`} className={styles.smallBannerItem}>
            {banner.link ? (
              <a href={banner.link}>
                <img 
                  src={getBannerImage(banner)} 
                  alt={banner.title || `Banner ${index + 1}`} 
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.smallBanner;
                  }}
                />
                <div className={styles.smallBannerContent}>
                  <h4>{banner.title}</h4>
                  {banner.summary && <p>{banner.summary}</p>}
                </div>
              </a>
            ) : (
              <>
                <img 
                  src={getBannerImage(banner)} 
                  alt={banner.title || `Banner ${index + 1}`} 
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.smallBanner;
                  }}
                />
                <div className={styles.smallBannerContent}>
                  <h4>{banner.title}</h4>
                  {banner.summary && <p>{banner.summary}</p>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ===== BANNER QUẢNG CÁO GIỮA (Vị trí 3) =====
  const centerAds = getAllBannersByPosition('3');
  if (centerAds.length > 0) {
    const currentIndex = sectionElements.length;
    sectionElements.push(
      <div 
        key="center-ads"
        ref={el => sectionRefs.current[currentIndex] = el}
        className={`${styles.centerAdsSection} ${visibleSections.has(currentIndex) ? styles.sectionVisible : styles.sectionHidden}`}
      >
        {centerAds.map((banner) => (
          <div key={banner.id} className={styles.centerAdItem}>
            {banner.link ? (
              <a href={banner.link}>
                <img 
                  src={getBannerImage(banner)} 
                  alt={banner.title || 'Quảng cáo'} 
                  loading="lazy"
                  className={styles.centerAdImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.banner;
                  }}
                />
                {(banner.title || banner.summary) && (
                  <div className={styles.centerAdOverlay}>
                    {banner.title && <h3>{banner.title}</h3>}
                    {banner.summary && <p>{banner.summary}</p>}
                    {banner.content && <p className={styles.centerAdContent}>{banner.content}</p>}
                  </div>
                )}
              </a>
            ) : (
              <>
                <img 
                  src={getBannerImage(banner)} 
                  alt={banner.title || 'Quảng cáo'} 
                  loading="lazy"
                  className={styles.centerAdImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGES.banner;
                  }}
                />
                {(banner.title || banner.summary) && (
                  <div className={styles.centerAdOverlay}>
                    {banner.title && <h3>{banner.title}</h3>}
                    {banner.summary && <p>{banner.summary}</p>}
                    {banner.content && <p className={styles.centerAdContent}>{banner.content}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ===== DÒNG CHỮ (Vị trí 7) =====
  const textBanners = getAllBannersByPosition('7');
  if (textBanners.length > 0) {
    const currentIndex = sectionElements.length;
    sectionElements.push(
      <div 
        key="text-banners"
        ref={el => sectionRefs.current[currentIndex] = el}
        className={`${styles.textLineSection} ${visibleSections.has(currentIndex) ? styles.sectionVisible : styles.sectionHidden}`}
      >
        {textBanners.map((banner) => (
          <div key={banner.id} className={styles.textLineItem}>
            {banner.link ? (
              <a href={banner.link} className={styles.textLineLink}>
                {banner.title && <span className={styles.textLineTitle}>{banner.title}</span>}
                {banner.summary && <span className={styles.textLineSummary}>{banner.summary}</span>}
                {banner.content && <span className={styles.textLineContent}>{banner.content}</span>}
              </a>
            ) : (
              <>
                {banner.title && <span className={styles.textLineTitle}>{banner.title}</span>}
                {banner.summary && <span className={styles.textLineSummary}>{banner.summary}</span>}
                {banner.content && <span className={styles.textLineContent}>{banner.content}</span>}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ===== KHOÁ META (Vị trí 8) =====
  const metaBanners = getAllBannersByPosition('8');
  if (metaBanners.length > 0) {
    const currentIndex = sectionElements.length;
    sectionElements.push(
      <div 
        key="meta-banners"
        ref={el => sectionRefs.current[currentIndex] = el}
        className={`${styles.metaSection} ${visibleSections.has(currentIndex) ? styles.sectionVisible : styles.sectionHidden}`}
      >
        {metaBanners.map((banner) => (
          <div key={banner.id} className={styles.metaItem}>
            {banner.link ? (
              <a href={banner.link} className={styles.metaLink}>
                {banner.title && <h3>{banner.title}</h3>}
                {banner.summary && <p>{banner.summary}</p>}
                {banner.content && <p className={styles.metaContent}>{banner.content}</p>}
              </a>
            ) : (
              <>
                {banner.title && <h3>{banner.title}</h3>}
                {banner.summary && <p>{banner.summary}</p>}
                {banner.content && <p className={styles.metaContent}>{banner.content}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ===== NEWS SECTION =====
  const newsIndex = sectionElements.length;
  sectionElements.push(
    <div 
      key="news-section"
      ref={el => sectionRefs.current[newsIndex] = el}
      className={`${styles.newsSection} ${visibleSections.has(newsIndex) ? styles.sectionVisible : styles.sectionHidden}`}
    >
      <div className={styles.newsBox}>
        <h3 className={styles.newsTitle}>📰 Tin tức mới</h3>
        <ul className={styles.newsList}>
          {displayPosts.map((post) => (
            <li key={post.id} className={styles.newsItem}>
              <a href={`/posts/${post.id}`} className={styles.newsLink}>
                <span className={styles.newsLinkTitle}>{post.title}</span>
                <span className={styles.newsLinkDate}>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : post.date}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.newsBanner}>
        <div className={styles.newsBannerContent}>
          <span className={styles.newsBannerIcon}>🌱</span>
          <h3>Mùa mới - Cây mới</h3>
          <p>Cập nhật bộ sưu tập cây cảnh</p>
          <a href="#" className={styles.newsBannerButton}>Xem thêm</a>
        </div>
      </div>
    </div>
  );

  // ===== PRODUCTS SECTION =====
  const productsIndex = sectionElements.length;
  sectionElements.push(
    <div 
      key="products-section"
      ref={el => sectionRefs.current[productsIndex] = el}
      className={`${styles.productsSection} ${visibleSections.has(productsIndex) ? styles.sectionVisible : styles.sectionHidden}`}
    >
      <div className={styles.productsHeader}>
        <h3 className={styles.productsTitle}>🌿 Sản phẩm nổi bật</h3>
        <Link href="/products" className={styles.productsViewAll}>
          Xem tất cả →
        </Link>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.productsGrid}>
          {products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <div key={product.id} className={styles.productCard}>
                <Link href={`/products/${product.slug}`} className={styles.productLink}>
                  <div className={styles.productImageWrapper}>
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      className={styles.productImage}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGES.product;
                      }}
                    />
                    {product.is_new && (
                      <div className={styles.productBadge}>Mới</div>
                    )}
                    {product.is_featured && !product.is_new && (
                      <div className={`${styles.productBadge} ${styles.featuredBadge}`}>Nổi bật</div>
                    )}
                  </div>
                  <h4 className={styles.productName}>{product.name}</h4>
                  {product.extraname && (
                    <p className={styles.productExtraName}>{product.extraname}</p>
                  )}
                  <div className={styles.productPrice}>
                    {formatPrice(product.price)}
                  </div>
                  <button 
                    className={styles.productButton}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Added to cart:', product);
                    }}
                  >
                    Thêm vào giỏ
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <div className={styles.noProductsMessage}>
              <p>Chưa có sản phẩm nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render tất cả các section
  return (
    <main className={styles.mainContent}>
      {sectionElements}
    </main>
  );
}