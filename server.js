const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('./vanta_luxury.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create tables
function initializeDatabase() {
  // Contacts table
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      website TEXT,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Purchases table
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stripe_session_id TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      amount INTEGER NOT NULL,
      plan_name TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1399883501272305766/aOsYz5I5Lv5FFl3uDQRvYwoU9IxFlIkPsZps12Mi7zDCTUrOQ6oT8uLFSs7kWRnFxlGe';

// Function to send Discord webhook
async function sendDiscordNotification(embed) {
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });
    
    if (!response.ok) {
      console.error('Discord webhook error:', response.status);
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}

// Routes

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    function(err) {
      if (err) {
        console.error('Error saving contact:', err);
        return res.status(500).json({ error: 'Failed to save contact' });
      }

      // Send Discord notification
      const discordEmbed = {
        title: '📬 New Contact Form Submission',
        color: 0x00d4ff, // Vanta blue color
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: '👤 Name',
            value: name,
            inline: true
          },
          {
            name: '📧 Email',
            value: email,
            inline: true
          },
          {
            name: '💬 Message',
            value: message.length > 1024 ? message.substring(0, 1021) + '...' : message,
            inline: false
          }
        ],
        footer: {
          text: 'Vanta Scaling Contact Form'
        }
      };

      sendDiscordNotification(discordEmbed);

      // Send notification email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@vantascaling.com',
        subject: 'New Contact Form Submission - Vanta Scaling',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) console.log('Email error:', error);
      });

      res.json({ 
        success: true, 
        message: 'Thank you for contacting us. We\'ll respond within 24 hours.' 
      });
    }
  );
});

// Schedule appointment
app.post('/api/schedule', (req, res) => {
  const { name, email, website, preferredDate, preferredTime, notes } = req.body;

  if (!name || !email || !preferredDate || !preferredTime) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  db.run(
    `INSERT INTO appointments (name, email, website, preferred_date, preferred_time, notes) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, website, preferredDate, preferredTime, notes],
    function(err) {
      if (err) {
        console.error('Error saving appointment:', err);
        return res.status(500).json({ error: 'Failed to schedule appointment' });
      }

      // Send Discord notification
      const discordEmbed = {
        title: '📅 New Strategy Call Scheduled',
        color: 0x00d4ff, // Vanta blue color
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: '👤 Name',
            value: name,
            inline: true
          },
          {
            name: '📧 Email',
            value: email,
            inline: true
          },
          {
            name: '🌐 Website',
            value: website || 'Not provided',
            inline: true
          },
          {
            name: '📆 Date',
            value: preferredDate,
            inline: true
          },
          {
            name: '🕐 Time',
            value: preferredTime,
            inline: true
          },
          {
            name: '📝 Notes',
            value: notes || 'No additional notes',
            inline: false
          }
        ],
        footer: {
          text: 'Vanta Scaling Strategy Call'
        }
      };

      sendDiscordNotification(discordEmbed);

      // Send notification email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@vantascaling.com',
        subject: 'New Strategy Call Scheduled - Vanta Scaling',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">New Strategy Call Scheduled</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Website:</strong> ${website || 'Not provided'}</p>
              <p><strong>Date:</strong> ${preferredDate}</p>
              <p><strong>Time:</strong> ${preferredTime}</p>
              <p><strong>Notes:</strong> ${notes || 'None'}</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) console.log('Email error:', error);
      });

      // Send confirmation to client
      const clientMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Strategy Call Confirmed - Vanta Scaling',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
            <h1 style="color: #fff; text-align: center; font-size: 48px; margin-bottom: 20px;">VANTA SCALING</h1>
            <h2 style="color: #00d4ff; text-align: center;">Your Strategy Call is Confirmed</h2>
            <div style="background: #111; padding: 30px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 18px;">Hi ${name},</p>
              <p>Your strategy call has been scheduled for:</p>
              <p style="font-size: 20px; color: #00d4ff;"><strong>${preferredDate} at ${preferredTime}</strong></p>
              <p>We'll send you a calendar invite and meeting link 24 hours before the call.</p>
              <p>In the meantime, think about:</p>
              <ul>
                <li>Your current monthly revenue</li>
                <li>Your growth goals for the next 6 months</li>
                <li>Your biggest marketing challenges</li>
              </ul>
              <p>Looking forward to helping you scale!</p>
              <p style="margin-top: 30px;">Best regards,<br>The Vanta Scaling Team</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(clientMailOptions, (error) => {
        if (error) console.log('Client email error:', error);
      });

      res.json({ 
        success: true, 
        message: 'Your strategy call has been scheduled! Check your email for confirmation.' 
      });
    }
  );
});

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Trial Surge - Vanta Scaling',
              description: 'Try-before-you-scale: Strategy call, audit, 3-day campaign, 1 week support',
              images: ['https://vantascaling.com/logo.png'],
            },
            unit_amount: 19700, // $197.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/plans.html`,
      metadata: {
        plan: 'Trial Surge'
      }
    });

    // Save purchase record
    db.run(
      'INSERT INTO purchases (stripe_session_id, customer_email, amount, plan_name) VALUES (?, ?, ?, ?)',
      [session.id, session.customer_email || 'pending', 19700, 'Trial Surge']
    );

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update purchase status
    db.run(
      'UPDATE purchases SET status = ?, customer_email = ? WHERE stripe_session_id = ?',
      ['completed', session.customer_details.email, session.id]
    );

    // Send Discord notification for purchase
    const discordEmbed = {
      title: '💰 New Trial Surge Purchase!',
      color: 0x00ff00, // Green for success
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: '📧 Customer Email',
          value: session.customer_details.email,
          inline: true
        },
        {
          name: '💵 Amount',
          value: '$197.00',
          inline: true
        },
        {
          name: '📦 Package',
          value: 'Trial Surge',
          inline: true
        },
        {
          name: '🆔 Session ID',
          value: session.id,
          inline: false
        }
      ],
      footer: {
        text: 'Vanta Scaling Purchase'
      }
    };

    sendDiscordNotification(discordEmbed);

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: session.customer_details.email,
      subject: 'Welcome to Trial Surge - Vanta Scaling',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
          <h1 style="color: #fff; text-align: center; font-size: 48px; margin-bottom: 20px;">VANTA SCALING</h1>
          <h2 style="color: #00d4ff; text-align: center;">Welcome to Trial Surge!</h2>
          <div style="background: #111; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 18px;">Thank you for your purchase!</p>
            <p>Your Trial Surge package includes:</p>
            <ul style="color: #00d4ff;">
              <li>30-minute strategy call</li>
              <li>Complete ad account or website audit</li>
              <li>3-day micro campaign (paid or organic)</li>
              <li>1 week of dedicated support</li>
              <li>Detailed performance breakdown</li>
            </ul>
            <p>We'll contact you within 24 hours to schedule your strategy call and get started.</p>
            <p style="margin-top: 30px;">Get ready to scale!<br>The Vanta Scaling Team</p>
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) console.log('Confirmation email error:', error);
    });
  }

  res.json({ received: true });
});

// Admin endpoints (should be protected in production)
app.get('/api/admin/contacts', (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch contacts' });
    res.json(rows);
  });
});

app.get('/api/admin/appointments', (req, res) => {
  db.all('SELECT * FROM appointments ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch appointments' });
    res.json(rows);
  });
});

app.get('/api/admin/purchases', (req, res) => {
  db.all('SELECT * FROM purchases ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch purchases' });
    res.json(rows);
  });
});

// Serve HTML files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error(err.message);
    console.log('Database connection closed.');
    process.exit(0);
  });
});
