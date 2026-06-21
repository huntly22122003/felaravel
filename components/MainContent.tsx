'use client';

interface MainContentProps {
  products: any[];
  banners: any[];
  posts: any[];
}

export default function MainContent({ products, banners, posts }: MainContentProps) {
  const newProducts = products.slice(0, 4);

  const renderNewProducts = () => {
    if (newProducts.length === 0) {
      return <div>Chưa có sản phẩm</div>;
    }
    return newProducts.map((p: any) => (
      <div key={p.id} style={{ display: 'inline-block', margin: '10px', width: '150px', verticalAlign: 'top' }}>
        <a href={`?sAction=9&procID=${p.id}`}>
          <img src={p.thumbnail || '/images/no-image.png'} alt={p.name} style={{ width: '150px', height: '150px', border: '1px solid #ddd' }} />
        </a>
        <br />
        <a href={`?sAction=9&procID=${p.id}`} className="title_black">{p.name}</a>
        <br />
        <span style={{ color: 'red' }}>{p.price?.toLocaleString()} VND</span>
      </div>
    ));
  };

  return (
    <div style={{ width: '100%' }}>
      <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>
              {/* Slider lớn */}
              <div style={{ width: '100%', textAlign: 'center' }}>
                {banners.length > 0 ? (
                  <img src={banners[0].image_path || '/images/no-image.png'} alt={banners[0].title} style={{ width: '100%', maxHeight: '308px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '308px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chưa có banner</div>
                )}
              </div>
            </td>
            <td style={{ width: '128px', background: "url('/images/nen-qc-phai.jpg')", textAlign: 'center' }}>
              <div style={{ padding: '10px' }}>
                {banners.slice(1, 4).map((b: any) => (
                  <div key={b.id} style={{ marginBottom: '10px' }}>
                    <img src={b.image_path || '/images/no-image.png'} alt={b.title} style={{ width: '110px' }} />
                  </div>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: '364px', height: '333px', background: "url('/images/nengocnghenhan.jpg')", textAlign: 'center', verticalAlign: 'top' }}>
              <div style={{ height: '55px' }}></div>
              {posts.length > 0 && (
                <div style={{ padding: '10px', textAlign: 'left' }}>
                  <h3>Tin tức mới</h3>
                  <ul>
                    {posts.slice(0, 3).map((p: any) => (
                      <li key={p.id}><a href={`?sAction=7&newsID=${p.id}`}>{p.title}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </td>
            <td style={{ width: '347px', height: '333px', background: "url('/images/nenqcduoi.jpg')", textAlign: 'center' }}>
              <div style={{ padding: '10px' }}>
                {banners.slice(4, 6).map((b: any) => (
                  <div key={b.id} style={{ marginBottom: '10px' }}>
                    <img src={b.image_path || '/images/no-image.png'} alt={b.title} style={{ width: '100%' }} />
                  </div>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}