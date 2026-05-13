export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image_url: string;
  stock_status: 'in_stock' | 'out_of_stock';
  features?: string[];
}

export interface StoreSettings {
  store_name: string;
  contact_email: string;
  whatsapp_number: string;
  theme_colors: {
    primary: string;
    secondary: string;
  };
  testimonials: Array<{
    author: string;
    quote: string;
    rating: number;
  }>;
}

export interface CartItem extends Product {
  quantity: number;
}
