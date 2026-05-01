import Link from "next/link";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white flex items-center min-h-[520px]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: siteConfig.theme.primary }}></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: siteConfig.theme.primary }}></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 py-12">
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Elevate Your <span style={{ color: siteConfig.theme.primary }}>Tech</span> Experience
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/store">
                <Button size="lg" className="font-bold text-slate-900" style={{ backgroundColor: siteConfig.theme.primary }}>
                  Shop Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center items-center relative min-h-[340px]">
            <div className="relative w-full max-w-[340px] aspect-square rounded-2xl flex items-center justify-center p-8">
              {/* Add an illustrative tech shape or placeholder if no image */}
              <div className="absolute inset-0 rounded-full opacity-10" style={{ backgroundColor: siteConfig.theme.primary }}></div>
              <div className="absolute inset-4 rounded-full opacity-15" style={{ backgroundColor: siteConfig.theme.primary }}></div>
              <div className="absolute inset-8 rounded-full opacity-20" style={{ backgroundColor: siteConfig.theme.primary }}></div>
              <div className="relative z-10 w-full h-full bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center p-6">
                 <h3 className="text-2xl font-bold mb-2">Premium Tech</h3>
                 <p className="text-sm text-slate-400">Discover our collection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Products</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Check out our most popular items chosen just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col group border-none shadow-md hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center p-6">
                  {/* Image placeholder */}
                  <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <span className="text-slate-400 font-medium">Product Image</span>
                  </div>
                  <Badge className="absolute top-4 right-4" style={{ backgroundColor: siteConfig.theme.primary, color: '#0f2027' }}>
                    Featured
                  </Badge>
                </div>
                <CardHeader className="p-6 pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-slate-500 mb-1">{product.category}</div>
                    <div className="font-bold text-lg" style={{ color: siteConfig.theme.primary }}>
                      {siteConfig.currency}{product.price.toFixed(2)}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight line-clamp-1">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 flex-grow">
                  <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full font-semibold group-hover:bg-slate-800 transition-colors">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/store">
              <Button size="lg" variant="outline" className="font-bold">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
