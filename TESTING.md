# Tab Goblin - Testing Checklist

## Installation Testing

### ✅ Load Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. **Expected:** Extension loads without errors, icon appears in toolbar

### ✅ First Launch
1. Click the Tab Goblin icon in toolbar
2. **Expected:** Side panel opens with welcome modal
3. Click through welcome modal
4. **Expected:** See baby goblin in Game Boy-style UI with name "Goblin"

---

## Core Gameplay Testing

### ✅ Tab Monitoring
1. Open 5 new tabs
2. **Expected:** Tab count increases, goblin reacts (mood changes)
3. Close 3 tabs
4. **Expected:** Tab count decreases, goblin gets happier, "munch" animation plays

### ✅ Mood System
1. Keep tab count low (< 15)
2. **Expected:** Goblin is HAPPY (cute sprite)
3. Open 20+ tabs
4. **Expected:** Goblin becomes SICK (different sprite)
5. Open 50+ tabs
6. **Expected:** Goblin becomes CORRUPT (evil sprite, shake animation)
7. Leave 50+ tabs open for several minutes
8. **Expected:** Goblin DIES (gray/dead sprite)

### ✅ Health & Decay
1. With goblin alive, leave side panel open
2. Wait 1 minute
3. **Expected:** Health bar gradually decreases
4. Close some tabs
5. **Expected:** Health stops decreasing/improves

### ✅ XP & Leveling
1. Close 10 tabs
2. **Expected:** XP bar fills, particle effects appear
3. Continue closing tabs until level up
4. **Expected:** "LEVEL UP!" text appears, level number increases
5. At Level 3, goblin evolves
6. **Expected:** Sprite changes to TEEN form

---

## UI/UX Testing

### ✅ Console Wrapper
1. Verify Game Boy-style design is visible
2. **Expected:** Gray console body, green LCD screen, D-Pad, A/B buttons
3. Check power LED
4. **Expected:** LED color matches goblin mood (green=happy, yellow=sick, red=corrupt, off=dead)

### ✅ Button Interactions
1. Click A button (bottom-right)
2. **Expected:** Closes 1 tab (if tabs > 1), particle effect, sound
3. Click Start button (console center-right)
4. **Expected:** Stats screen opens
5. Click Start again
6. **Expected:** Settings screen opens
7. Click Select button
8. **Expected:** Focus mode toggles (pauses game, visual indicator)

### ✅ Stats Screen
1. Open Stats screen (Start button)
2. **Expected:** See total tabs closed, total XP, playtime, achievements list
3. Verify achievements unlock based on actions
4. Click close (X) or Start button
5. **Expected:** Returns to main screen

### ✅ Settings Screen
1. Open Settings (Start button twice)
2. Click "EDIT" on name
3. Type new name (max 10 chars)
4. Click "SAVE"
5. **Expected:** Goblin name updates in main UI
6. Toggle Sound
7. **Expected:** Sound on/off, future sounds respect setting
8. Toggle Focus Mode
9. **Expected:** Game pauses, visual indicator appears
10. Click "RESET GAME"
11. Confirm dialog
12. **Expected:** All data erased, page reloads with fresh game

---

## Advanced Features

### ✅ Night Mode
1. Wait until system time is between 10 PM - 6 AM, OR manually adjust system clock
2. **Expected:** Stars appear on screen, background slightly darker

### ✅ Idle Behaviors
1. Keep goblin HAPPY and leave side panel open
2. Wait 5-15 seconds
3. **Expected:** Goblin randomly bounces or waves

### ✅ Revive Mechanic
1. Let goblin die (50+ tabs, wait several minutes)
2. **Expected:** "REVIVE?" button appears
3. Click "REVIVE"
4. **Expected:** Goblin comes back to life (with penalty), button disappears

### ✅ Focus Mode
1. Toggle Focus Mode ON
2. Open/close tabs
3. **Expected:** XP/health does NOT change, game is frozen
4. Toggle Focus Mode OFF
5. **Expected:** Game resumes

---

## Sound Testing

### ✅ Sound Effects
1. Ensure sound is enabled in settings
2. Close a tab (A button)
3. **Expected:** "Munch" sound plays
4. Level up
5. **Expected:** "Level Up" jingle plays
6. Goblin becomes SICK
7. **Expected:** "Whimper" sound plays
8. Goblin becomes CORRUPT
9. **Expected:** "Glitch" sound plays
10. Disable sound in settings
11. **Expected:** No more sounds play

