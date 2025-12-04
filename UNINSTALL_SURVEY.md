# Tab Goblin - Uninstall Survey

## Purpose
Collect feedback from users who uninstall the extension to improve future versions.

## Survey URL Setup

The manifest currently points to: `https://forms.gle/TabGoblinUninstall`

**To create the actual survey:**

1. **Go to Google Forms**: https://forms.google.com/
2. **Create a new form titled**: "Tab Goblin - Feedback"
3. **Add these questions:**

### Question 1: Why did you uninstall Tab Goblin?
- Type: Multiple choice
- Options:
  - Too annoying/distracting
  - Used too much memory/resources
  - Didn't like the design
  - Didn't find it useful
  - Found a better alternative
  - Just trying it out (testing)
  - Other (with text field)

### Question 2: How long did you use Tab Goblin?
- Type: Multiple choice
- Options:
  - Less than 1 day
  - 1-7 days
  - 1-4 weeks
  - 1+ months

### Question 3: What feature did you use most?
- Type: Multiple choice
- Options:
  - Just watched the goblin
  - Actively tried to close tabs
  - Checked stats/achievements
  - Never really used it
  - Other

### Question 4: What would have made you keep it?
- Type: Paragraph text
- Allow open-ended feedback

### Question 5: Would you recommend Tab Goblin to a friend?
- Type: Linear scale
- 1 (Not at all) to 5 (Definitely)

### Question 6: Any other feedback?
- Type: Paragraph text
- Optional

## After Survey is Created

1. Get the shareable link from Google Forms
2. Copy the short URL (forms.gle/xxxxx)
3. Update `public/manifest.json`:
   ```json
   "uninstall_url": "https://forms.gle/YOUR_ACTUAL_LINK"
   ```

## Data Collection

Survey responses will help identify:
- Common pain points
- Feature requests
- Performance issues
- UX problems
- Market fit validation

Review responses monthly to guide development priorities.

