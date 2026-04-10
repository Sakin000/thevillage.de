# 🏡 The Village Café & Play — Website

> A sanctuary for parents, a world of play for children. Coming to Bonn in 2028.

## Quick Start

This is a **pure HTML/CSS/JS website** — no build tools, no frameworks, no dependencies.

```
the-village/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Interactions & integrations
└── README.md           ← This file
```

Just open `index.html` in a browser to preview. No server needed.

---

## 🚀 Deploy to GitHub Pages (Free Hosting)

**Step 1: Create a GitHub account**
Go to [github.com](https://github.com) and sign up for free.

**Step 2: Create a new repository**
1. Click the **+** icon → "New repository"
2. Name it: `the-village` (or any name you like)
3. Set it to **Public**
4. Click "Create repository"

**Step 3: Upload the files**
Option A — Drag & Drop (easiest):
1. Click "uploading an existing file"
2. Drag your entire `the-village` folder contents in
3. Click "Commit changes"

Option B — Git command line:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-village.git
git push -u origin main
```

**Step 4: Enable GitHub Pages**
1. Go to your repo → **Settings** → **Pages**
2. Under "Source", select: `Deploy from a branch`
3. Branch: `main` / Folder: `/ (root)`
4. Click **Save**

**Your site will be live at:**
`https://YOUR_USERNAME.github.io/the-village`

(Takes 1-3 minutes to go live the first time)

---

## 📧 Mailchimp Setup (Email Collection)

**This is the most important integration — do this first.**

### Step 1: Create a Mailchimp account
Go to [mailchimp.com](https://mailchimp.com) — free up to 500 contacts, plenty for pre-launch.

### Step 2: Create your Audience
1. Go to **Audience** → **Audience dashboard**
2. Click **Create Audience** (or use the default one)
3. Fill in your details

### Step 3: Create a merge field for membership tier
1. Go to **Audience** → **Settings** → **Audience fields and *|MERGE|* tags**
2. Click **Add A Field** → choose **Text**
3. Set Field label: `Membership Interest`
4. Set Tag: `MMERGE2`
5. Save

### Step 4: Get your form action URL
1. Go to **Audience** → **Signup forms** → **Embedded forms**
2. Click **Condensed** style
3. Find the `<form action="..."` URL in the code
4. It looks like: `https://yoursite.us1.list-manage.com/subscribe/post?u=XXXXXXXX&id=XXXXXXXX`

### Step 5: Update index.html
Open `index.html` and find this line:
```html
action="YOUR_MAILCHIMP_URL_HERE"
```

Replace it with your actual URL:
```html
action="https://yoursite.us1.list-manage.com/subscribe/post?u=abc123&id=def456"
```

Also find:
```html
<input type="text" name="b_REPLACE_WITH_YOUR_U_VALUE_REPLACE_WITH_YOUR_ID" ...>
```

Replace the name with your actual `u` and `id` values:
```html
<input type="text" name="b_abc123_def456" tabindex="-1" value="">
```
(This is an anti-spam honeypot — keep it hidden but use your real values)

### Step 6: Test it
Submit the form with your own email. You should receive a confirmation email from Mailchimp.

### Step 7: Set up the "Founding 100" tag
1. In Mailchimp → **Tags** → **Create Tag** → call it `Founding 100`
2. Go to **Automations** → create a welcome email mentioning the lifetime 20% discount

---

## 📊 Poll Results (Free Option — Google Sheets)

To collect poll answers, use Google Apps Script (completely free):

### Step 1: Create a Google Sheet
Create a new Google Sheet with columns: `Timestamp | Answer | UserAgent`

### Step 2: Create an Apps Script
1. In your Sheet: **Extensions** → **Apps Script**
2. Replace all code with:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date().toISOString(),
    data.answer,
    data.userAgent || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy** → **New deployment** → **Web app**
4. Set "Execute as": Me, "Who has access": Anyone
5. Copy the deployment URL

### Step 3: Add the URL to main.js
Uncomment the `sendPollResponse` function and add your URL:
```javascript
function sendPollResponse(answer) {
  const url = 'YOUR_APPS_SCRIPT_URL_HERE';
  // ...
}
```

---

## 🔧 Customisation Guide

### Change the city
Search `index.html` for "Bonn" and replace with your city.

### Change the opening year
Search for "2028" and update throughout.

### Update founding spots taken
In `js/main.js`, find:
```javascript
const TAKEN_SPOTS = 12;
```
Update this number as people sign up.

### Change colours
All colours are CSS variables in `css/style.css`:
```css
:root {
  --sage: #7D8E7E;      /* Green — primary */
  --terra: #C97D60;     /* Terracotta — accent */
  --cream: #F9F6F0;     /* Background */
}
```

### Add a custom domain
1. Buy a domain (e.g. `thevillage.cafe`) from Namecheap or Porkbun (~€10/year)
2. In GitHub Pages settings → **Custom domain** → enter your domain
3. In your domain registrar, add a CNAME record: `www` → `YOUR_USERNAME.github.io`

---

## 📱 Recommended Tech Stack (3-Year Pre-Launch)

| Tool | Purpose | Cost |
|------|---------|------|
| GitHub Pages | Hosting | Free |
| Mailchimp | Email collection | Free (up to 500) |
| Google Sheets + Apps Script | Poll data | Free |
| Plausible Analytics | Privacy-friendly analytics | €9/mo |
| Namecheap | Custom domain | ~€10/year |
| Cloudflare | CDN + SSL | Free |

**Total: ~€10/year for the domain. Everything else is free.**

---

## 📈 Upgrading when you're ready to launch

When you need more features (booking, payments, member portal):
- **Booking**: Cal.com (free) or Acuity Scheduling
- **Payments**: Stripe
- **Member portal**: Memberstack or Outseta
- **Hosting upgrade**: Netlify or Vercel (both free tiers are generous)

---

Built with 🌿 for modern parents everywhere.
