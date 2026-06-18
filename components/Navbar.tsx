'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="header" style={{ background: "url('/images/banner.jpg') no-repeat", height: '207px', width: '915px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', height: '100%' }}>
        <div>
          <Link href="/" className="trangchu">Loc Vung Shop</Link>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/categories" className="sanpham">Danh mục</Link>
          <Link href="/products" className="sanpham">Sản phẩm</Link>
          <Link href="/login" className="lienhe">Đăng nhập</Link>
          <Link href="/register" className="lienhe">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}