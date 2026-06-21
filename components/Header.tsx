'use client';

import MenuNgang from './MenuNgang';

interface HeaderProps {
  categories: any[];
}

export default function Header({ categories }: HeaderProps) {
  return (
    <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: 0 }}>
      <tbody>
        <tr>
          <td style={{ background: "url('/images/bgbanner.gif')", textAlign: 'center' }}>
            <table style={{ width: '914px', height: '207px', border: 0, margin: '0 auto' }} cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td className="header" valign="top" align="left" style={{ width: '914px' }}>
                    <table style={{ height: '207px', border: 0, margin: '0 auto' }} cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ width: '206px', height: '133px' }} valign="top"></td>
                          <td align="left" valign="top">
                            <img src="/images/bannerphai.jpg" alt="Banner" style={{ width: '709px', height: '133px' }} />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: '206px' }}>&nbsp;</td>
                          <td align="left">
                            <MenuNgang categories={categories} />
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