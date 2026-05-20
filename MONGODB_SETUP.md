# MongoDB Setup — Trip with uz

The site now stores ALL admin data in MongoDB instead of JSON files:
enquiries, packages, bookings, blogs, ads, destinations, seasons, admin
accounts, and (next phase) users with permissions.

This is a 10-minute one-time setup. Follow it once, then forget.

---

## 1. Create a free MongoDB Atlas cluster (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up.
2. Pick the **M0 Free** tier (512 MB, no expiry).
3. Region: choose **Mumbai (ap-south-1)** for lowest latency from India.
4. Name the cluster anything — e.g. `tripwithuz`.
5. Click **Create Deployment**.

Atlas will then walk you through two more steps:

### Database user
- Username: `tripwithuz_app` (or anything)
- Password: click **Autogenerate Secure Password** → **copy and save it**

### Network access
- Click **Add My Current IP Address** so your laptop can connect.
- For the deployed server (Render), also add `0.0.0.0/0` (Allow from anywhere).
  Atlas is still safe because access requires the username + password.

### Get the connection string
- Click **Connect** on your cluster → **Drivers**.
- Copy the URI. It looks like:
  ```
  mongodb+srv://tripwithuz_app:<password>@tripwithuz.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=tripwithuz
  ```
- Replace `<password>` with the password you saved above.

---

## 2. Wire it into your local server

Open `server/.env` and set:

```env
MONGODB_URI=mongodb+srv://tripwithuz_app:YOUR_PASSWORD@tripwithuz.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=tripwithuz
```

Install the new dependency:

```bash
cd server
npm install
```

Run the migration to copy your existing JSON data into Atlas:

```bash
node scripts/migrate-json-to-mongo.js
```

You should see lines like:
```
[migrate] connecting to tripwithuz @ mongodb+srv://...
[migrate] packages: 14 records (14 new, 0 updated)
[migrate] enquiries: 0 records ...
[migrate] done — 32 document(s) total
```

Rerunning the script is **safe** — it upserts by `id`, so nothing duplicates.
Use `--force` only if you want to wipe Mongo and start over from the JSON.

---

## 3. Start the server

```bash
npm run dev
```

You should see:
```
[mongo] connected to tripwithuz
[server] Listening on http://localhost:5000 ...
```

The site now reads/writes everything from Atlas. Try creating a booking from
the website — refresh `/admin` and it should still be there even after you
restart the server.

---

## 4. Deploy to Render

1. In the Render dashboard, open your `tripwithuz-api` service → **Environment**.
2. Add a new env var:
   - Key: `MONGODB_URI`
   - Value: the same Atlas URI as your local .env
3. (Optional) Add `MONGODB_DB=tripwithuz` if you want to be explicit.
4. Click **Save Changes** — Render redeploys automatically.

Done. The free tier no longer wipes your data, because the data isn't on
the container disk anymore — it's in Atlas.

---

## Tips

- **View / edit data in a UI:** Atlas dashboard → **Browse Collections**.
  Or download MongoDB Compass (https://www.mongodb.com/products/compass)
  and connect with the same URI.
- **Backups:** Atlas takes daily snapshots automatically on the free tier.
  You can also run `GET /api/admin/backup` for a JSON download.
- **Local-only dev (no Atlas yet):** `docker-compose up mongo` spins up a
  local Mongo on port 27017. Leave `MONGODB_URI=mongodb://localhost:27017`
  and develop offline.

---

## Troubleshooting

**`MongoServerSelectionError: connection timed out`** → IP not allow-listed
in Atlas Network Access, or the URI password is wrong.

**`MongoServerError: bad auth`** → password has special chars like `@` or `:`
that must be URL-encoded. Easier fix: regenerate a password with only
alphanumerics.

**Server starts but `/api/packages` is empty** → you skipped the migration
step. Run `node scripts/migrate-json-to-mongo.js` from the server dir.
