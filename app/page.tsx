'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Gọi API ở đây
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header categories={categories} />
      
      <div className={styles.mainLayout}>
        <div className={styles.sidebarWrapper}>
          <Sidebar categories={categories} />
        </div>

        <div className={styles.contentWrapper}>
          <MainContent products={products} banners={banners} posts={posts} />
        </div>
      </div>

      <Footer />
    </div>
  );
}