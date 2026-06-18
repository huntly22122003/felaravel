'use client';

interface MenuNgangProps {
  categories: any[];
}

export default function MenuNgang({ categories }: MenuNgangProps) {
  // Lấy danh mục cha có is_home = true (giống code cũ)
  const homeCats = categories.filter((c: any) => c.is_home === true && c.parent_id === null);

  return (
    <div style={{
      display: 'flex',
      gap: '25px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#995727',
      alignItems: 'center',
      height: '40px'
    }}>
      <a href="/" className="trangchu" style={{ color: '#995727', textDecoration: 'none' }}>Trang chủ</a>
      {homeCats.length > 0 ? (
        homeCats.map((cat: any) => (
          <a key={cat.id} href={`?sAction=9&cateID=${cat.id}`} className="sanpham" style={{ color: '#995727', textDecoration: 'none' }}>
            {cat.name}
          </a>
        ))
      ) : (
        <>
          <a href="?sAction=9" className="sanpham" style={{ color: '#995727', textDecoration: 'none' }}>Sản phẩm</a>
          <a href="?sAction=7" className="tintuc" style={{ color: '#995727', textDecoration: 'none' }}>Tin tức</a>
          <a href="?sAction=8" className="gioithieu" style={{ color: '#995727', textDecoration: 'none' }}>Giới thiệu</a>
        </>
      )}
      <a href="?sAction=6" className="lienhe" style={{ color: '#995727', textDecoration: 'none' }}>Liên hệ</a>
      <a href="?sAction=16" className="giohang" style={{ color: '#995727', textDecoration: 'none' }}>Giỏ hàng</a>
    </div>
  );
}