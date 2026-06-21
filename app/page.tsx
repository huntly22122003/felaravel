'use client';

import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts, fetchBanners, fetchPosts } from '@/services/api';
import Header from '@/components/Header';
import MenuTrai from '@/components/MenuTrai';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts(), fetchBanners(), fetchPosts()])
      .then(([cats, prods, banners, posts]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods?.data) ? prods.data : (Array.isArray(prods) ? prods : []));
        setBanners(Array.isArray(banners) ? banners : []);
        setPosts(Array.isArray(posts?.data) ? posts.data : (Array.isArray(posts) ? posts : []));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải dữ liệu:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={{ fontFamily: 'Tahoma, Verdana', fontSize: '11px' }}>
      <Header categories={categories} />
      
      <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: 0 }}>
        <tbody>
          <tr>
            <td align="center" className="bgallpage">
              <table style={{ width: '914px', border: 0, margin: '0 auto' }} cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td className="bgbienleft" valign="top">
                      <table cellPadding="0" cellSpacing="0" style={{ width: '12px', border: 0 }}>
                        <tbody><tr><td className="bienleft">&nbsp;</td></tr></tbody>
                      </table>
                    </td>
                    <td style={{ backgroundColor: '#FDFDFD' }} align="left" valign="top">
                      <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: 0 }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '196px' }} valign="top" align="center">
                              <MenuTrai categories={categories} />
                            </td>
                            <td valign="top" align="center">
                              <MainContent products={products} banners={banners} posts={posts} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="bgbienright" valign="top">
                      <table cellPadding="0" cellSpacing="0" style={{ width: '12px', border: 0 }}>
                        <tbody><tr><td className="bienright">&nbsp;</td></tr></tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <Footer />
    </div>
  );
}