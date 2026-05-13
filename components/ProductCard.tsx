"use client";

import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="aspect-w-4 aspect-h-3 bg-gray-200 overflow-hidden">
        {/* We use a standard img tag here because we don't have Next.js image domain configuration for these arbitrary URLs yet */}
        <img
          src={product.image_url || "https://placehold.co/600x400?text=No+Image"}
          alt={product.name}
          className="w-full h-48 object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg font-bold text-gray-900">
            {product.currency} {product.price.toFixed(2)}
          </p>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock_status === "out_of_stock"}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors
              ${
                product.stock_status === "out_of_stock"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {product.stock_status === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
