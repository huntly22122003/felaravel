'use client';

import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts, fetchBanners } from '@/services/api';
import Header from '@/components/Header';
import MenuNgang from '@/components/MenuNgang';
import MenuTrai from '@/components/MenuTrai';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts(), fetchBanners()])
      .then(([cats, prods, banners]) => {
        setCategories(cats || []);
        setProducts(prods?.data || prods || []);
        setBanners(banners || []);
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
      
      {/* ===== HEADER + MENU NGANG ===== */}
      <Header>
        <MenuNgang categories={categories} />
      </Header>

      {/* ===== BODY ===== */}
      <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: 0 }}>
        <tbody>
          <tr>
            <td align="center" className="bgallpage">
              <table style={{ width: '915px', border: 0 }} cellPadding="0" cellSpacing="0">
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
                            <td style={{ width: '196px' }} valign="top" align="left">
                              <MenuTrai categories={categories} />
                            </td>
                            <td valign="top" align="center" style={{ padding: '0 10px' }}>
                              <MainContent products={products} banners={banners} />
                            </td>
                            {/* Có thể thêm MenuPhai ở đây nếu cần */}
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

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}