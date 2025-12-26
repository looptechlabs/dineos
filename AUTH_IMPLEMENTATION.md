# DineOS Authentication - API Structure

## 📁 File Structure

```
lib/
├── api/
│   └── auth.ts              # Tenant-based authentication API service
└── utils/
    └── checkTenant.ts       # Tenant existence validation

app/
└── site/
    └── [tenant]/
        └── admin/
            └── login/
                └── page.tsx  # Redesigned login page with QR theme
```

## 🔐 Authentication Flow

### 1. **API Service** - `lib/api/auth.ts`
Main authentication functions for tenant-based login:

**Functions:**
- `tenantAdminLogin(tenantSlug, credentials)` - Authenticates admin user
- `storeAuthToken(tenantSlug, token)` - Saves JWT token to localStorage
- `getAuthToken(tenantSlug)` - Retrieves stored token
- `clearAuthToken(tenantSlug)` - Removes token (logout)
- `isAuthenticated(tenantSlug)` - Checks if user is logged in

**API Endpoint:**
```
POST http://{tenant_slug}.localhost:8080/api/users/login

Request Body:
{
  "email": "adminpizzahut@gmail.com",
  "password": "pizzahut"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "adminpizzahut@gmail.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### 2. **Login Page** - `app/site/[tenant]/admin/login/page.tsx`
Modern glassmorphic login UI with QR code theme:

**Features:**
- ✨ Animated gradient background
- 🎨 QR-inspired logo design
- 📱 Mobile-responsive layout
- 🔒 Secure authentication
- ⚡ Real-time validation
- 🎯 Tenant-specific routing

**Route:** `http://{tenant}.dineos.localhost:3000/admin/login`

## 🚀 Usage Example

### Testing the Login

1. **Start your backend server** (port 8080):
```bash
# Make sure your backend is running on port 8080
```

2. **Access the login page**:
```
http://pizzahut.dineos.localhost:3000/admin/login
```

3. **Login credentials**:
```
Email: adminpizzahut@gmail.com
Password: pizzahut
```

4. **On successful login**:
- JWT token is stored in localStorage as `dineos_auth_pizzahut`
- User is redirected to `/site/pizzahut/admin/dashboard`

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple gradient (`from-purple-600 to-blue-600`)
- **Background**: Dark slate with animated blobs
- **Glassmorphism**: `backdrop-blur-xl` with transparency
- **Accents**: QR code-inspired grid pattern

### UI Elements
- 🔷 QR-style logo with tenant initial
- 📱 Feature badges (QR Ordering, Quick Snap, POS Receipt)
- ⚡ Smooth animations and transitions
- 🎯 Clear error messaging
- 🔄 Loading states with spinners

## 🔧 How It Works

1. **Component mounts** → Checks if tenant exists via `checkTenantExists()`
2. **User submits form** → Calls `tenantAdminLogin()` with credentials
3. **API request** → POST to `http://{tenant}.localhost:8080/api/users/login`
4. **Success response** → Token stored via `storeAuthToken()`
5. **Navigation** → Router pushes to dashboard
6. **Error handling** → Display user-friendly error messages

## 🎯 Integration Points

### Backend Requirements
Your backend should:
1. Accept POST requests at `/api/users/login`
2. Validate credentials against tenant database
3. Return JWT token and user object
4. Support tenant-specific domains (e.g., `pizzahut.localhost:8080`)

### Frontend Requirements
- Next.js 14+ with App Router
- TypeScript support
- Tailwind CSS for styling

## 🔐 Security Features

- ✅ Client-side form validation
- ✅ Tenant-specific token storage
- ✅ Secure password input (type="password")
- ✅ HTTPS ready (production)
- ✅ Token-based authentication
- ✅ Automatic tenant verification

## 📝 Customization

### Change API Port
Edit `lib/api/auth.ts`:
```typescript
const apiUrl = `http://${tenantSlug}.localhost:8080/api/users/login`;
// Change 8080 to your backend port
```

### Modify Redirect
Edit `app/site/[tenant]/admin/login/page.tsx`:
```typescript
router.push(`/site/${tenantSlug}/admin/dashboard`);
// Change to your desired redirect path
```

### Theme Colors
The design uses Tailwind CSS classes. Modify gradients and colors:
- `from-purple-600 to-blue-600` → Your brand colors
- `bg-slate-900` → Your background preference

## 🐛 Troubleshooting

### "Tenant doesn't exist" Error
- Ensure tenant exists in your database
- Check `lib/utils/checkTenant.ts` API endpoint

### CORS Issues
- Configure your backend to allow requests from `localhost:3000`
- Add appropriate CORS headers

### Network Error
- Verify backend is running on port 8080
- Check tenant subdomain configuration
- Ensure DNS/hosts file is configured for `.localhost` domains

## 📚 Related Files
- [lib/api/auth.ts](lib/api/auth.ts) - Authentication API
- [lib/utils/checkTenant.ts](lib/utils/checkTenant.ts) - Tenant validation
- [app/site/[tenant]/admin/login/page.tsx](app/site/[tenant]/admin/login/page.tsx) - Login page
