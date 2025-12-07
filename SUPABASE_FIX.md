# ⚠️ IMPORTANT: Supabase Database Configuration

## Update Your DATABASE_URL on Render

Your current `DATABASE_URL` needs to be updated to disable prepared statements for pgBouncer compatibility.

### Current Format (Has Issues):
```
postgresql://user:pass@host:port/db?pgbouncer=true
```

### Required Format (Fixed):
```
postgresql://user:pass@host:port/db?pgbouncer=true&connection_limit=1&pool_timeout=0
```

## 📋 Steps to Fix on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your Buztle backend service
3. Go to **Environment** tab
4. Find `DATABASE_URL` variable
5. **Add to the end** of your URL: `&connection_limit=1&pool_timeout=0`

### Example:
**Before:**
```
postgresql://postgres.abc:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**After:**
```
postgresql://postgres.abc:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0
```

6. Click **Save Changes**
7. Render will auto-redeploy

## Why This Is Needed

Supabase uses pgBouncer for connection pooling, which doesn't support PostgreSQL prepared statements. Adding these parameters tells Prisma to:
- Limit connections to 1 per instance
- Disable connection pooling timeout
- This prevents the "prepared statement already exists" error

## ✅ After Update

Once you update the `DATABASE_URL` and Render redeploys, your login will work!

The rate limiter issue is already fixed in the code I just updated.
