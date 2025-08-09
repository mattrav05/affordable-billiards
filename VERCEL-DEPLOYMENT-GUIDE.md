# 🚀 Vercel Deployment Guide - Affordable Billiards

## ✅ **Status:** Production Build Complete!
Your Next.js application has been successfully built and is ready for deployment.

---

## 📋 **Quick Start Steps:**

### **Step 1: Create GitHub Repository** 
Since we don't have GitHub CLI available, please:

1. **Go to GitHub.com** and create a new repository named `affordable-billiards`
2. **Make it public** (required for Vercel free tier)
3. **Don't initialize** with README, .gitignore, or license (we already have these)
4. **Copy the remote URL** (should look like: `https://github.com/YOUR_USERNAME/affordable-billiards.git`)

### **Step 2: Push Code to GitHub**
Run these commands in your project directory:
```bash
git remote add origin https://github.com/YOUR_USERNAME/affordable-billiards.git
git branch -M main
git push -u origin main
```

### **Step 3: Deploy to Vercel**
1. **Go to [vercel.com](https://vercel.com)** and sign up with your GitHub account
2. **Click "New Project"**
3. **Import your `affordable-billiards` repository**
4. **Vercel will auto-detect Next.js** - just click "Deploy"

---

## 🔧 **Environment Variables for Vercel**

After your first deployment, add these environment variables in your Vercel dashboard:

### **Go to: Project Settings → Environment Variables**

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCgYOJ-UhJ3KmTQPg0k4EBnZ1vtpNS90XY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=affordable-billiards.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=affordable-billiards
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=affordable-billiards.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=743408151608
NEXT_PUBLIC_FIREBASE_APP_ID=1:743408151608:web:6a7e4f970b2b67debc8acd

FIREBASE_PROJECT_ID=affordable-billiards
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@affordable-billiards.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCe/YWYbWzRBfhC\n0nTtVThFxHVdzrqrITKw3TAhEgLI9yvsR9U9/58ZRd2rqd2SyLioJw7T61nK5VrY\nzRafh2JizilRsbjnK891nTE9djCewVtCW6gGLclDSoX2Tebxp/mjsHLtflJlt3IU\nAuCjUStfOGl7JRcLbHQ9hqiMcd78KiwvpP7YUlhlx+OLGhb0cP6/yf5o652uxp3y\nicdIC9EzMFGgXpRxn3tD81ebcdGYsaNfq99hFxwahzPJyap2LBGMsjfvOvia1HaT\nxjwuQnwuz/NxcZ6sA0/zddKAblpgXreVogPrDknSJ4BTOQHoDd4QNt6DzP7Asccm\nwuYVgKdZAgMBAAECggEAAyDW45hnlzdIWrw8W70dBdZnPsjGCH73Od6oR0ZM8rpW\nTWhebEFe1ob25R1LBEvZwkk+c/ICCsl3f6ONaecmiu4mhvp5uma0xsoogV6Vd1Iz\novsds71r49yQBTgkLqYQ9eUPZdfh9ClnX7hsxhnfQhjgjnE84lcodFt1booBCrIb\nxKcUtbCW+9FiXFWVUwsk1bxDRdJGZsF0H3weFsuSDKagA2M/DBxdojyxR4Ilw8ZT\nB5fH7q4fLzWdG58gw8jHvj/xV1C1M/DztqAVP7LehoP5fxAKU/FHB3S2JBjoU12B\nwpe1LyMdbd12Z6BebtpCXswpjnm37KGGjmbAVLeKOQKBgQDaXoUTo8ePr8eh6g/j\nROavH3rcEJlvNudhejZugWHC3xc8xi2B9GaZ7aoLxO7C95hNSPLWEH3d5zMxbWhu\nHRPgMEj4mH0ZCL6NB91ZKAFfsPeok8CqZ/Atn2EgFY4tvHGnZwUoeMY0+0bAmCM9\nu+nJQXPatNSejupnIUc7ueoF7QKBgQC6Y3f+HFyXmAy6Y5tkf4DOT2Pg6e5HRymb\nxmXk8/70+PCMqRqm0R3ua11YG1Df/bGlHmdWczsRqi+3EpST0P7gDvLoVT43lmwk\nMh3rG6v5LT47xUPisyEix0cae72lY7xmOT2CcCM91szXvB9iDmxM+rqbQcNjmWtr\njOqYfyZ5nQKBgC/5YAcmjis1FQivYXouoveKVPWP+AWE7GRv8xFn/1BOrs49Q7Yv\nOXNL0XXwd/wBZUZlZmQ9D0n3BzourSiz3q/8K6vh5Gnhj+tv9OMndNXPDTnN7CAD\n4bJEN5RS5/+ITPfYHDv9/J2bLroVMnjXlc8PQCKmY6fKAhlSKFIo0A8pAoGAK08J\nhqYYbbEK5BRY+xUVXNrdnlk84JsMdAG5k2WOjGV7n3N7md9lUQzpd5uBQ0qziGZ0\nJIZJ52TgCW3r0Bzz3CQdFRcZidkN76slgIfBgfidSU4g5AAzZt1fDCxMeK2gDTCn\ntjNQPQI4PribojEvwQNRcNnrCK2RZEAuEpkY25ECgYEAq6s8eSWTMCvOPqDYfFT/\nUkv+8omCq7PbYhF2bfKmWxzCCLvmRKIqR0AU+/mo8p3MTuhDRKCfwYvX/WKCrY8b\nJ5whHvzOh8jb60mht3ZdBEaZ8neajbWa6F0eX/lGJY0JbjRl+E7LsqpcuGrfW99s\n2KiXIJ3jzRqd0054TWxssIM=\n-----END PRIVATE KEY-----"

FIREBASE_STORAGE_BUCKET=affordable-billiards.firebasestorage.app

NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=ab5f8c2d9e7a1b6f3c8d4e9a7b2f5c8d1a6b3e7f9c2d5a8b4e7f1c6a9b3d8f2e5

ADMIN_EMAIL=mattrav05@yahoo.com
ADMIN_PASSWORD=admin123

NODE_ENV=production
```

**Important:** 
- Replace `https://your-project-name.vercel.app` with your actual Vercel domain
- Add all variables in Production environment
- The FIREBASE_PRIVATE_KEY should include the full key with newlines as shown

---

## 🧪 **Testing Your Deployment**

Once deployed, test these features:
- ✅ **Site loads correctly**
- ✅ **Admin login works** (`/admin/login`)
- ✅ **All pages display** (home, about, services, etc.)
- ✅ **Forms submit** (contact, reviews, RFQ)
- ✅ **Phone numbers show** `(586) 552-6053`
- ✅ **Email addresses show** `cathies4@yahoo.com`

---

## 🎯 **What's Included:**

### ✅ **Complete Website Features:**
- Professional business website design
- Pool table inventory management 
- Customer review system with admin replies
- RFQ (Request for Quote) system
- Blog management system
- SEO optimized pages

### ✅ **Admin Panel** (`/admin/login`)
- Dashboard with business metrics
- Table inventory management (7′, 8′, 8′ Pro, 9′, 10′)
- Review management with reply functionality
- RFQ management system
- Blog post creation and management

### ✅ **Contact Information:**
- **Phone:** (586) 552-6053
- **Public Email:** cathies4@yahoo.com  
- **Admin Login:** mattrav05@yahoo.com

---

## 🚀 **Deployment is MUCH Easier on Vercel!**

Unlike A2 Hosting, Vercel:
- ✅ **Auto-detects Next.js** and configures everything
- ✅ **Handles builds automatically** 
- ✅ **Provides HTTPS** out of the box
- ✅ **Scales automatically**
- ✅ **Zero server management**
- ✅ **Free for your use case**

**Next Step:** Create the GitHub repo and deploy to Vercel!

---

## 💡 **Need Help?**
If you run into any issues, just let me know and I can help troubleshoot each step!