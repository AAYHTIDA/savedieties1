const Footer = () => {
  return (
    <footer className="bg-dark-bg py-8 border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-primary-foreground/60 text-sm">
          © {new Date().getFullYear()} Save Deities - Saketham Hindu Litigants Trust. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
