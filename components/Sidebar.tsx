'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  categories: any[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Dữ liệu mẫu cho sidebar
  const sidebarItems = [
    { id: 1, name: 'Cây cảnh trong nhà', icon: '🌿', count: 24 },
    { id: 2, name: 'Cây công trình', icon: '🌳', count: 18 },
    { id: 3, name: 'Hoa cảnh', icon: '🌸', count: 32 },
    { id: 4, name: 'Cây tiểu cảnh', icon: '🌵', count: 15 },
    { id: 5, name: 'Cây văn phòng', icon: '🪴', count: 20 },
    { id: 6, name: 'Cây phong thủy', icon: '🎍', count: 12 },
  ];

  const handleCategoryClick = (id: number) => {
    setActiveCategory(id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
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
          <span className={styles.statNumber}>121</span>
          <span className={styles.statLabel}>Sản phẩm</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>6</span>
          <span className={styles.statLabel}>Danh mục</span>
        </div>
      </div>

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