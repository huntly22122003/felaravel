'use client';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: 0 }}>
      <tbody>
        <tr>
          <td style={{ background: "url('/images/bgbanner.gif')", textAlign: 'center' }}>
            {/* Sử dụng margin: 0 auto để căn giữa table bên trong */}
            <table style={{ width: '914px', height: '207px', border: 0, margin: '0 auto' }} cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td className="header" valign="top" align="left">
                    <table style={{ height: '207px', border: 0, margin: '0 auto' }} cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ width: '206px', height: '133px' }} valign="top"></td>
                          <td align="left" valign="top">
                            <img src="/images/banner.jpg" alt="Banner" style={{ width: '709px', height: '133px' }} />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: '206px' }}>&nbsp;</td>
                          <td align="left" style={{ paddingLeft: '10px' }}>
                            {children}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}