// components/Sidebar.tsx - Fix lỗi maximum update depth
'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  categories: any[];
  banners?: any[];
}

// Map vị trí banner cho sidebar
const BANNER_POSITIONS = {
  SIDEBAR: '7', // Dòng chữ
  SIDEBAR_ALT: '5', // Ngoài cùng trái
};

export default function Sidebar({ categories, banners = [] }: SidebarProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [sidebarBanners, setSidebarBanners] = useState<any[]>([]);

  // Lọc banner cho sidebar - SỬ DỤNG useMemo để tránh re-render không cần thiết
  const sidebarItems = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || '🌿',
        count: cat.product_count || 0,
        slug: cat.slug
      }));
    }
    // Dữ liệu mẫu
    return [
      { id: 1, name: 'Cây cảnh trong nhà', icon: '🌿', count: 24 },
      { id: 2, name: 'Cây công trình', icon: '🌳', count: 18 },
      { id: 3, name: 'Hoa cảnh', icon: '🌸', count: 32 },
      { id: 4, name: 'Cây tiểu cảnh', icon: '🌵', count: 15 },
      { id: 5, name: 'Cây văn phòng', icon: '🪴', count: 20 },
      { id: 6, name: 'Cây phong thủy', icon: '🎍', count: 12 },
    ];
  }, [categories]);

  // Lọc banner cho sidebar - CHỈ CHẠY KHI banners THAY ĐỔI
  useEffect(() => {
    if (banners && banners.length > 0) {
      // Lấy banner ở vị trí 7 (Dòng chữ) hoặc 5 (Ngoài cùng trái)
      const filtered = banners.filter(
        b => (b.position === BANNER_POSITIONS.SIDEBAR || b.position === BANNER_POSITIONS.SIDEBAR_ALT) 
        && b.is_active !== false
      );
      // Sắp xếp theo sort_order và lấy tối đa 2 banner
      const sorted = [...filtered].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      setSidebarBanners(sorted.slice(0, 2));
    } else {
      setSidebarBanners([]);
    }
  }, [banners]); // ✅ CHỈ CHẠY KHI banners THAY ĐỔI

  const handleCategoryClick = (id: number) => {
    setActiveCategory(id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const getBannerImage = (banner: any) => {
    if (banner.image_path) {
      if (banner.image_path.startsWith('/')) {
        return banner.image_path;
      }
      if (banner.image_path.startsWith('http')) {
        return banner.image_path;
      }
      if (banner.image_path.startsWith('storage/')) {
        return `/${banner.image_path}`;
      }
      return `/${banner.image_path}`;
    }
    return '/images/default-banner.jpg';
  };

  // Render banner cho sidebar
  const renderSidebarBanners = () => {
    if (sidebarBanners.length === 0) {
      // Fallback banner mặc định
      return (
        <div className={styles.sidebarBannerItem}>
          <a href="#">
            <img 
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop" 
              alt="Banner sidebar"
              loading="lazy"
            />
            <div className={styles.sidebarBannerContent}>
              <h4>Ưu đãi đặc biệt</h4>
              <p>Giảm giá 20% cho thành viên</p>
            </div>
          </a>
        </div>
      );
    }

    return sidebarBanners.map((banner, index) => (
      <div key={banner.id || index} className={styles.sidebarBannerItem}>
        <a href={banner.link || '#'}>
          <img 
            src={getBannerImage(banner)} 
            alt={banner.title || `Banner ${index + 1}`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
            }}
          />
          <div className={styles.sidebarBannerContent}>
            <h4>{banner.title || 'Khuyến mãi'}</h4>
            {banner.summary && <p>{banner.summary}</p>}
            {banner.content && !banner.summary && <p>{banner.content}</p>}
          </div>
        </a>
      </div>
    ));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.headerContent}>
          <h3 className={styles.sidebarTitle}>Danh mục sản phẩm</h3>
          <span className={styles.sidebarBadge}>{sidebarItems.length}</span>
        </div>
        <p className={styles.sidebarSubtitle}>Khám phá các loại cây cảnh</p>
      </div>

      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm danh mục..." 
            className={styles.searchInput}
            value={searchValue}
            onChange={handleSearchChange}
          />
          {searchValue && (
            <button className={styles.searchClear} onClick={handleClearSearch}>
              ✕
            </button>
          )}
        </div>
        <button className={styles.searchButton}>
          Tìm kiếm
        </button>
      </div>

      <nav className={styles.sidebarNav}>
        {sidebarItems.map((item) => (
          <a
            key={item.id}
            href={`?category=${item.id}`}
            className={`${styles.sidebarLink} ${activeCategory === item.id ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClick(item.id);
            }}
          >
            <span className={styles.sidebarLinkIcon}>{item.icon}</span>
            <span className={styles.sidebarLinkName}>{item.name}</span>
            <span className={styles.sidebarLinkCount}>{item.count}</span>
          </a>
        ))}
      </nav>

      <div className={styles.sidebarDivider} />

      <div className={styles.sidebarStats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {sidebarItems.reduce((acc, item) => acc + item.count, 0)}
          </span>
          <span className={styles.statLabel}>Sản phẩm</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{sidebarItems.length}</span>
          <span className={styles.statLabel}>Danh mục</span>
        </div>
      </div>

      {/* Sidebar Banners - Từ API */}
      <div className={styles.sidebarBanners}>
        {renderSidebarBanners()}
      </div>

      <div className={styles.sidebarDivider} />

      <div className={styles.sidebarPromo}>
        <div className={styles.promoContent}>
          <div className={styles.promoIconWrapper}>
            <span className={styles.promoIcon}>🌱</span>
          </div>
          <h4 className={styles.promoTitle}>Ưu đãi mùa xuân</h4>
          <p className={styles.promoText}>Giảm giá lên đến 30% cho tất cả cây cảnh</p>
          <a href="#" className={styles.promoButton}>
            Khám phá ngay
            <span className={styles.promoButtonArrow}>→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}