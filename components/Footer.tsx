'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>ANH <span>QUÂN</span></div>
          <p className={styles.footerDesc}>Mang thiên nhiên vào không gian sống</p>
        </div>

        <div className={styles.footerCenter}>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Giới thiệu</a>
            <a href="#" className={styles.footerLink}>Sản phẩm</a>
            <a href="#" className={styles.footerLink}>Tin tức</a>
            <a href="#" className={styles.footerLink}>Liên hệ</a>
          </div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Chính sách bảo mật</a>
            <a href="#" className={styles.footerLink}>Điều khoản sử dụng</a>
            <a href="#" className={styles.footerLink}>Hỗ trợ</a>
          </div>
        </div>

        <div className={styles.footerRight}>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>📱</a>
            <a href="#" className={styles.socialLink}>📘</a>
            <a href="#" className={styles.socialLink}>📸</a>
            <a href="#" className={styles.socialLink}>🎥</a>
          </div>
          <div className={styles.footerCopyright}>
            © {currentYear} Trung Tâm Cây Cảnh Anh Quân
          </div>
        </div>
      </div>
    </footer>
  );
}