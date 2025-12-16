# DineOS - Tenant Architecture Testing Guide

## 🎯 Implementation Complete!

All functionality has been implemented for tenant-specific admin login using the subdomain architecture.

---

## 🔧 What Was Implemented

### 1. **Environment Configuration** (.env.local)
- Backend API: `http://52.63.95.168:8080/api`
- Root domain: `dineos.localhost:3001`

### 2. **Middleware** (middleware.ts)
- Routes tenant subdomains correctly
- Handles: `looptech.dineos.localhost:3001/admin/login` → `/site/looptech/admin/login`
- Injects tenant headers: `x-tenant-id`, `x-tenant-slug`

### 3. **API Client** (lib/api-client.ts)
- **Tenant exists check**: `GET /api/tenants/exists?slug=looptech`
- **Login endpoint**: `POST /api/users/login` (with `x-tenant-id` header)
- Automatic tenant context injection

### 4. **Server Utilities** (lib/server/tenant.ts)
- `checkTenantExists()` - Validates tenant via backend API
- `fetchTenantBySlug()` - Fetches full tenant data with fallback

### 5. **Tenant Admin Login** (app/site/[tenant]/admin/login/page.tsx)
- Branded login page per tenant
- Real API authentication
- Automatic tenant context

### 6. **Tenant Admin Dashboard** (app/site/[tenant]/admin/dashboard/*)
- Full dashboard layout with navigation
- Protected routes with token verification
- Tenant-specific branding

---

## 🧪 How to Test

### Step 1: Start the Development Server

```bash
npm run dev
```

The app should start on port **3001** (or update .env.local if using different port)

### Step 2: Test Tenant Login Flow

#### Test URL:
```
http://looptech.dineos.localhost:3001/admin/login
```

#### Expected Behavior:
1. **Middleware extracts** tenant slug: `looptech`
2. **Backend API called**: `GET http://52.63.95.168:8080/api/tenants/exists?slug=looptech`
3. **If 200 response**: Tenant exists → Display login page
4. **If 404 response**: Tenant not found → Show error page

### Step 3: Test Login Submission

When you enter credentials and click "Sign In":

```javascript
// API Call Made:
POST http://52.63.95.168:8080/api/users/login
Headers: {
  "Content-Type": "application/json",
  "x-tenant-id": "looptech"
}
Body: {
  "email": "your@email.com",
  "password": "yourpassword"
}
```

#### Expected Backend Response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@looptech.com",
    "name": "Admin User",
    "role": "tenant_admin"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresAt": 1234567890
  }
}
```

#### After Successful Login:
- Token stored in `localStorage`
- Redirects to: `http://looptech.dineos.localhost:3001/admin/dashboard`

### Step 4: Test Other Tenants

Try creating more tenants from superadmin and accessing their admin panels:

```
http://pizzahut.dineos.localhost:3001/admin/login
http://burgerhouse.dineos.localhost:3001/admin/login
```

---

## 🌐 All Available Routes

### 1. **Marketing/Landing**
- `http://dineos.localhost:3001/home` → Public homepage
- `http://www.dineos.localhost:3001` → Marketing site

### 2. **Superadmin Panel**
- `http://dineos.localhost:3001/admin/login` → Superadmin login
- `http://dineos.localhost:3001/admin/dashboard` → Manage all tenants

### 3. **Tenant Owner Dashboard** (SaaS Platform)
- `http://app.dineos.localhost:3001/login` → Restaurant owner login
- `http://app.dineos.localhost:3001/dashboard` → Manage own restaurant

### 4. **Tenant Admin Panel** (Per Restaurant)
- `http://looptech.dineos.localhost:3001/admin/login` → Looptech admin login
- `http://looptech.dineos.localhost:3001/admin/dashboard` → Looptech admin dashboard
- `http://pizzahut.dineos.localhost:3001/admin/login` → Pizza Hut admin login

### 5. **Customer Menu** (Public)
- `http://looptech.dineos.localhost:3001/` → Customer menu
- `http://pizzahut.dineos.localhost:3001/` → Pizza Hut menu

