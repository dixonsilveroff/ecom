# TechStore - JAMStack E-commerce Website

A complete, modern e-commerce website built with vanilla HTML, CSS, and JavaScript. Features a responsive design, shopping cart functionality, product filtering, and multiple order processing options.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Product Catalog**: Dynamic product loading with search and filtering
- **Shopping Cart**: Persistent cart using localStorage
- **Multiple Order Methods**: WhatsApp and EmailJS integration
- **Dynamic Branding**: Customizable store settings via JSON
- **Product Management**: Easy product updates through JSON files
- **Contact Forms**: Integrated contact and support forms
- **Cross-browser Compatible**: Works on all modern browsers

## 📁 Project Structure

```
ecom/
├── index.html                 # Homepage
├── pages/
│   ├── store.html            # Product catalog
│   ├── checkout.html         # Order form
│   ├── contact.html          # Contact page
│   └── thank-you.html        # Order confirmation
├── data/
│   ├── settings.json         # Store configuration
│   ├── products.json         # Product database
│   └── testimonials.json     # Customer reviews
├── scripts/
│   ├── branding.js           # Store branding & navigation
│   ├── cart.js               # Shopping cart functionality
│   ├── filtering.js          # Product search & filters
│   ├── whatsapp.js           # WhatsApp integration
│   └── emailjs-config.js     # EmailJS configuration
├── css/
│   ├── style.css             # Global styles
│   ├── store.css             # Store page styles
│   └── checkout.css          # Checkout & forms
└── assets/
    └── images/               # Product images
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- A modern web browser
- A local web server (for development)
- EmailJS account (for email functionality)
- WhatsApp Business number (for WhatsApp orders)

### 2. Local Development Setup

#### Option A: Using Python (Recommended)
```bash
# Navigate to project directory
cd ecom

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project directory
cd ecom

# Start server
http-server -p 8000
```

#### Option C: Using Live Server (VS Code)
1. Install Live Server extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 3. Configuration

#### Store Settings (`data/settings.json`)
Update the store information:
```json
{
  "store": {
    "name": "Your Store Name",
    "tagline": "Your Store Tagline"
  },
  "contact": {
    "email": "your@email.com",
    "phone": "+1234567890",
    "whatsapp": "+1234567890"
  }
}
```

#### EmailJS Setup (`scripts/emailjs-config.js`)
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create email templates for:
   - Contact form
   - Order processing
   - Order confirmation
3. Update the configuration:
```javascript
this.serviceId = 'your_service_id';
this.templateId = 'your_template_id';
this.userId = 'your_user_id';
```

#### WhatsApp Integration (`scripts/whatsapp.js`)
Update the phone number:
```javascript
this.phoneNumber = '+1234567890'; // Your WhatsApp number
```

### 4. Customization

#### Adding Products
Edit `data/products.json` to add new products:
```json
{
  "id": "product-id",
  "name": "Product Name",
  "category": "category-name",
  "price": 99.99,
  "description": "Product description",
  "image": "📱",
  "featured": true
}
```

#### Styling
- Global styles: `css/style.css`
- Store page: `css/store.css`
- Checkout/forms: `css/checkout.css`

#### Branding
- Store name and colors in `data/settings.json`
- Logo and favicon in HTML files
- Custom CSS variables for consistent theming

## 🌐 Deployment

### Netlify (Recommended)
1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy automatically

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Select source branch
3. Deploy automatically

### Traditional Hosting
1. Upload all files to web server
2. Ensure `.htaccess` supports SPA routing
3. Test all functionality

## 🔧 Configuration Options

### Store Features
- **Categories**: smartphones, laptops, tablets, accessories, gaming
- **Price Ranges**: 0-100, 100-500, 500-1000, 1000+
- **Sorting**: Name, Price (low/high), Rating
- **Shipping**: Free over $50, $5.99 standard

### Order Processing
- **WhatsApp**: Direct order via WhatsApp
- **EmailJS**: Background email processing
- **Cart Persistence**: localStorage-based cart
- **Order Numbers**: Auto-generated unique IDs

### Responsive Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🧪 Testing

### Local Testing
1. Start local server
2. Test all pages and functionality
3. Test responsive design
4. Test cart functionality
5. Test form submissions

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Testing
- Test on actual devices
- Test touch interactions
- Verify responsive behavior

## 🚨 Troubleshooting

### Common Issues

#### Products Not Loading
- Check browser console for errors
- Verify `data/products.json` syntax
- Ensure local server is running

#### Cart Not Working
- Check localStorage in browser dev tools
- Verify JavaScript console for errors
- Clear browser cache and cookies

#### Forms Not Submitting
- Check EmailJS configuration
- Verify template IDs and service IDs
- Test EmailJS connection

#### WhatsApp Not Working
- Verify phone number format
- Test WhatsApp link manually
- Check browser popup blockers

### Debug Mode
Enable debug logging in browser console:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## 📱 Mobile Optimization

- Touch-friendly buttons and forms
- Optimized images and icons
- Responsive navigation
- Mobile-first CSS approach
- Fast loading on mobile networks

## 🔒 Security Considerations

- No sensitive data stored in localStorage
- Form validation on client and server side
- HTTPS recommended for production
- Input sanitization for user data
- Secure API endpoints (when implemented)

## 🚀 Performance Tips

- Optimize images and assets
- Minify CSS and JavaScript for production
- Use CDN for external libraries
- Implement lazy loading for products
- Cache static assets

## 📞 Support

For issues and questions:
- Check browser console for errors
- Review configuration files
- Test with minimal setup
- Check EmailJS and WhatsApp integration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] User accounts and authentication
- [ ] Order tracking system
- [ ] Inventory management
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Advanced filtering options

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**