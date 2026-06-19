'use client';

import { useState } from 'react';

interface MenuNgangProps {
  categories: any[];
}

export default function MenuNgang({ categories }: MenuNgangProps) {
  const [showGioiThieu, setShowGioiThieu] = useState(false);
  const [showSanPham, setShowSanPham] = useState(false);

  // Lọc danh mục con của Giới thiệu (parent_id = 82) và Sản phẩm (parent_id = 84)
  const catsGioiThieu = categories.filter((c: any) => c.parent_id === 82);
  const catsSanPham = categories.filter((c: any) => c.parent_id === 84);

  return (
    <div id="wrapmnu" style={{ width: '708px' }}>
      <div id="menugiua">
        <table style={{ width: '708px', height: '72px', border: 0, margin: 0 }} cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <td className="trangchu">
                <a href="/">Trang chủ</a>
              </td>
              <td className="gioithieu" style={{ position: 'relative' }}>
                <a
                  id="ddmenu_parent"
                  href="#"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setShowGioiThieu(true)}
                  onMouseLeave={() => setShowGioiThieu(false)}
                >
                  Giới thiệu
                </a>
                {showGioiThieu && (
                  <table
                    id="ddmenu_child"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      backgroundColor: '#FFFFFF',
                      width: '200px',
                      border: '1px solid #999999',
                      zIndex: 1000,
                    }}
                    cellPadding="0"
                    cellSpacing="0"
                    onMouseEnter={() => setShowGioiThieu(true)}
                    onMouseLeave={() => setShowGioiThieu(false)}
                  >
                    <tbody>
                      {catsGioiThieu.length === 0 ? (
                        <tr>
                          <td className="bgsubmenu100" align="left" style={{ paddingLeft: '10px' }}>
                            Chưa có
                          </td>
                        </tr>
                      ) : (
                        catsGioiThieu.map((cat: any, idx: number) => {
                          const cls =
                            idx === catsGioiThieu.length - 1
                              ? 'bgsubmenu100'
                              : `bgsubmenu${(idx % 8) + 1}`;
                          return (
                            <tr key={cat.id}>
                              <td className={cls} align="left" style={{ paddingLeft: '15px', lineHeight: '30px' }}>
                                <a href={`?sAction=8&cateID=${cat.id}`}>{cat.name}</a>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </td>
              <td className="gioithieu">
                <a href="?sAction=7">Tin tức</a>
              </td>
              <td className="gioithieu" style={{ position: 'relative' }}>
                <a
                  id="menusanpham"
                  href="#"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setShowSanPham(true)}
                  onMouseLeave={() => setShowSanPham(false)}
                >
                  Sản phẩm
                </a>
                {showSanPham && (
                  <table
                    id="ddmenu_sanpham"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      backgroundColor: '#FFFFFF',
                      width: '200px',
                      border: '1px solid #999999',
                      zIndex: 1000,
                    }}
                    cellPadding="0"
                    cellSpacing="0"
                    onMouseEnter={() => setShowSanPham(true)}
                    onMouseLeave={() => setShowSanPham(false)}
                  >
                    <tbody>
                      {catsSanPham.length === 0 ? (
                        <tr>
                          <td className="bgsubmenu100" align="left" style={{ paddingLeft: '10px' }}>
                            Chưa có
                          </td>
                        </tr>
                      ) : (
                        catsSanPham.map((cat: any, idx: number) => {
                          const cls =
                            idx === catsSanPham.length - 1
                              ? 'bgsubmenu100'
                              : `bgsubmenu${(idx % 8) + 1}`;
                          return (
                            <tr key={cat.id}>
                              <td className={cls} align="left" style={{ paddingLeft: '15px', lineHeight: '30px' }}>
                                <a href={`?sAction=10&cateID=${cat.id}`}>{cat.name}</a>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </td>
              <td className="gioithieu">
                <a href="/online/" target="_blank">
                  Mua hàng
                </a>
              </td>
              <td align="center">
                <a href="?sAction=6">Liên hệ</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}