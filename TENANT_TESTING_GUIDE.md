# DineOS - Tenant Admin Testing Guide

## 🎯 What We Built

A complete tenant-specific admin portal system where each tenant (restaurant) has their own subdomain-based admin interface.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ URL: http://looptech.dineos.localhost:3001/admin/login     │
│ ↓                                                            │
│ Middleware extracts: subdomain="looptech"                   │
│ ↓                                                            │
│ Rewrites to: /site/looptech/admin/login                     │
│ ↓                                                            │
│ Layout validates tenant exists via API call:                │
│ GET http://52.63.95.168:8080/api/tenants?slug=looptech    │
│ ↓                                                            │
│ If valid → Shows branded login page                         │
│ If invalid → Shows "Tenant Not Found" error                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

1. **Backend API must be running** at `52.63.95.168:8080`
2. **Tenant must exist** in backend database with slug `looptech`
3. **Port 3001** must be available

---

## 🚀 Step-by-Step Testing

### Step 1: Update Configuration

The `.env.local` file has been updated with:
```env
NEXT_PUBLIC_API_BASE_URL=http://52.63.95.168:8080/api
NEXT_PUBLIC_ROOT_DOMAIN=dineos.localhost:3001
```

### Step 2: Start Development Server

```bash
npm run dev -- -p 3001
```

**Expected output:**
```
- Local:        http://localhost:3001
- ready started server on [::]:3001
```

### Step 3: Test Tenant Validation

Open your browser and navigate to:
```
http://looptech.dineos.localhost:3001/admin/login
```

**What happens:**

1. **Middleware logs** (check terminal):
   ```
   [Middleware] Host: looptech.dineos.localhost:3001, Subdomain: looptech, Path: /admin/login
   ```

2. **API Call to Backend**:
   ```
   GET http://52.63.95.168:8080/api/tenants?slug=looptech
   Headers: x-tenant-id: looptech
   ```

3. **Expected Responses:**

   **✅ If tenant exists:**
   - You'll see the branded login page for Looptech
   - Page title: "Looptech Admin Portal"
   - Login form with email and password fields
   - Dev info box showing tenant slug and API endpoint

   **❌ If tenant doesn't exist:**
   - "Restaurant Not Found" error page
   - Message: "The restaurant `looptech` does not exist or is not available"

### Step 4: Test Login Functionality

Once the login page loads:

1. **Enter credentials:**
   - Email: (your tenant admin email)
   - Password: (your password)

2. **Click "Sign In"**

3. **Backend API call:**
   ```
   POST http://52.63.95.168:8080/api/users/login
   Headers: 
     x-tenant-id: looptech
     Content-Type: application/json
   Body:
     {
       "email": "admin@looptech.com",
       "password": "yourpassword"
     }
   ```

4. **Expected Response:**
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": "...",
         "email": "admin@looptech.com",
         "name": "Admin Name",
         "role": "tenant_admin",
         "tenantId": "looptech"
       },
       "tokens": {
         "accessToken": "eyJhbGc...",
         "refreshToken": "...",
         "expiresAt": 1734567890
       }
     }
   }
   ```

5. **On successful login:**
   - Token stored in `localStorage`
   - Redirect to: `http://looptech.dineos.localhost:3001/admin/dashboard`

### Step 5: Test Dashboard Access

After successful login, you should see:
- ✅ Tenant-branded admin dashboard
- ✅ Navigation sidebar with menu items
- ✅ Today's statistics (orders, revenue, etc.)
- ✅ Quick action buttons
- ✅ Recent orders list
- ✅ "View Live Menu" button linking to customer-facing page

---

## 🧪 Additional Test Cases

### Test Case 1: Invalid Tenant

```
URL: http://invalidtenant.dineos.localhost:3001/admin/login
Expected: "Restaurant Not Found" error page
```

### Test Case 2: Suspended Tenant

If backend returns `status: "suspended"`:
```
Expected: "Restaurant Suspended" warning page
```

### Test Case 3: Wrong Credentials

Enter wrong email/password:
```
Expected: Error message displayed on login form
```

### Test Case 4: Create New Tenant (Pizzahut)

1. Go to superadmin:
   ```
   http://dineos.localhost:3001/admin/login
   ```

2. Create tenant with slug `pizzahut`

3. Test pizzahut admin login:
   ```
   http://pizzahut.dineos.localhost:3001/admin/login
   ```

---

## 🔍 Debugging

### Check Middleware Logs

Look for console output:
```
[Middleware] Host: looptech.dineos.localhost:3001, Subdomain: looptech, Path: /admin/login
```

### Check Network Requests

Open Browser DevTools → Network tab:

