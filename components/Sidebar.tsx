'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  categories: any[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Dữ liệu mẫu cho sidebar
  const sidebarItems = [
    { id: 1, name: '🌿 Cây cảnh trong nhà', count: 24 },
    { id: 2, name: '🌳 Cây công trình', count: 18 },
    { id: 3, name: '🌸 Hoa cảnh', count: 32 },
    { id: 4, name: '🌵 Cây tiểu cảnh', count: 15 },
    { id: 5, name: '🪴 Cây văn phòng', count: 20 },
    { id: 6, name: '🎍 Cây phong thủy', count: 12 },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>📂 Danh mục</h3>
        <span className={styles.sidebarCount}>{sidebarItems.length} danh mục</span>
      </div>

      <nav className={styles.sidebarNav}>
        {sidebarItems.map((item) => (
          <a
            key={item.id}
            href={`?category=${item.id}`}
            className={styles.sidebarLink}
          >
            <span className={styles.sidebarLinkIcon}>{item.name.split(' ')[0]}</span>
            <span className={styles.sidebarLinkName}>{item.name}</span>
            <span className={styles.sidebarLinkCount}>{item.count}</span>
          </a>
        ))}
      </nav>

      <div className={styles.sidebarPromo}>
        <div className={styles.promoContent}>
          <span className={styles.promoIcon}>🌱</span>
          <h4 className={styles.promoTitle}>Mùa xuân mới</h4>
          <p className={styles.promoText}>Ưu đãi lên đến 30% cho cây cảnh</p>
          <a href="#" className={styles.promoButton}>Xem ngay</a>
        </div>
      </div>
    </aside>
  );
}