'use client';

interface MenuTraiProps {
  categories: any[];
}

export default function MenuTrai({ categories }: MenuTraiProps) {
  if (categories.length === 0) {
    return (
      <div style={{ width: '196px' }}>
        <div className="leftmenubg1" style={{ paddingLeft: '15px', lineHeight: '34px', fontWeight: 'bold', color: '#995727' }}>
          Danh mục
        </div>
        <div className="leftmenubg2" style={{ paddingLeft: '15px', lineHeight: '37px' }}>
          Chưa có danh mục
        </div>
      </div>
    );
  }

  // Lấy danh mục cha (parent_id = null) để hiển thị
  const rootCats = categories.filter((c: any) => c.parent_id === null);

  return (
    <div style={{ width: '196px' }}>
      <div className="leftmenubg1" style={{ paddingLeft: '15px', lineHeight: '34px', fontWeight: 'bold', color: '#995727' }}>
        Danh mục
      </div>
      {rootCats.map((cat: any) => (
        <div key={cat.id} className="leftmenubg2" style={{ paddingLeft: '15px', lineHeight: '37px' }}>
          <a href={`?sAction=9&cateID=${cat.id}`} style={{ color: '#995727', textDecoration: 'none' }}>
            {cat.name}
          </a>
        </div>
      ))}
    </div>
  );
}