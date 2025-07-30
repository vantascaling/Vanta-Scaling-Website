# Vanta Scaling - Luxury Brand Scaling Agency Website

A premium, full-stack website for Vanta Scaling, featuring an ultra-modern, jet-black design with complete frontend and backend functionality.

## Features

- **Ultra-Luxury Design**: Jet-black, modern interface inspired by Apple, Balenciaga, and Tesla
- **Full-Stack Implementation**: Complete frontend and backend with database integration
- **Payment Processing**: Stripe integration for Trial Surge package purchases
- **Form Handling**: Working contact and scheduling forms with email notifications
- **Database**: SQLite for storing contacts, appointments, and purchases
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Premium animations and interactions throughout

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Payment**: Stripe API
- **Email**: Nodemailer
- **Styling**: Custom CSS with CSS Variables

## Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd vanta-scaling-luxury
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and update with your credentials:
   ```env
   # Server Configuration
   PORT=3000

   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=your_webhook_secret_here

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   ADMIN_EMAIL=admin@vantascaling.com
   ```

5. Update the Stripe publishable key in `/public/js/plans.js`:
   ```javascript
   const stripe = Stripe('your_stripe_publishable_key_here');
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
vanta-scaling-luxury/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── vanta_luxury.db        # SQLite database (auto-created)
└── public/                # Frontend files
    ├── index.html         # Homepage
    ├── plans.html         # Pricing plans
    ├── schedule.html      # Schedule a call form
    ├── contact.html       # Contact form
    ├── about.html         # About page
    ├── success.html       # Payment success page
    ├── css/               # Stylesheets
    │   ├── styles.css     # Main styles
    │   ├── plans.css      # Plans page styles
    │   ├── forms.css      # Form styles
    │   ├── about.css      # About page styles
    │   └── success.css    # Success page styles
    └── js/                # JavaScript files
        ├── main.js        # Main functionality
        ├── plans.js       # Plans/Stripe integration
        ├── schedule.js    # Schedule form handling
        ├── contact.js     # Contact form handling
        ├── about.js       # About page animations
        └── success.js     # Success page effects
```

## Setting Up Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add your keys to the `.env` file
4. Set up a webhook endpoint in Stripe pointing to: `http://yourdomain.com/api/webhook`
5. Add the webhook secret to your `.env` file

## Setting Up Email

1. For Gmail:
   - Enable 2-factor authentication
   - Generate an app-specific password
   - Use this password in the `.env` file

2. For other email providers:
   - Update the transporter configuration in `server.js`

## Database

The SQLite database is automatically created when you first run the server. It includes tables for:
- `contacts` - Contact form submissions
- `appointments` - Scheduled calls
- `purchases` - Stripe purchases

## API Endpoints

- `POST /api/contact` - Submit contact form
- `POST /api/schedule` - Schedule a call
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhook` - Stripe webhook handler
- `GET /api/admin/contacts` - View all contacts (protect in production)
- `GET /api/admin/appointments` - View all appointments (protect in production)
- `GET /api/admin/purchases` - View all purchases (protect in production)

## Deployment

For production deployment:

1. Set up environment variables on your hosting platform
2. Use HTTPS for secure payments
3. Protect admin endpoints with authentication
4. Set up proper CORS policies
5. Configure Stripe webhooks with your production URL

## Security Notes

- Always use environment variables for sensitive data
- Implement authentication for admin endpoints
- Use HTTPS in production
- Validate and sanitize all user inputs
- Keep dependencies updated

## Support

For issues or questions about the Vanta Scaling website, please contact the development team.

---

Built with ❤️ for Vanta Scaling by Beni Misenti
