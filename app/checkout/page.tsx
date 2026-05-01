"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  const shipping = cart.length > 0 ? 10.00 : 0;
  const tax = cartTotal * 0.08; // 8% tax rate
  const total = cartTotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-center md:text-left">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="border-none shadow-md mb-8">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Address</label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="city" className="text-sm font-medium">City</label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-sm font-medium">Zip Code</label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-500 text-sm border border-dashed border-slate-200">
                Payment integration (e.g. Stripe) would go here.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="border-none shadow-md sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center p-6 text-sm text-slate-500 bg-slate-50 rounded-lg mb-4">
                  Your cart is currently empty.
                </div>
              ) : (
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-md flex-shrink-0 flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">IMG</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                          <div className="text-xs text-slate-500" style={{ color: siteConfig.theme.primary }}>
                            {siteConfig.currency}{item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 border rounded-md px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">{siteConfig.currency}{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium">{siteConfig.currency}{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-medium">{siteConfig.currency}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-slate-100">
                  <span>Total</span>
                  <span style={{ color: siteConfig.theme.primary }}>{siteConfig.currency}{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full font-bold" 
                size="lg" 
                disabled={cart.length === 0} 
                style={{ 
                  backgroundColor: cart.length > 0 ? siteConfig.theme.primary : undefined,
                  opacity: cart.length > 0 ? 1 : 0.5,
                  color: cart.length > 0 ? '#0f2027' : undefined
                }}
              >
                Complete Purchase
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
