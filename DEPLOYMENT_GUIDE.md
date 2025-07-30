# Complete Deployment Guide for Vanta Scaling Website

## Step 1: Install Node.js on Windows

Since you're getting an error that `npm` isn't recognized, you need to install Node.js first:

1. **Download Node.js:**
   - Go to https://nodejs.org
   - Click the "LTS" version (recommended)
   - Download the Windows Installer (.msi)

2. **Install Node.js:**
   - Run the downloaded installer
   - Click "Next" through the installation wizard
   - Make sure "npm package manager" is checked
   - Click "Install"
   - Click "Finish" when done

3. **Verify Installation:**
   - Close any open Command Prompt windows
   - Open a NEW Command Prompt (Windows Key + R, type `cmd`, press Enter)
   - Type: `node --version` (should show version number)
   - Type: `npm --version` (should show version number)

## Step 2: Run the Website Locally

1. **Open Command Prompt**
   - Press Windows Key + R
   - Type `cmd` and press Enter

2. **Navigate to the project:**
   ```cmd
   cd Desktop\vanta-scaling-luxury
   ```

3. **Install dependencies:**
   ```cmd
   npm install
   ```

4. **Start the server:**
   ```cmd
   npm start
   ```

5. **View your website:**
   - Open your browser
   - Go to: http://localhost:3000

## Step 3: Deploy to Your Domain

### Option A: Deploy to Vercel (Recommended - FREE)

1. **Create a Vercel account:**
   - Go to https://vercel.com
   - Sign up with GitHub/GitLab/Bitbucket or email

2. **Install Vercel CLI:**
   ```cmd
   npm install -g vercel
   ```

3. **Deploy your site:**
   ```cmd
   vercel
   ```
   - Follow the prompts
   - Choose "Link to existing project" → No
   - Set project name: vanta-scaling
   - Which directory is your code in? → ./

4. **Connect your domain:**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Domains"
   - Add your domain (e.g., vantascaling.com)
   - Follow Vercel's instructions to update your domain's DNS

### Option B: Deploy to Netlify (Also FREE)

1. **Prepare for Netlify:**
   - Create a new file `netlify.toml` in your project:
   ```toml
   [build]
     command = "echo 'No build needed'"
     publish = "public"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Create Netlify account:**
   - Go to https://netlify.com
   - Sign up

3. **Deploy:**
   - Drag your entire `vanta-scaling-luxury` folder to Netlify dashboard
   - Or use Netlify CLI:
   ```cmd
   npm install -g netlify-cli
   netlify deploy
   ```

4. **Connect domain:**
   - Go to Site settings → Domain management
   - Add custom domain
   - Update DNS settings as instructed

### Option C: Deploy to a VPS (DigitalOcean, AWS, etc.)

1. **Get a VPS:**
   - Sign up for DigitalOcean, AWS EC2, or similar
   - Create an Ubuntu server

2. **Connect to your server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js on server:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Upload your files:**
   - Use FileZilla or SCP to upload your project

5. **Install PM2 (keeps your app running):**
   ```bash
   npm install -g pm2
   cd /path/to/vanta-scaling-luxury
   npm install
   pm2 start server.js --name vanta-scaling
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx (web server):**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/vantascaling
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/vantascaling /etc/nginx/sites-enabled
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Add SSL (HTTPS):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Step 4: Update DNS Settings

Regardless of which hosting option you choose, you'll need to update your domain's DNS:

1. **Log into your domain registrar** (GoDaddy, Namecheap, etc.)

2. **Find DNS/Nameserver settings**

3. **Update records:**
   - For Vercel/Netlify: Follow their specific instructions
   - For VPS: Add an A record pointing to your server's IP address

## Step 5: Environment Variables

Before deploying, update your environment variables:

1. **For Vercel:**
   - Go to Project Settings → Environment Variables
   - Add your Stripe keys, email settings, etc.

2. **For Netlify:**
   - Go to Site settings → Environment variables
   - Add your variables

3. **For VPS:**
   - Create `.env` file on the server with your actual values

## Important Notes:

1. **Stripe Setup:**
   - Create a Stripe account at https://stripe.com
   - Get your API keys from the Dashboard
   - Add them to your environment variables

2. **Email Setup:**
   - For Gmail: Enable 2-factor auth and create app password
   - Update EMAIL_USER and EMAIL_PASS in environment

3. **Discord Webhook:**
   - Your webhook is already in the code and will work immediately

## Troubleshooting:

**If npm still doesn't work:**
- Restart your computer after installing Node.js
- Make sure to open a NEW Command Prompt window
- Try running Command Prompt as Administrator

**If deployment fails:**
- Check that all files are uploaded
- Verify environment variables are set
- Check server logs for errors

**Domain not working:**
- DNS changes can take up to 48 hours
- Use https://dnschecker.org to verify DNS propagation

## Quick Start Commands Summary:

```cmd
# After installing Node.js
cd Desktop\vanta-scaling-luxury
npm install
npm start

# For Vercel deployment
npm install -g vercel
vercel

# For Netlify deployment
npm install -g netlify-cli
netlify deploy
```

Need help? The website is fully functional and ready to deploy. Just follow these steps in order!
