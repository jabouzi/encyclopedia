export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>
        <strong>موسوعة الأسرة المسلمة</strong>
      </p>
      <p>محتوى مستعاد من أرشيف الإنترنت (2010)</p>
      <div className="footer-copyright">
        <p>&copy; {currentYear} جميع الحقوق محفوظة</p>
      </div>
    </footer>
  )
}
