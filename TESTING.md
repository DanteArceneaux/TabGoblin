# Testing Tab Goblin Extension

## How to Load the Extension in Chrome

1. **Build the Extension**
   ```bash
   npm run build
   ```

2. **Copy Sprites to dist folder**
   ```bash
   mkdir dist/sprites
   copy sprites\*.* dist\sprites\
   ```
   (On Mac/Linux use: `cp sprites/* dist/sprites/`)

3. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

4. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

5. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `dist` folder in this project
   - The extension should now appear in your extensions list

6. **Open the Side Panel**
   - Click the Tab Goblin icon in your toolbar
   - Or right-click any tab and select "Tab Goblin"
   - The side panel should open showing your goblin!

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Side panel opens and shows the goblin
- [ ] Welcome modal appears on first run
- [ ] Tab count updates when opening/closing tabs
- [ ] Closing tabs triggers the "eating" animation
- [ ] Health bar reflects tab count (decreases with many tabs)
- [ ] XP bar increases when closing tabs
- [ ] Sound toggle works (if enabled)
- [ ] Goblin evolves at level thresholds
- [ ] Goblin transforms based on tab count (Happy → Greedy → Corrupt)

## Development Mode

For development with hot reload:
```bash
npm run dev
```

Note: In dev mode, you'll need to manually reload the extension in Chrome after each change.

## Common Issues

**Sprites don't show:**
- Make sure sprites are copied to `dist/sprites/` folder
- Check browser console for 404 errors

**Side panel doesn't open:**
- Check `chrome://extensions/` for errors
- Ensure manifest.json has correct permissions

**Tab count not updating:**
- Check background service worker console (click "service worker" link in extensions page)
- Background worker may have crashed - reload the extension

