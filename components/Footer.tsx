import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 mx-auto px-4 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold" style={{ color: siteConfig.theme.primary }}>{siteConfig.name}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {siteConfig.description}
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/store" className="hover:underline">Store</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="font-semibold">Contact Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📧 {siteConfig.contact.email}</li>
              <li>📱 {siteConfig.contact.phone}</li>
              <li>📍 {siteConfig.contact.address}</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
