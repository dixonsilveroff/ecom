"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Button 
      className="w-full font-semibold group-hover:bg-slate-800 transition-colors"
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </Button>
  );
}
