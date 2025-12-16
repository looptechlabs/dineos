# DineOS - Quick Start for Tenant Testing

## 🚀 Quick Start

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start the development server on port 3001
npm run dev -- -p 3001
```

## 🧪 Test URLs

Once the server is running, test these URLs in your browser:

### Tenant Admin Portals
- **Looptech Admin:** http://looptech.dineos.localhost:3001/admin/login
- **Pizzahut Admin:** http://pizzahut.dineos.localhost:3001/admin/login

### Customer Menus
- **Looptech Menu:** http://looptech.dineos.localhost:3001/
- **Pizzahut Menu:** http://pizzahut.dineos.localhost:3001/

### System Admin
- **Superadmin:** http://dineos.localhost:3001/admin/login

### Marketing
- **Homepage:** http://dineos.localhost:3001/

## ⚙️ Configuration

Current backend API: **http://52.63.95.168:8080/api**

To change, edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://52.63.95.168:8080/api
NEXT_PUBLIC_ROOT_DOMAIN=dineos.localhost:3001
```

## 📋 Testing Checklist

- [ ] Server starts on port 3001
- [ ] Middleware logs show subdomain extraction
- [ ] Tenant validation API call succeeds
- [ ] Login page displays with tenant branding
- [ ] Login form submits to backend with x-tenant-id header
- [ ] Successful login redirects to dashboard
- [ ] Dashboard shows tenant-specific data
- [ ] Logout works correctly

## 🐛 Troubleshooting

**Browser can't resolve subdomain?**
→ Modern browsers support *.localhost automatically. If issues:
  - Try Firefox or Chrome (latest versions)
  - Or use http://looptech.dineos.localtest.me:3001/admin/login

**CORS errors?**
→ Backend must allow: `http://*.dineos.localhost:3001`

**Tenant not found?**
→ Verify tenant exists in backend:
```bash
curl "http://52.63.95.168:8080/api/tenants?slug=looptech"
```

## 📚 Full Documentation

See [TENANT_TESTING_GUIDE.md](./TENANT_TESTING_GUIDE.md) for detailed testing instructions.
