'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Loc Vung Shop</Link>
        <div className="space-x-4">
          <Link href="/categories">Danh mục</Link>
          <Link href="/products">Sản phẩm</Link>
          <Link href="/login">Đăng nhập</Link>
          <Link href="/register">Đăng ký</Link>
        </div>
      </div>
    </nav>
  );
}