import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCartButton } from "@/components/AddToCartButton";

export default function Store() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">All Products</h1>
        <p className="text-lg text-slate-500">
          Browse our complete collection of premium tech products.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col group border-none shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center p-4">
              {/* Image placeholder */}
              <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <span className="text-slate-400 font-medium text-sm">Image</span>
              </div>
            </div>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start mb-1">
                <div className="text-xs font-medium text-slate-500">{product.category}</div>
                <div className="font-bold" style={{ color: siteConfig.theme.primary }}>
                  {siteConfig.currency}{product.price.toFixed(2)}
                </div>
              </div>
              <CardTitle className="text-lg leading-tight line-clamp-1">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-grow">
              <p className="text-slate-500 text-xs line-clamp-2">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <AddToCartButton product={product} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
