import { promises as fs } from "fs";
import path from "path";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

async function getProducts(): Promise<Product[]> {
  const dataPath = path.join(process.cwd(), "legacy", "data", "products.json");
  const jsonData = await fs.readFile(dataPath, "utf8");
  const data = JSON.parse(jsonData);
  return data.products || data; // Handle different json root structures
}

export default async function StorePage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (e) {
    console.error("Failed to load products:", e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Our Products
        </h1>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {/* Filtering UI would go here */}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
