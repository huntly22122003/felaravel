// components/MainContent.tsx - Tối ưu Intersection Observer
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './MainContent.module.css';

interface MainContentProps {
  products?: any[];
  banners?: any[];
  posts?: any[];
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

export default function MainContent({ products: initialProducts, banners, posts: initialPosts }: MainContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs cho Intersection Observer
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Dữ liệu mẫu cho posts
  const samplePosts = [
    { id: 1, title: 'Hướng dẫn chăm sóc cây kim ngân', date: '23/06/2026' },
    { id: 2, title: 'Top 5 cây cảnh văn phòng đẹp nhất', date: '22/06/2026' },
    { id: 3, title: 'Bí quyết trồng sen đá nở hoa', date: '21/06/2026' },
    { id: 4, title: 'Cây phong thủy hợp tuổi Tý', date: '20/06/2026' },
  ];

  const displayPosts = initialPosts && initialPosts.length > 0 ? initialPosts : samplePosts;

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
    if (product.thumbnail) {
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
    return '/images/default-product.jpg';
  };

  return (
    <main className={styles.mainContent}>
      {/* Main Banner */}
      <div 
        ref={el => sectionRefs.current[0] = el}
        className={`${styles.mainBanner} ${visibleSections.has(0) ? styles.sectionVisible : styles.sectionHidden}`}
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

      {/* Small Banners */}
      <div 
        ref={el => sectionRefs.current[1] = el}
        className={`${styles.smallBanners} ${visibleSections.has(1) ? styles.sectionVisible : styles.sectionHidden}`}
      >
        {banners && banners.length > 0 ? (
          banners.map((banner, index) => (
            <div key={banner.id || index} className={styles.smallBannerItem}>
              <img src={banner.image} alt={banner.title || `Banner ${index + 1}`} loading="lazy" />
              <div className={styles.smallBannerContent}>
                <h4>{banner.title}</h4>
                <p>{banner.subtitle}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className={styles.smallBannerItem}>
              <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop" alt="Cây trong nhà" loading="lazy" />
              <div className={styles.smallBannerContent}>
                <h4>Cây trong nhà</h4>
                <p>Không gian xanh mát</p>
              </div>
            </div>
            <div className={styles.smallBannerItem}>
              <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop" alt="Cây văn phòng" loading="lazy" />
              <div className={styles.smallBannerContent}>
                <h4>Cây văn phòng</h4>
                <p>Thanh lọc không khí</p>
              </div>
            </div>
            <div className={styles.smallBannerItem}>
              <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop" alt="Cây phong thủy" loading="lazy" />
              <div className={styles.smallBannerContent}>
                <h4>Cây phong thủy</h4>
                <p>May mắn - Tài lộc</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* News Section */}
      <div 
        ref={el => sectionRefs.current[2] = el}
        className={`${styles.newsSection} ${visibleSections.has(2) ? styles.sectionVisible : styles.sectionHidden}`}
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

      {/* Products Section */}
      <div 
        ref={el => sectionRefs.current[3] = el}
        className={`${styles.productsSection} ${visibleSections.has(3) ? styles.sectionVisible : styles.sectionHidden}`}
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
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop";
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
    </main>
  );
}