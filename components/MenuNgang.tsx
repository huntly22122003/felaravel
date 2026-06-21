'use client';

import { useState } from 'react';

interface MenuNgangProps {
  categories: any[];
}

export default function MenuNgang({ categories }: MenuNgangProps) {
  const [hoverGioiThieu, setHoverGioiThieu] = useState(false);
  const [hoverSanPham, setHoverSanPham] = useState(false);

  const catsGioiThieu = categories.filter((c: any) => c.parent_id === 82);
  const catsSanPham = categories.filter((c: any) => c.parent_id === 84);

  const renderDropdown = (items: any[], baseAction: string) => {
    if (items.length === 0) return null;
    return (
      <table
        border={0}
        style={{
          position: 'absolute',
          visibility: 'visible',
          backgroundColor: '#FFFFFF',
          width: '200px',
          top: '100%',
          left: 0,
          zIndex: 1000,
          border: '1px solid #999999',
        }}
        cellPadding={0}
        cellSpacing={0}
      >
        <tbody>
          {items.map((cat: any, idx: number) => {
            const cls = idx === items.length - 1 ? 'bgsubmenu100' : `bgsubmenu${(idx % 8) + 1}`;
            return (
              <tr key={cat.id}>
                <td align="left" className={cls}>
                  <a href={`?sAction=${baseAction}&cateID=${cat.id}`}>&nbsp;&nbsp;&nbsp;{cat.name}</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div id="wrapmnu" style={{ width: '708px' }}>
      <div id="menugiua">
        <table cellPadding="0" cellSpacing="0" style={{ height: '72px', width: '708px', border: 0 }}>
          <tbody>
            <tr>
              <td className="trangchu"><a href="/">Trang chủ</a></td>
              <td
                className="gioithieu"
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoverGioiThieu(true)}
                onMouseLeave={() => setHoverGioiThieu(false)}
              >
                <a id="ddmenu_parent" href="#" style={{ cursor: 'pointer' }}>Giới thiệu</a>
                {hoverGioiThieu && renderDropdown(catsGioiThieu, '8')}
              </td>
              <td className="gioithieu"><a href="?sAction=7">Tin tức</a></td>
              <td
                className="gioithieu"
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoverSanPham(true)}
                onMouseLeave={() => setHoverSanPham(false)}
              >
                <a id="menusanpham" href="#" style={{ cursor: 'pointer' }}>Sản phẩm</a>
                {hoverSanPham && renderDropdown(catsSanPham, '10')}
              </td>
              <td className="gioithieu"><a href="/online/" target="_blank">Mua hàng</a></td>
              <td align="center"><a href="?sAction=6">Liên hệ</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}