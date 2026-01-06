/* PLAYGROUND SCRIPT: SaaS Bot Maintenance
   Target: wa-saas-db
*/

// 1. Select the database
use('wa-saas-db');

// 2. Clear existing test data (WARNING: Only for development!)
// db.users.drop(); 

// 3. Create a Test User with different settings
db.users.insertOne({
  email: "admin@test.com",
  subscription: {
    plan: "pro",
    expiresAt: new Date("2026-12-31")
  },
  botSettings: {
    autoViewStatus: true,
    aiParaphrase: true,
    dailyLimit: 500
  },
  whatsappSession: "session-admin-001",
  createdAt: new Date()
});

// 4. Create a Standard User
db.users.insertOne({
  email: "user@standard.com",
  subscription: {
    plan: "free",
    expiresAt: new Date("2026-02-01")
  },
  botSettings: {
    autoViewStatus: false,
    aiParaphrase: false,
    dailyLimit: 50
  },
  whatsappSession: "session-standard-002",
  createdAt: new Date()
});

// 5. TEST QUERY: Find all users who have "Auto-View Status" enabled
print("--- USERS WITH AUTO-VIEW ENABLED ---");
const activeAutoViewers = db.users.find({ "botSettings.autoViewStatus": true }).toArray();
printjson(activeAutoViewers);

// 6. TEST QUERY: Find users whose subscription expires soon (next 30 days)
print("--- EXPIRING SOON ---");
const today = new Date();
const nextMonth = new Date();
nextMonth.setDate(today.getDate() + 30);

const expiringSoon = db.users.find({
  "subscription.expiresAt": { $gte: today, $lte: nextMonth }
}).toArray();
printjson(expiringSoon);

// 7. Check total user count
const totalUsers = db.users.countDocuments();
print(`Total Users in System: ${totalUsers}`);