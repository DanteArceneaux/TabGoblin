# Tab Goblin - Launch Checklist

## Pre-Launch Requirements

### ✅ Code Readiness
- [x] All core features implemented
- [x] No critical bugs
- [x] TypeScript compiles without errors
- [x] Production build successful
- [x] All linter warnings addressed
- [x] Error handling implemented (ErrorBoundary)
- [x] Performance optimized (requestAnimationFrame, debouncing)

### 📝 Store Listing Assets (TO DO)

#### Required Assets
- [ ] **Extension Icon** (128x128)
  - Current: Generated from sprite (need to verify quality)
  - Should be: Clear, recognizable goblin face
  - Format: PNG, transparent background

- [ ] **Screenshots** (1280x800 minimum, up to 5)
  - Screenshot 1: Main UI with HAPPY goblin + tab counter
  - Screenshot 2: Stats screen showing achievements
  - Screenshot 3: CORRUPT goblin with many tabs warning
  - Screenshot 4: Level up animation/particle effects
  - Screenshot 5: Settings screen
  - **How to capture:** Use side panel, resize to standard size, screenshot with Game Boy frame visible

- [ ] **Small Promotional Tile** (440x280)
  - Feature: Cute goblin + "Tab Goblin" text + tagline
  - Style: Game Boy aesthetic
  - **Optional but recommended**

- [ ] **Marquee Promotional Image** (1400x560)
  - Feature: Goblin evolution stages (baby → teen → monster)
  - Tagline: "Your Tabs. Their Problem."
  - **Optional**

#### Store Listing Copy

**Name:**
```
Tab Goblin - Your Cute Tab Manager
```
(70 characters max)

**Short Description:**
```
A pixel-art pet that lives in your browser and judges your tab habits. Close tabs to keep your goblin happy!
```
(132 characters max)

**Detailed Description:**
```
🦎 Meet Your New Tab Goblin! 🦎

Tab Goblin is a cute pixel-art companion that lives in your Chrome side panel. But here's the catch: they HATE when you hoard tabs!

✨ HOW IT WORKS ✨
• Your goblin starts cute and cuddly
• Open too many tabs? They get SICK and SAD
• Hoard 50+ tabs? They turn into an EVIL MONSTER
• Neglect them? They DIE (don't worry, you can revive them)
• Close tabs to keep your goblin happy and healthy!

🎮 FEATURES 🎮
• Retro Game Boy-style UI with pixel art graphics
• Real-time tab monitoring and pet reactions
• XP system and evolution stages (Baby → Teen → Monster)
• Achievements to unlock
• Focus Mode to pause the game when you need to concentrate
• Chiptune sound effects (optional)
• Night mode with adorable stars ✨

📊 TRACK YOUR PROGRESS 📊
• See total tabs closed
• Monitor playtime
• Unlock achievements
• Watch your goblin evolve!

🎯 WHY TAB GOBLIN? 🎯
Tab hoarding is real. We've all opened 50+ tabs "just in case." But those tabs slow your browser, drain memory, and create chaos. Tab Goblin makes tab management FUN by giving you a companion who depends on your good habits.

💚 KEY BENEFITS 💚
✓ Reduces tab clutter naturally
✓ Improves browser performance
✓ Gamifies productivity
✓ Cute and non-intrusive
✓ Works entirely in your browser (no data collected)

🔒 PRIVACY 🔒
• All data stored locally on YOUR device
• No analytics, no tracking, no servers
• No personal information collected
• Open source coming soon!

🎨 AESTHETIC 🎨
Inspired by classic Game Boy games and 90s virtual pets (remember Tamagotchis?), Tab Goblin brings nostalgic pixel art to modern productivity.

📥 GETTING STARTED 📥
1. Install the extension
2. Click the Tab Goblin icon in your toolbar
3. Meet your new goblin friend!
4. Start closing tabs to keep them happy

Your goblin is waiting. Will you be a responsible tab parent? 🦎💚

---

Created with ❤️ by an indie developer who had 200 tabs open and needed an intervention.
```

**Category:**
```
Productivity
```

**Language:**
```
English
```

**Tags/Keywords:**
```
tabs, tab manager, productivity, pixel art, game, pet, companion, gamification, virtual pet, browser extension
```

### 📄 Legal Documents (TO DO)

#### Privacy Policy
- [ ] Create `PRIVACY_POLICY.md`
- [ ] Host on GitHub Pages or extension website
- [ ] Link in manifest and store listing
- **Template:**
```markdown
# Privacy Policy for Tab Goblin

Last Updated: [DATE]

## Data Collection
Tab Goblin does NOT collect, store, or transmit any personal data outside your device.

## Local Storage
All game data (pet state, statistics, settings) is stored locally using Chrome's storage API. This data never leaves your browser.

## Permissions
- **tabs**: To monitor tab count (we do NOT read tab content or URLs)
- **storage**: To save your game progress locally
- **alarms**: To run background tasks (health decay)
- **sidePanel**: To display the game UI

## Third-Party Services
Tab Goblin does not use any third-party analytics, tracking, or advertising services.

## Changes to Privacy Policy
We may update this policy. Changes will be posted with a new "Last Updated" date.

## Contact
For privacy questions: [YOUR EMAIL]
```

#### Terms of Service (Optional)
- [ ] Create if planning monetization
- [ ] Standard "provided as-is" disclaimer