---

## 🐛 Troubleshooting

### Problem: "This page could not be found" (404)

**Possible Causes:**
1. Backend API not responding at `52.63.95.168:8080`
2. Tenant doesn't exist in backend
3. CORS issues blocking the API call

**Solution:**
- Check if backend is running: `curl http://52.63.95.168:8080/api/tenants/exists?slug=looptech`
- Check browser console for errors
- Verify .env.local has correct API URL

### Problem: "Tenant not found" Error Page

**Cause:** Backend returned non-200 status from `/tenants/exists?slug=looptech`

**Solution:**
- Verify tenant exists in backend database
- Check backend logs
- Test the endpoint directly:
  ```bash
  curl -v http://52.63.95.168:8080/api/tenants/exists?slug=looptech
  ```

### Problem: Login fails with error

**Possible Causes:**
1. Invalid credentials
2. Backend login endpoint not working
3. Missing x-tenant-id header

**Solution:**
- Open browser DevTools → Network tab
- Check the POST request to `/api/users/login`
- Verify headers include: `x-tenant-id: looptech`
- Check backend response

### Problem: CORS errors in console

**Solution:**
Your backend needs to allow requests from `http://looptech.dineos.localhost:3001`

Add CORS headers in Java backend:
```java
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Content-Type, x-tenant-id, Authorization");
```

---

## 📊 API Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ User visits:                                            │
│ http://looptech.dineos.localhost:3001/admin/login       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Middleware extracts subdomain: "looptech"              │
│ Sets header: x-tenant-slug: looptech                   │
│ Rewrites to: /site/looptech/admin/login                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Server Component (layout.tsx)                          │
│ Calls: GET /api/tenants/exists?slug=looptech          │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓ 200 OK                  ↓ 404 Not Found
┌──────────────────┐      ┌──────────────────┐
│ Tenant exists    │      │ Show 404 page    │
│ Render login page│      │ "Tenant not found"│
└────────┬─────────┘      └──────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────┐
│ User submits login form                                 │
│ POST /api/users/login                                   │
│ Headers: { "x-tenant-id": "looptech" }                 │
│ Body: { email, password }                               │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓ Success                 ↓ Failed
┌──────────────────┐      ┌──────────────────┐
│ Store token      │      │ Show error msg   │
│ Redirect to      │      │                  │
│ /admin/dashboard │      │                  │
└──────────────────┘      └──────────────────┘
```

---

## ✅ Testing Checklist

- [ ] Backend API is accessible at `http://52.63.95.168:8080/api`
- [ ] Tenant "looptech" exists in backend database
- [ ] Next.js dev server running on port 3001
- [ ] `.env.local` has correct values
- [ ] Browser can resolve `*.localhost` domains
- [ ] Accessing `http://looptech.dineos.localhost:3001/admin/login` shows login page
- [ ] Login form submits to correct API endpoint with headers
- [ ] Successful login redirects to dashboard
- [ ] Dashboard displays tenant-specific information
- [ ] Can create new tenant from superadmin
- [ ] New tenant's admin login works immediately

---

## 🚀 Next Steps

1. **Test with real backend credentials**
2. **Implement full dashboard features** (menu management, orders, etc.)
3. **Add proper session management** (refresh tokens, logout)
4. **Implement customer-facing menu** at `looptech.dineos.localhost:3001/`
5. **Add role-based permissions** within tenant admin
6. **Deploy to production** with proper domain setup

---

## 📝 Notes

- **Port**: Using 3001 (update if using different port)
- **Backend**: Real API at 52.63.95.168:8080
- **Tenant Validation**: Uses `/tenants/exists?slug=` endpoint
- **Login**: Uses `/users/login` with `x-tenant-id` header
- **Fallback**: If full tenant data fails, uses minimal tenant object

---

## 🆘 Support

If you encounter issues:

1. **Check browser console** for errors
2. **Check Network tab** for API calls
3. **Check backend logs** for request receipt
4. **Verify environment variables** are loaded
5. **Restart dev server** after changing .env.local

---

**All systems are GO! Ready for testing! 🎉**