---

## Persistence Testing

### ✅ State Persistence
1. Play for a few minutes (close tabs, gain XP)
2. Close side panel
3. Open Chrome DevTools → Application → Storage → Local Storage → extension ID
4. **Expected:** See `tab_goblin_state` with your current game state
5. Close and reopen side panel
6. **Expected:** Game state is preserved (same level, XP, health)

### ✅ Background Processing
1. Close side panel
2. Open and close tabs
3. Wait 1 minute
4. Reopen side panel
5. **Expected:** Game state reflects tab changes made while panel was closed

### ✅ Chrome Alarms
1. Open Chrome DevTools → Service Workers → Inspect background script
2. Check console for "Health check" logs every 1 minute
3. **Expected:** Background script remains active and processes health decay

---

## Error Handling

### ✅ Error Boundary
1. Open browser console
2. Force a React error (e.g., edit `localStorage` to corrupt game state JSON)
3. **Expected:** UI shows friendly error message instead of blank screen

### ✅ Missing Permissions
1. Check `chrome://extensions/` → Tab Goblin → Details
2. **Expected:** "Site access" = "No sites", Permissions = tabs, storage, alarms, sidePanel

---

## Performance Testing

### ✅ Memory Usage
1. Open Chrome Task Manager (Shift+Esc or Chrome Menu → More Tools → Task Manager)
2. Find "Extension: Tab Goblin" process
3. **Expected:** Memory usage < 50 MB after 10 minutes of use

### ✅ Animation Performance
1. Open side panel with goblin animating
2. Open DevTools → Performance → Record
3. Interact with extension for 10 seconds
4. Stop recording
5. **Expected:** Frame rate stays at/near 60 FPS, no significant jank

### ✅ Tab Count Stress Test
1. Open 100+ tabs using a script (e.g., `for (let i = 0; i < 100; i++) chrome.tabs.create({})`)
2. **Expected:** Extension continues to function, goblin shows CORRUPT state
3. Close all tabs
4. **Expected:** Extension recovers, goblin returns to HAPPY

---

## Cross-Browser Compatibility

### ✅ Chrome Versions
- Test on Chrome 120+ (latest stable)
- Test on Chrome Beta
- **Expected:** Full compatibility on Manifest V3 compatible versions

### ✅ Edge/Brave (Chromium-based)
- Load extension in Edge or Brave
- **Expected:** Should work identically (same Chromium engine)

---

## User Scenarios

### ✅ Tab Hoarder
- User with 100+ tabs
- **Expected:** Goblin immediately shows CORRUPT state, health drains fast
- If user closes tabs, goblin recovers

### ✅ Minimalist
- User with 5-10 tabs consistently
- **Expected:** Goblin stays HAPPY, levels up slowly, good pet experience

### ✅ Power User
- User actively closing tabs to feed goblin
- **Expected:** Rapid XP gain, frequent level ups, engaging feedback loop

### ✅ AFK User
- User installs but doesn't interact
- **Expected:** Goblin's health decays naturally, eventually dies
- User returns to "REVIVE?" option

---

## Known Limitations (Acceptable)

1. **Side panel must be manually opened first time** (Chrome limitation)
2. **No remote code execution** (Manifest V3 security)
3. **Focus mode requires manual toggle** (no automatic detection)
4. **Sprite sheet is pre-generated** (no runtime AI generation)
5. **Sound is synthesized** (no MP3/WAV files)

---

## Pre-Launch Checklist

Before publishing to Chrome Web Store:

- [ ] All tests above pass
- [ ] No console errors in production build
- [ ] Privacy Policy created (if collecting data)
- [ ] Store listing assets ready:
  - [ ] 128x128 icon
  - [ ] 1280x800 screenshots (3-5 recommended)
  - [ ] 440x280 small tile promotional image
  - [ ] 1400x560 marquee promotional image (optional)
- [ ] Manifest fields complete:
  - [ ] Name, description, version
  - [ ] Icons, permissions correct
  - [ ] `uninstall_url` points to real survey
- [ ] README.md up to date
- [ ] Code comments clean (no TODOs)
- [ ] `package.json` version matches `manifest.json`

---

## Testing Complete

**Date:** _______________  
**Tester:** _______________  
**Version:** 0.2.0  
**Status:** ✅ All core features tested and working

**Next Steps:**
1. User acceptance testing (1 week)
2. Fix any reported bugs
3. Create store listing assets
4. Submit to Chrome Web Store