1. **Tenant validation call:**
   ```
   GET /api/tenants?slug=looptech
   Status: 200 OK (if tenant exists)
   ```

2. **Login call:**
   ```
   POST /api/users/login
   Status: 200 OK (if credentials correct)
   ```

### Check Local Storage

Open Browser DevTools → Application → Local Storage:
```javascript
tenantAuthToken: "eyJhbGc..."
tenantUser: "{\"id\":\"...\",\"email\":\"...\"}"
```

---

## 🐛 Common Issues

### Issue 1: "Cannot resolve host"

**Problem:** Browser can't resolve `looptech.dineos.localhost:3001`

**Solution:** Modern browsers (Chrome, Firefox, Edge) support `*.localhost` automatically. If not working:

1. **Option A:** Add to hosts file:
   ```
   # Windows: C:\Windows\System32\drivers\etc\hosts
   # Mac/Linux: /etc/hosts
   127.0.0.1 looptech.dineos.localhost
   127.0.0.1 pizzahut.dineos.localhost
   ```

2. **Option B:** Use `localtest.me`:
   Update `.env.local`:
   ```env
   NEXT_PUBLIC_ROOT_DOMAIN=dineos.localtest.me:3001
   ```
   Then access: `http://looptech.dineos.localtest.me:3001/admin/login`

### Issue 2: "Tenant Not Found"

**Causes:**
- Tenant doesn't exist in backend database
- Wrong slug in URL
- Backend API not responding
- CORS issues

**Debug:**
1. Check backend logs
2. Verify tenant exists: `GET http://52.63.95.168:8080/api/tenants?slug=looptech`
3. Check browser console for errors

### Issue 3: Login fails with CORS error

**Solution:** Backend must allow CORS from `http://looptech.dineos.localhost:3001`

Add to backend CORS config:
```java
allowedOrigins: ["http://looptech.dineos.localhost:3001", "http://pizzahut.dineos.localhost:3001"]
// OR use pattern:
allowedOrigins: ["http://*.dineos.localhost:3001"]
```

### Issue 4: API calls missing tenant header

**Check:** Network request should include:
```
x-tenant-id: looptech
```

If missing, the API client wasn't initialized correctly with tenant context.

---

## ✅ Success Criteria

Your implementation is working correctly when:

1. ✅ `http://looptech.dineos.localhost:3001/admin/login` shows login page
2. ✅ Tenant validation API call is made and succeeds
3. ✅ Login form accepts credentials
4. ✅ Login API call includes `x-tenant-id: looptech` header
5. ✅ Successful login redirects to dashboard
6. ✅ Dashboard shows tenant-specific data
7. ✅ Logout works and redirects back to login
8. ✅ Creating new tenant "pizzahut" and accessing `http://pizzahut.dineos.localhost:3001/admin/login` works

---

## 📝 Files Created/Modified

### Created:
- ✅ `.env.local` - Backend API configuration
- ✅ `app/site/[tenant]/admin/login/page.tsx` - Tenant admin login page
- ✅ `app/site/[tenant]/admin/dashboard/layout.tsx` - Admin dashboard layout
- ✅ `app/site/[tenant]/admin/dashboard/page.tsx` - Admin dashboard home

### Modified:
- ✅ `middleware.ts` - Added tenant admin route handling
- ✅ `lib/api-client.ts` - Updated to use real backend endpoints

---

## 🎉 Next Steps

After successful testing:

1. **Implement remaining dashboard pages:**
   - `/admin/dashboard/menu` - Menu management
   - `/admin/dashboard/orders` - Order management
   - `/admin/dashboard/tables` - Table & QR code management
   - `/admin/dashboard/analytics` - Analytics & reports
   - `/admin/dashboard/settings` - Tenant settings

2. **Add authentication middleware:**
   - Protect admin routes
   - Token refresh logic
   - Session management

3. **Implement customer-facing menu:**
   - `http://looptech.dineos.localhost:3001/` - Customer menu page
   - QR code ordering flow

4. **Add error handling:**
   - Network errors
   - Invalid tokens
   - API timeouts

---

## 🆘 Need Help?

If you encounter issues:

1. Check terminal logs for middleware output
2. Check browser console for errors
3. Verify backend API is running and accessible
4. Test backend endpoints directly with Postman/curl
5. Verify tenant exists in database

**Test backend directly:**
```bash
# Check if tenant exists
curl -X GET "http://52.63.95.168:8080/api/tenants?slug=looptech"

# Test login
curl -X POST "http://52.63.95.168:8080/api/users/login" \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: looptech" \
  -d '{"email":"admin@looptech.com","password":"yourpassword"}'
```