### 🔗 Uninstall Survey
- [ ] Create Google Form (see `UNINSTALL_SURVEY.md`)
- [ ] Get actual forms.gle link
- [ ] Update `public/manifest.json` with real URL
- Current: `https://forms.gle/TabGoblinUninstall` (placeholder)

### 📦 Chrome Web Store Developer Account
- [ ] Register at https://chrome.google.com/webstore/devconsole
- [ ] Pay one-time $5 developer fee
- [ ] Verify developer identity

---

## Launch Steps

### 1. Final Testing (1-7 days)
- [ ] Test on clean Chrome profile
- [ ] Test on Windows, Mac, Linux
- [ ] Test with 0, 10, 50, 100+ tabs
- [ ] Have 2-3 friends beta test
- [ ] Fix any reported issues

### 2. Create Store Assets (2-3 hours)
- [ ] Take high-quality screenshots
- [ ] Design promotional tiles (use Figma/Canva/Photopea)
- [ ] Write final store listing copy
- [ ] Review all text for typos

### 3. Legal Compliance (1 hour)
- [ ] Write Privacy Policy
- [ ] Host Privacy Policy (GitHub Pages or gdocs)
- [ ] Create and link Google Form for uninstall survey
- [ ] Update manifest with real URLs

### 4. Package for Upload
```bash
# From project root:
npm run build
cd dist
zip -r ../tab-goblin-v0.2.0.zip .
# Or on Windows:
# Compress-Archive -Path dist\* -DestinationPath tab-goblin-v0.2.0.zip
```
- [ ] Create ZIP of `dist` folder
- [ ] Verify ZIP contains all files (manifest, icons, scripts, assets)
- [ ] Do NOT include source code or node_modules

### 5. Submit to Chrome Web Store
1. Go to https://chrome.google.com/webstore/devconsole
2. Click "New Item"
3. Upload `tab-goblin-v0.2.0.zip`
4. Fill in store listing:
   - Add screenshots
   - Add promotional tiles
   - Copy description
   - Set category to "Productivity"
   - Add Privacy Policy link
   - Select target audience (Everyone)
5. Set pricing: Free
6. Set distribution: Public
7. Submit for review

### 6. Post-Launch
- [ ] Monitor Chrome Web Store reviews
- [ ] Respond to user feedback within 48 hours
- [ ] Track uninstall survey responses
- [ ] Create GitHub repository (make public)
- [ ] Post on social media (Twitter, Reddit /r/ChromeExtensions, Product Hunt)
- [ ] Create demo GIF/video for marketing

---

## Marketing Strategy (Optional)

### Launch Day
- [ ] Post on Twitter/X with demo GIF
- [ ] Post on Reddit: /r/ChromeExtensions, /r/SideProject, /r/InternetIsBeautiful
- [ ] Submit to Product Hunt
- [ ] Post on Hacker News "Show HN"

### Week 1
- [ ] Collect initial feedback
- [ ] Fix any critical bugs (hotfix to v0.2.1 if needed)
- [ ] Engage with users who leave reviews

### Month 1
- [ ] Analyze usage (via Chrome Web Store stats)
- [ ] Review uninstall survey responses
- [ ] Plan v0.3.0 features based on feedback

---

## Version Roadmap

### v0.2.0 (Current - MVP)
- ✅ Core gameplay loop
- ✅ Goblin evolution
- ✅ Stats and achievements
- ✅ Game Boy UI
- ✅ Sound effects

### v0.3.0 (Future - Polish)
- [ ] More evolution paths (multiple creature types)
- [ ] Daily quests/challenges
- [ ] Customization (rename, color palettes)
- [ ] Export/import save data
- [ ] More achievements

### v0.4.0 (Future - Social)
- [ ] Leaderboards (optional)
- [ ] Share achievements
- [ ] Compare stats with friends

### v1.0.0 (Future - Monetization)
- [ ] Cosmetic shop (different creatures, skins, themes)
- [ ] Premium edition (one-time purchase, unlock all cosmetics)
- [ ] Donation/tip jar

---

## Success Metrics

### Week 1 Targets
- [ ] 100+ installs
- [ ] 4.0+ star rating
- [ ] < 10% uninstall rate

### Month 1 Targets
- [ ] 1,000+ installs
- [ ] 4.5+ star rating
- [ ] 10+ positive reviews
- [ ] Featured on at least one blog/newsletter

### Long-term Goals
- [ ] 10,000+ users
- [ ] Profitable ($100+/month if monetized)
- [ ] Community engagement (Discord/subreddit)

---

## Emergency Contacts

**Chrome Web Store Support:**  
https://support.google.com/chrome_webstore/

**If Extension is Rejected:**
- Common reasons: Missing privacy policy, unclear permissions, misleading description
- Fix and resubmit within 7 days

**If Extension is Removed:**
- Appeal immediately via developer console
- Usually happens due to policy violation (rare if followed guidelines)

---

## Current Status

**Version:** 0.2.0  
**Code Status:** ✅ Complete and tested  
**Store Assets:** ⏳ Need to create  
**Legal Docs:** ⏳ Need to create  
**Ready to Launch:** Not yet (need assets + legal)  

**Estimated Time to Launch:** 1-2 days (if assets created today)  
**Recommended Launch Date:** After 1 week of beta testing

---

**GOOD LUCK! Your Tab Goblin is ready to meet the world! 🦎💚**

