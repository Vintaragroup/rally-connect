# Port Configuration Enforcement Rules

## Overview
This document defines the standardized port configuration for Rally-connect to prevent port-related bugs and CORS issues.

## Port Architecture

```
External Access (Users/Browsers)
    ↓
    └─→ Nginx Reverse Proxy (Port 3000, 80, 443)
             ↓
             ├─→ Frontend Container (Port 4300 → Vite 5173)
             └─→ Backend Container (Port 4802 → Node 4000)
```

## Mandatory Configuration Rules

### 1. **Frontend Container Ports** (REQUIRED)
```yaml
rally-frontend:
  ports:
    - "4300:5173"  # NEVER CHANGE - Must be 4300
```

**Why**: 
- Nginx reverse proxy is configured to route port 3000 to `127.0.0.1:4300`
- Vite dev server always runs on port 5173 inside container
- Environment variable `FRONTEND_PORT` should be removed (was causing inconsistency)

**Validation**: 
```bash
docker ps | grep rally-frontend | grep "4300"  # Must show 4300:5173
```

### 2. **Backend Container Ports** (REQUIRED)
```yaml
rally-backend:
  ports:
    - "4802:4000"  # NEVER CHANGE - Must be 4802
```

**Why**:
- Nginx reverse proxy routes `/api/*` to `127.0.0.1:4802`
- Node.js app always runs on port 4000 inside container
- External services expect backend on port 4802

**Validation**:
```bash
docker ps | grep rally-backend | grep "4802"  # Must show 4802:4000
```

### 3. **API URL Configuration** (REQUIRED)
```yaml
rally-frontend:
  environment:
    - VITE_API_URL=/api
```

**Rules**:
- API_URL MUST be relative path `/api`, never hardcoded absolute URLs
- Fallback in code MUST be `/api`, never `http://localhost:4802`
- This ensures all API calls route through nginx reverse proxy
- Prevents CORS policy errors with private address space

**Locations to Enforce**:
```
src/hooks/useCurrentUser.ts
src/App.tsx
src/pages/OAuthCallbackHandler.tsx
src/components/AssociationAdminDashboard.tsx
src/components/admin-tabs/*.tsx (all admin tabs)
src/lib/api/authApi.ts
src/lib/auth/useAuth.ts
src/services/api.ts
```

**Code Pattern - CORRECT**:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || '/api';
const response = await fetch(`${apiUrl}/auth/me`);
// Results in: http://138.197.31.8:3000/api/auth/me
```

**Code Pattern - INCORRECT** ❌:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4802';
const response = await fetch(`${apiUrl}/auth/me`);
// Results in: http://localhost:4802/auth/me (fails - wrong host)
// OR: http://10.0.0.2:4802/auth/me (fails - CORS + private address space)
```

### 4. **Environment Variables** (REQUIRED)
```yaml
rally-frontend:
  environment:
    - VITE_API_URL=/api              # REQUIRED
    - NODE_ENV=development           # REQUIRED for JSX runtime
    
rally-backend:
  environment:
    - APP_PORT=4000                  # REQUIRED - internal port
    - NODE_ENV=development           # REQUIRED
    - BACKEND_PORT=4802              # REQUIRED - documentation only
```

**Why These Matter**:
- `VITE_API_URL`: Controls frontend API routing
- `NODE_ENV=development`: Enables React JSX dev runtime (critical!)
- `APP_PORT=4000`: Backend listens internally on 4000
- `BACKEND_PORT=4802`: Documentation of external port (informational)

### 5. **Nginx Configuration** (REQUIRED)
```nginx
server {
    listen 3000;
    listen [::]:3000;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:4300;
        # ... other proxy config
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4802/;
        # ... other proxy config
    }
}
```

**Rules**:
- External port 3000 is the SINGLE entry point
- All requests go through nginx
- No direct access to container ports from browser

## Checklist for Configuration Changes

Before modifying ports or URLs, verify:

- [ ] Frontend container uses port 4300
- [ ] Backend container uses port 4802
- [ ] Nginx listens on port 3000 (and 80, 443 for HTTPS)
- [ ] Nginx routes /api/* to port 4802
- [ ] All fetch() calls use relative `/api` paths
- [ ] VITE_API_URL environment variable set to `/api`
- [ ] NODE_ENV=development in both containers
- [ ] No hardcoded `http://localhost:XXXX` URLs in code
- [ ] No hardcoded `http://10.0.0.2:XXXX` URLs in code
- [ ] Dockerfile.dev uses correct port 5173 internally

## Debugging Port Issues

### Issue: "Cannot reach API from frontend"
**Check**:
1. Is nginx running? `ps aux | grep nginx`
2. Is nginx listening on 3000? `netstat -tlnp | grep 3000`
3. Does nginx config have `/api/` proxy? `grep -A2 "location /api" /etc/nginx/sites-enabled/rally-connect`
4. Is backend container running? `docker ps | grep rally-backend`
5. Is VITE_API_URL set to `/api`? (not localhost URL)

### Issue: "CORS policy: The request client is not a secure context"
**Cause**: Frontend trying to reach internal Docker IP or localhost
**Solution**: Verify all fetch() calls use `import.meta.env.VITE_API_URL` which should be `/api`

### Issue: "ERR_FAILED (net::ERR_FAILED)"
**Cause**: API URL pointing to unreachable address
**Solution**: Check VITE_API_URL and all fetch() fallbacks are `/api`

## Testing Port Configuration

```bash
# 1. Verify containers use correct ports
docker ps | grep -E "(4300|4802)"

# 2. Test frontend loads
curl -I http://138.197.31.8:3000

# 3. Test backend API through nginx
curl http://138.197.31.8:3000/api/health

# 4. Check NODE_ENV in container
docker exec rally-frontend sh -c 'echo $NODE_ENV'  # Should print: development

# 5. Verify no hardcoded localhost in code
grep -r "localhost:4802" src/
grep -r "10.0.0.2" src/
# Both should return nothing
```

## Related Issues Fixed

- Fixed CORS errors by routing through nginx instead of direct Docker IP
- Fixed private address space errors by using external IP (138.197.31.8)
- Fixed team creation failures by ensuring backend is reachable
- Fixed inconsistent port numbering

## Commits Enforcing This

```
ac41923 Fix: Keep frontend port 4300 (nginx proxies to 3000 externally)
04736da Fix: Use /api relative paths and port 3000 for all API calls
```

## Future Enforcement

**Add to CI/CD pipeline**:
```bash
# Prevent hardcoded localhost URLs
if grep -r "http://localhost:" src/ --include="*.ts" --include="*.tsx"; then
  echo "ERROR: Hardcoded localhost URLs found"
  exit 1
fi

# Prevent hardcoded Docker IP URLs
if grep -r "http://10.0.0.2" src/ --include="*.ts" --include="*.tsx"; then
  echo "ERROR: Hardcoded Docker IP URLs found"
  exit 1
fi

# Verify VITE_API_URL is set to /api
if ! grep 'VITE_API_URL=/api' docker-compose.yml; then
  echo "ERROR: VITE_API_URL not set to /api"
  exit 1
fi
```

---

**Last Updated**: December 1, 2025
**Status**: Enforced ✅
