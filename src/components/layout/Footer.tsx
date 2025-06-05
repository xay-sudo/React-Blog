export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BloggerVerse. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Crafted with <span className="text-accent">&hearts;</span> by Your Name/Company
        </p>
      </div>
    </footer>
  );
}
