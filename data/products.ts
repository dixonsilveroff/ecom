export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Premium Wireless Headphones",
    description: "High-fidelity audio with active noise cancellation.",
    price: 299.99,
    category: "Audio",
    image: "/placeholder.svg", // Replace with real images
    featured: true,
  },
  {
    id: "prod-2",
    name: "Ultra-Thin Smart Laptop",
    description: "Powerful performance in a sleek, ultra-thin aluminum body.",
    price: 1299.00,
    category: "Laptops",
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: "prod-3",
    name: "Next-Gen Smartphone",
    description: "Pro-grade camera system and all-day battery life.",
    price: 899.00,
    category: "Smartphones",
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: "prod-4",
    name: "4K Action Camera",
    description: "Waterproof action camera with 4K recording capabilities.",
    price: 249.50,
    category: "Cameras",
    image: "/placeholder.svg",
    featured: false,
  },
];
