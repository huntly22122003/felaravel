'use client';

import { useState } from 'react';
import styles from './MainContent.module.css';

interface MainContentProps {
  products: any[];
  banners: any[];
  posts: any[];
}

export default function MainContent({ products, banners, posts }: MainContentProps) {
  // Dữ liệu mẫu
  const sampleProducts = [
    { id: 1, name: 'Cây Kim Ngân', price: '350.000đ', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&h=300&fit=crop' },
    { id: 2, name: 'Cây Phú Quý', price: '280.000đ', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&h=300&fit=crop' },
    { id: 3, name: 'Cây Ngọc Ngân', price: '420.000đ', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&h=300&fit=crop' },
    { id: 4, name: 'Sen Đá', price: '150.000đ', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&h=300&fit=crop' },
    { id: 5, name: 'Cây Lưỡi Hổ', price: '220.000đ', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&h=300&fit=crop' },
    { id: 6, name: 'Cây Trầu Bà', price: '180.000đ', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&h=300&fit=crop' },
  ];

  const samplePosts = [
    { id: 1, title: 'Hướng dẫn chăm sóc cây kim ngân', date: '23/06/2026' },
    { id: 2, title: 'Top 5 cây cảnh văn phòng đẹp nhất', date: '22/06/2026' },
    { id: 3, title: 'Bí quyết trồng sen đá nở hoa', date: '21/06/2026' },
    { id: 4, title: 'Cây phong thủy hợp tuổi Tý', date: '20/06/2026' },
  ];

  const displayProducts = products.length > 0 ? products : sampleProducts;
  const displayPosts = posts.length > 0 ? posts : samplePosts;

  return (
    <main className={styles.mainContent}>
      {/* Main Banner */}
      <div className={styles.mainBanner}>
        <img 
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=400&fit=crop" 
          alt="Banner chính" 
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h2 className={styles.bannerTitle}>🌿 Chào mùa xuân mới</h2>
          <p className={styles.bannerSub}>Cây cảnh đẹp - Không gian xanh</p>
          <a href="#" className={styles.bannerButton}>Khám phá ngay</a>
        </div>
      </div>

      {/* Small Banners */}
      <div className={styles.smallBanners}>
        <div className={styles.smallBannerItem}>
          <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop" alt="Banner 1" />
          <div className={styles.smallBannerContent}>
            <h4>Cây trong nhà</h4>
            <p>Không gian xanh mát</p>
          </div>
        </div>
        <div className={styles.smallBannerItem}>
          <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop" alt="Banner 2" />
          <div className={styles.smallBannerContent}>
            <h4>Cây văn phòng</h4>
            <p>Thanh lọc không khí</p>
          </div>
        </div>
        <div className={styles.smallBannerItem}>
          <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop" alt="Banner 3" />
          <div className={styles.smallBannerContent}>
            <h4>Cây phong thủy</h4>
            <p>May mắn - Tài lộc</p>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className={styles.newsSection}>
        <div className={styles.newsBox}>
          <h3 className={styles.newsTitle}>📰 Tin tức mới</h3>
          <ul className={styles.newsList}>
            {displayPosts.map((post) => (
              <li key={post.id} className={styles.newsItem}>
                <a href="#" className={styles.newsLink}>
                  <span className={styles.newsLinkTitle}>{post.title}</span>
                  <span className={styles.newsLinkDate}>{post.date}</span>
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
      <div className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h3 className={styles.productsTitle}>🌿 Sản phẩm nổi bật</h3>
          <a href="#" className={styles.productsViewAll}>Xem tất cả →</a>
        </div>

        <div className={styles.productsGrid}>
          {displayProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImageWrapper}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={styles.productImage} 
                />
                <div className={styles.productBadge}>Mới</div>
              </div>
              <h4 className={styles.productName}>{product.name}</h4>
              <div className={styles.productPrice}>{product.price}</div>
              <button className={styles.productButton}>Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}