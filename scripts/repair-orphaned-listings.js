/**
 * Stay-Scape: Safe Orphaned Listing Recovery & Audit Tool
 * 
 * Usage:
 *   1. Audit current status (read-only):
 *      node scripts/repair-orphaned-listings.js --audit
 * 
 *   2. Create a backup of all listings:
 *      node scripts/repair-orphaned-listings.js --backup-only
 * 
 *   3. Safely repair orphaned listings by assigning to a chosen verified user:
 *      node scripts/repair-orphaned-listings.js --assign-to <username|userId>
 * 
 *   4. Restore listings from a backup file:
 *      node scripts/repair-orphaned-listings.js --restore <path/to/backup.json>
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Listing = require('../models/listings.js');
const User = require('../models/user.js');

const dbUrl = process.env.ATLAS_DB;

if (!dbUrl) {
    console.error("Error: ATLAS_DB connection string not found in environment variables.");
    process.exit(1);
}

async function connectDB() {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000
    });
    console.log("Connected to MongoDB successfully.\n");
}

function ensureBackupsDir() {
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    return backupDir;
}

async function createBackup() {
    const backupDir = ensureBackupsDir();
    const allListings = await Listing.find({}).lean();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `listings-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(allListings, null, 2), 'utf-8');
    console.log(`[BACKUP CREATED] ${allListings.length} listings safely backed up to:\n  ${backupFile}\n`);
    return backupFile;
}

async function getOrphanedListings() {
    const users = await User.find({}).lean();
    const userMap = new Map();
    users.forEach(u => userMap.set(u._id.toString(), u));

    const allListings = await Listing.find({});
    const orphaned = [];
    const valid = [];

    for (const listing of allListings) {
        if (!listing.owner) {
            orphaned.push({ listing, reason: "missing_owner_field", ownerId: null });
        } else {
            const ownerStr = listing.owner.toString();
            if (!userMap.has(ownerStr)) {
                orphaned.push({ listing, reason: "nonexistent_user", ownerId: ownerStr });
            } else {
                valid.push({ listing, owner: userMap.get(ownerStr) });
            }
        }
    }

    return { users, userMap, allListings, orphaned, valid };
}

async function runAudit() {
    const { users, allListings, orphaned, valid } = await getOrphanedListings();

    console.log("==================================================");
    console.log("             STAY-SCAPE LISTINGS AUDIT            ");
    console.log("==================================================");
    console.log(`Total Listings in Database : ${allListings.length}`);
    console.log(`Listings with Valid Owner  : ${valid.length}`);
    console.log(`Orphaned Listings          : ${orphaned.length}`);
    console.log("==================================================\n");

    if (orphaned.length > 0) {
        console.log("--- ORPHANED LISTINGS FOUND ---");
        orphaned.forEach(({ listing, reason, ownerId }, idx) => {
            console.log(` ${idx + 1}. ID: ${listing._id}`);
            console.log(`    Title    : "${listing.title}"`);
            console.log(`    Location : ${listing.location}, ${listing.country}`);
            console.log(`    Issue    : ${reason} (referenced owner: ${ownerId || 'null'})`);
            console.log("");
        });

        console.log("--- AVAILABLE ACTIVE USERS FOR ADOPTION ---");
        users.forEach(u => {
            console.log(` - Username: "${u.username}", Email: "${u.email}", Role: "${u.role}", ID: ${u._id}`);
        });
        console.log("\nTo assign these orphaned listings to an existing user, run:");
        console.log("  node scripts/repair-orphaned-listings.js --assign-to <username>\n");
        console.log("A complete backup will automatically be generated before any database update.");
    } else {
        console.log("✓ All listings have valid, existing owners. No repairs needed.");
    }
}

async function runAssign(targetIdentifier) {
    if (!targetIdentifier) {
        console.error("Error: Please provide a username or User ObjectId to assign orphaned listings to.");
        console.error("Usage: node scripts/repair-orphaned-listings.js --assign-to <username|userId>");
        return;
    }

    const { users, orphaned } = await getOrphanedListings();

    if (orphaned.length === 0) {
        console.log("✓ No orphaned listings found. Database is already consistent.");
        return;
    }

    // Find target user by username or ObjectId
    const targetUser = users.find(u =>
        u.username.toLowerCase() === targetIdentifier.toLowerCase() ||
        u._id.toString() === targetIdentifier
    );

    if (!targetUser) {
        console.error(`Error: User "${targetIdentifier}" not found in database.`);
        console.log("\nAvailable users:");
        users.forEach(u => console.log(` - Username: "${u.username}", ID: ${u._id}, Role: "${u.role}"`));
        return;
    }

    console.log(`Target User Confirmed: ${targetUser.username} (${targetUser.email}, ID: ${targetUser._id})`);
    console.log(`Found ${orphaned.length} orphaned listings to repair.\n`);

    // 1. Create backup first
    await createBackup();

    // 2. Perform safe update
    let updatedCount = 0;
    for (const { listing } of orphaned) {
        listing.owner = targetUser._id;
        await listing.save();
        updatedCount++;
        console.log(`✓ Repaired [${updatedCount}/${orphaned.length}]: "${listing.title}" (ID: ${listing._id}) -> Owner: ${targetUser.username}`);
    }

    console.log(`\nSUCCESS: ${updatedCount} orphaned listings successfully assigned to @${targetUser.username}.`);
}

async function runRestore(backupFilePath) {
    if (!backupFilePath || !fs.existsSync(backupFilePath)) {
        console.error(`Error: Backup file not found at "${backupFilePath}".`);
        return;
    }

    console.log(`Reading backup file from: ${backupFilePath}`);
    const data = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));

    // Create current state backup before restoring
    await createBackup();

    let restoredCount = 0;
    for (const item of data) {
        await Listing.findByIdAndUpdate(item._id, { owner: item.owner });
        restoredCount++;
    }

    console.log(`SUCCESS: Restored ${restoredCount} listings to their backed-up state.`);
}


async function runTransfer(sourceUsername, targetUsername) {
    if (!sourceUsername || !targetUsername) {
        console.error(
            "Usage: node scripts/repair-orphaned-listings.js --transfer-to <sourceUsername> <targetUsername>"
        );
        return;
    }

    const sourceUser = await User.findOne({
        username: sourceUsername
    });

    const targetUser = await User.findOne({
        username: targetUsername
    });

    if (!sourceUser || !targetUser) {
        console.error("Error: Source or target user not found.");

        if (!sourceUser) {
            console.error(`Source user "${sourceUsername}" does not exist.`);
        }

        if (!targetUser) {
            console.error(`Target user "${targetUsername}" does not exist.`);
        }

        return;
    }

    if (sourceUser._id.equals(targetUser._id)) {
        console.error("Error: Source and target users must be different.");
        return;
    }

    const listings = await Listing.find({
        owner: sourceUser._id
    });

    if (listings.length === 0) {
        console.log(`No listings found for "${sourceUsername}".`);
        return;
    }

    console.log(`Source user: ${sourceUser.username}`);
    console.log(`Target user: ${targetUser.username}`);
    console.log(`Listings to transfer: ${listings.length}`);

    await createBackup();

    const result = await Listing.updateMany(
        { owner: sourceUser._id },
        { $set: { owner: targetUser._id } }
    );

    console.log(
        `SUCCESS: Transferred ${result.modifiedCount} listings from @${sourceUser.username} to @${targetUser.username}.`
    );
}


async function main() {
    const args = process.argv.slice(2);

    try {
        await connectDB();

        if (args.includes('--backup-only')) {
            await createBackup();
        } else if (args.includes('--assign-to')) {
            const targetIdx = args.indexOf('--assign-to') + 1;
            const target = args[targetIdx];
            await runAssign(target);
        } else if (args.includes('--restore')) {
            const targetIdx = args.indexOf('--restore') + 1;
            const backupFile = args[targetIdx];
            await runRestore(backupFile);

        } else if (args.includes('--transfer-to')) {
            const targetIdx = args.indexOf('--transfer-to') + 1;
            const sourceUsername = args[targetIdx];
            const targetUsername = args[targetIdx + 1];

            await runTransfer(sourceUsername, targetUsername);

        } else {
            // Default to audit
            await runAudit();
        }
    } catch (err) {
        console.error("An error occurred during operation:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
}

main();
