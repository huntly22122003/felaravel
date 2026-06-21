'use client';

interface MenuTraiProps {
  categories: any[];
}

export default function MenuTrai({ categories }: MenuTraiProps) {
  const rootCats = categories.filter((c: any) => c.parent_id === null && c.is_home === true);

  const renderLeftMenu = () => {
    if (rootCats.length === 0) {
      return (
        <table cellPadding={0} cellSpacing={0} border={0}>
          <tbody>
            <tr><td align="left" className="leftmenubg100">
              <a href="#" className="mainlevel_active">Chưa có danh mục</a>
            </td></tr>
          </tbody>
        </table>
      );
    }
    return (
      <table cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          {rootCats.map((cat: any, idx: number) => {
            const cls = idx === rootCats.length - 1 ? 'leftmenubg100' : `leftmenubg${(idx % 7) + 1}`;
            return (
              <tr key={cat.id}>
                <td align="left" className={cls}>
                  <a href={`?sAction=9&cateID=${cat.id}`} className="mainlevel_active">
                    {cat.name}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ width: '196px' }}>
      <table cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr><td valign="top">
            <table cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr><td className="frmshearch">
                  <form style={{ margin: 0 }} name="frmsearch" method="post" action="?sAction=14">
                    <table cellPadding={0} cellSpacing={0} border={0}>
                      <tbody>
                        <tr><td style={{ width: '140px', height: '22px' }}>&nbsp;</td><td></td></tr>
                        <tr>
                          <td style={{ width: '140px' }} align="right">
                            <input style={{ width: '110px' }} id="txtsearch" name="txtsearch" size={16} className="timkiemfont" />
                          </td>
                          <td align="right">
                            <input
                              type="image"
                              src="/images/nuttimkiem.jpg"
                              alt="Tìm kiếm"
                              style={{ border: 0 }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                </td></tr>
              </tbody>
            </table>
          </td></tr>
          <tr><td>
            <div id="wrap"><div id="menu">
              {renderLeftMenu()}
            </div></div>
          </td></tr>
          <tr>
            <td style={{ background: "url('/images/nensanphammoi.jpg')", height: '333px', textAlign: 'center' }}>
              <div style={{ padding: '10px' }}>
                <img src="/images/sanphammoi_quangcaophai.jpg" alt="QC" style={{ width: '157px', height: '243px' }} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}