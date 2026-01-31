# PillBow - User Guide

> **For Users:** How to use the PillBow medication tracking app.

<div align="center">
<img width="1200" height="475" alt="PillBow Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

---

## What is PillBow?

PillBow is a mobile-first medication reminder and tracking app designed for elderly users. It helps you:

- ✅ Know what medications to take today
- ✅ Track what you've taken in the past
- ✅ Plan upcoming medication schedules

---

## Quick Start

### Running Locally

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up API key** (optional, for AI medication scanning):
   - Create `.env.local` file
   - Add: `GEMINI_API_KEY=your_key_here`

3. **Start the app:**

   ```bash
   npm run dev
   ```

   Opens at http://localhost:3001

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

---

## Using the App

### First Time Setup

1. **Welcome Screen:** You'll see the PillBow logo and welcome message
2. **Accept Terms:** Check the Terms & Conditions checkbox
3. **Choose:**
   - **Try with Sample Vitamins** - Pre-loaded example data
   - **Add My Medication** - Start fresh with your own meds

### Main Timeline Screen

The main screen shows a vertical timeline of days:

- **Scroll up** to see past dates
- **Scroll down** to see future dates
- **Today** is highlighted in the middle
- **Tap any day** to open detailed view

### Reading Day Cards

Each day card shows:

- 📅 **Date and day name** (Mon, Tue, etc.)
- 🟦 **Colored time bars** - one bar per medication time
- 💊 **Type icons** - emoji showing what kind (pill, injection, etc.)
- **Badge** - shows total medication count for that day

**Color meanings:**

- 🟦 Blue bar = morning medication
- 🟩 Green bar = afternoon medication
- 🟨 Yellow bar = evening medication

### Adding Medications

#### Method 1: Manual Entry

1. Tap the **+ button** (bottom right)
2. Select **"Manual Entry"**
3. Fill in:
   - 💊 **Medicine Name** (e.g., "Aspirin")
   - 💪 **Strength** (e.g., "500 mg")
   - 💊 **Type** - Select pill shape/icon
   - 🎨 **Color** - Choose a color
   - ⏰ **Times** - When to take it (e.g., 08:00, 20:00)
   - 📅 **Start Date** - When to begin
   - 📅 **End Date** (optional) - When to stop
4. Tap **"Add Medicine"**

#### Method 2: AI Scan (Requires API Key)

1. Tap the **+ button**
2. Select **"Scan Medication"**
3. Take a photo of medication box/label
4. AI extracts name, dosage, etc.
5. Review and confirm
6. Tap **"Add Medicine"**

### Adding Appointments (Not Medications)

For doctor visits, dental appointments, etc.:

1. Tap **+ button** → Manual Entry
2. Select a **special icon:**
   - 🩻 **Stethoscope** - Doctor visit
   - 🚑 **Hospital** - Hospital appointment
   - 🪥 **Tooth** - Dental visit
3. Notice:
   - Form says "Event Name" (not "Medicine Name")
   - No "Strength" field appears
   - Button says "Add Event" (not "Add Medicine")
4. Fill in appointment details
5. Tap **"Add Event"**

### Tracking Doses

#### Mark as Taken

1. Tap a day card to open details
2. Find the medication
3. Tap the **toggle switch** ON (right side)
4. Pill shows ✅ green checkmark

#### Mark as Skipped

1. Open day details
2. Tap toggle switch OFF
3. Pill shows ❌ red X

#### View Status

- **Green checkmark** ✅ = Taken
- **Red X** ❌ = Skipped
- **Gray/empty** = Not yet recorded

**Important:** You can only change status for today and future dates. Past dates are read-only.

### Editing Medications

#### Edit for Today Only

1. Open today's card
2. Tap a medication pill
3. Select **"Edit"**
4. Make changes (time, dosage, etc.)
5. Select **"Today only"**
6. Tap **"Save"**

Result: Only today changes; tomorrow stays the same.

#### Edit from Today Forward

1. Follow same steps as above
2. Select **"From today forward"**
3. Tap **"Save"**

Result: Today + all future dates updated.

#### Stop Taking Medication

1. Tap medication → Edit
2. Select **"Stop"**
3. Choose when to stop:
   - "Stop from tomorrow"
   - "Stop from next week"
   - Custom date
4. Confirm

Result: Medication disappears from timeline after selected date.

#### Delete Medication Completely

1. Tap medication → Edit
2. Select **"Delete"**
3. Confirm deletion

Result: Removed from all dates including history.

---

## Managing Multiple Users

### Add Family Member

1. Tap **user icon** in top header
2. Select **"Add Family Member"**
3. Choose:
   - 👤 **Avatar** - emoji representing them
   - 📝 **Name** - their name
   - 👨‍👩‍👧 **Relationship** - Parent, Child, Spouse, etc.
   - 🎨 **Color** - profile color
4. Tap **"Add"**

### Switch Users

1. Tap **user icon** dropdown
2. Select different user
3. Page reloads with their data

**Note:** Each user has completely separate medication data.

### Remove User

1. Go to **Settings** (⚙️ icon)
2. Find user in list
3. Tap **"Remove"**
4. Confirm deletion

---

## Settings & Preferences

Access settings via the **⚙️ icon** in top header.

### Available Options:

- 👥 **Manage Family Members** - Add/remove users
- 💊 **Manage Medications** - View all meds in list format
- 🔔 **Notifications** (future feature)
- 🌙 **Dark Mode** (future feature)
- 🗑️ **Clear All Data** - Factory reset

---

## Tips for Elderly Users

### Visual Design

- ✅ **Large text** - Easy to read
- ✅ **High contrast** - Clear visibility
- ✅ **Big buttons** - Easy to tap (48px minimum)
- ✅ **Simple icons** - Emoji everyone understands

### Best Practices

1. **Use colors consistently** - Same color = same medication
2. **Check timeline daily** - See what's due today
3. **Mark doses immediately** - Don't forget what you took
4. **Set simple schedules** - Morning, noon, evening
5. **Add caregiver as user** - They can help manage

---

## Troubleshooting

### App Shows Old Version After Update

**Solution:** You'll see an update banner at the top:

1. Banner says "New version available!"
2. Tap **"Update Now"**
3. App reloads with latest version

This happens automatically when updates are deployed.

### Medication Not Showing on Certain Days

**Check:**

- ✅ Is it within the start/end date range?
- ✅ If "Days of Week" is set, does it include that day?
- ✅ Did someone edit it with "today only" scope?

### Lost Data After Switching Users

**This is normal!** Each user has separate data. Switch back to see your medications again.

### Can't Edit Yesterday's Doses

**This is intentional.** Past dates are read-only to prevent accidental changes. Only today and future can be edited.

---

## Deployment

### Deploy to Web

1. **Build:**

   ```bash
   npm run build
   ```

2. **Deploy `dist/` folder to:**
   - **Netlify:** `netlify deploy --prod --dir=dist`
   - **Vercel:** `vercel --prod`
   - **GitHub Pages:** Push `dist/` to gh-pages branch
   - **Any static host:** Upload all files from `dist/`

### PWA Installation

Users can install as app:

1. Visit the website
2. Browser shows "Install" prompt
3. Tap "Install"
4. App appears on home screen like native app

Works on:

- ✅ iOS (Safari)
- ✅ Android (Chrome)
- ✅ Desktop (Chrome, Edge)

---

## Support & Resources

- **Architecture docs:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Testing guide:** [TESTING.md](TESTING.md)
- **Future plans:** [ROADMAP.md](ROADMAP.md)
- **Report bugs:** Open an issue in the repository

---

_Last updated: January 31, 2026_
