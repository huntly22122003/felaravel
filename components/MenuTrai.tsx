'use client';

interface MenuTraiProps {
  categories: any[];
}

export default function MenuTrai({ categories }: MenuTraiProps) {
  // Lấy danh mục cha (parent_id = null) và is_home = true
  const rootCats = categories.filter((c: any) => c.parent_id === null && c.is_home === true);

  return (
    <div style={{ width: '196px' }}>
      {/* Form tìm kiếm */}
      <div className="frmshearch" style={{ width: '196px', height: '51px' }}>
        <form style={{ margin: 0 }} name="frmsearch" method="post" action="?sAction=14">
          <table cellPadding="0" cellSpacing="0" border="0">
            <tbody>
              <tr>
                <td style={{ width: '140px', height: '22px' }}>&nbsp;</td>
                <td></td>
              </tr>
              <tr>
                <td style={{ width: '140px' }} align="right">
                  <input
                    style={{ width: '110px' }}
                    id="txtsearch"
                    name="txtsearch"
                    size={16}
                    className="timkiemfont"
                  />
                </td>
                <td align="right">
                  <input type="image" src="/images/nuttimkiem.jpg" border={0} alt="Tìm kiếm" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      {/* Menu danh mục (Begin menu) */}
      <div id="wrap">
        <div id="menu">
          <table cellPadding="0" cellSpacing="0" border={0}>
            <tbody>
              {rootCats.length === 0 ? (
                <tr>
                  <td className="leftmenubg100" align="left">
                    <a href="#" className="mainlevel_active">
                      Chưa có danh mục
                    </a>
                  </td>
                </tr>
              ) : (
                rootCats.map((cat: any, idx: number) => {
                  const cls = idx === rootCats.length - 1 ? 'leftmenubg100' : `leftmenubg${(idx % 7) + 1}`;
                  return (
                    <tr key={cat.id}>
                      <td className={cls} align="left">
                        <a href={`?sAction=9&cateID=${cat.id}`} className="mainlevel_active">
                          {cat.name}
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}