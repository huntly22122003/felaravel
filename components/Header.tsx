'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

interface HeaderProps {
  categories: any[];
}

export default function Header({ categories }: HeaderProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const menuItems = [
    { name: 'Trang chủ', href: '/', icon: '🏠' },
    { name: 'Giới thiệu', href: '#', icon: '🌿' },
    { name: 'Tin tức', href: '?sAction=7', icon: '📰' },
    { name: 'Sản phẩm', href: '#', icon: '🌱' },
    { name: 'Mua hàng', href: '/online/', icon: '🛒' },
    { name: 'Liên hệ', href: '?sAction=6', icon: '📞' }
  ];

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  return (
    <header className={styles.header}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            ANH <span>QUÂN</span>
          </div>
          <div className={styles.slogan}>✦ mầm xanh mơ ước ✦</div>
        </div>
        
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Tìm
          </button>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconButton}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <button className={styles.iconButton}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </button>
          
     
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.menu}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.menuItem} ${hoverIndex === index ? styles.menuItemActive : ''}`}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <a href={item.href} className={styles.menuLink}>
              <span className={styles.menuIcon}>{item.icon}</span>
              {item.name}
            </a>
            
            {/* Dropdown Giới thiệu */}
            {item.name === 'Giới thiệu' && hoverIndex === index && (
              <div className={styles.dropdown}>
                {categories.filter((c: any) => c.parent_id === 82).map((cat: any) => (
                  <a
                    key={cat.id}
                    href={`?sAction=8&cateID=${cat.id}`}
                    className={styles.dropdownItem}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            )}
            
            {/* Dropdown Sản phẩm */}
            {item.name === 'Sản phẩm' && hoverIndex === index && (
              <div className={styles.dropdown}>
                {categories.filter((c: any) => c.parent_id === 84).map((cat: any) => (
                  <a
                    key={cat.id}
                    href={`?sAction=10&cateID=${cat.id}`}
                    className={styles.dropdownItem}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}