'use client';

interface MainContentProps {
  products: any[];
  banners: any[];
}

export default function MainContent({ products, banners }: MainContentProps) {
  const newProducts = products.slice(0, 4);

  return (
    <div style={{ width: '100%' }}>
      <div className="nentitle" style={{ paddingLeft: '15px', lineHeight: '36px' }}>
        SẢN PHẨM MỚI
      </div>
      <div style={{ padding: '10px' }}>
        {newProducts.length === 0 ? (
          <div>Chưa có sản phẩm</div>
        ) : (
          newProducts.map((p: any) => (
            <div key={p.id} style={{ display: 'inline-block', margin: '10px', width: '150px', verticalAlign: 'top' }}>
              <a href={`?sAction=9&procID=${p.id}`}>
                <img src={p.thumbnail || '/images/no-image.png'} alt={p.name} style={{ width: '150px', height: '150px', border: '1px solid #ddd' }} />
              </a>
              <br />
              <a href={`?sAction=9&procID=${p.id}`} className="title_black">{p.name}</a>
              <br />
              <span style={{ color: 'red' }}>{p.price?.toLocaleString()} VND</span>
            </div>
          ))
        )}
      </div>

      <div className="nentitle" style={{ paddingLeft: '15px', lineHeight: '36px', marginTop: '20px' }}>
        BANNER
      </div>
      <div style={{ padding: '10px' }}>
        {banners.length === 0 ? (
          <div>Chưa có banner</div>
        ) : (
          banners.slice(0, 3).map((b: any) => (
            <div key={b.id} style={{ display: 'inline-block', margin: '10px', width: '200px' }}>
              <img src={b.image_path || '/images/no-image.png'} alt={b.title} style={{ width: '100%', border: '1px solid #ddd' }} />
              <p style={{ textAlign: 'center' }}>{b.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}