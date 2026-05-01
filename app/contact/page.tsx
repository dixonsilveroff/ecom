"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitContactForm } from "@/app/actions/contact";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Have a question or need assistance? We're here to help. Fill out the form below or reach out to us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <Card className="border-none shadow-md h-full">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                We typically respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center font-medium">
                  Thanks for reaching out! We'll get back to you soon.
                </div>
              ) : (
                <form action={handleSubmit} className="space-y-4">
                  {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" name="name" required placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" name="email" type="email" required placeholder="Your email address" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" name="subject" placeholder="What is this regarding?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea id="message" name="message" required placeholder="How can we help you?" rows={5} />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-bold" 
                    disabled={isSubmitting}
                    style={{ backgroundColor: siteConfig.theme.primary, color: '#0f2027' }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-8 justify-center">
          <div className="flex items-start space-x-4">
            <div className="bg-slate-100 p-3 rounded-full text-2xl">
              📍
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Our Location</h3>
              <p className="text-slate-500">{siteConfig.contact.address}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-slate-100 p-3 rounded-full text-2xl">
              📧
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Email Us</h3>
              <p className="text-slate-500">{siteConfig.contact.email}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-slate-100 p-3 rounded-full text-2xl">
              📱
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Call Us</h3>
              <p className="text-slate-500">{siteConfig.contact.phone}</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Business Hours</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex justify-between"><span>Monday - Friday:</span> <span>9:00 AM - 6:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 4:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
