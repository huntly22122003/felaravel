// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { getBanners } from '@/services/adminApi';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        console.log('Banners fetched:', data); // Debug log
        setBanners(data || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header categories={categories} />
      
      <div className={styles.mainLayout}>
        <div className={styles.sidebarWrapper}>
          {/* ✅ TRUYỀN banners VÀO Sidebar */}
          <Sidebar 
            categories={categories} 
            banners={banners} 
          />
        </div>

        <div className={styles.contentWrapper}>
          <MainContent 
            products={products} 
            banners={banners} 
            posts={posts} 
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}