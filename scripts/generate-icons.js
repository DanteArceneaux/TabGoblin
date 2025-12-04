/**
 * Generate simple extension icons
 * Creates basic pixel art goblin icons at 16, 48, 128px
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  try {
    // Use the baby goblin from the sprite sheet (top-left cell)
    const spriteSheet = path.join(__dirname, '../sprites/Gemini_Generated_Image_png.png');
    
    // Extract just the first baby goblin (128x128 from top-left)
    const babyGoblin = sharp(spriteSheet)
      .extract({ left: 0, top: 0, width: 128, height: 128 });

    // Remove pink background
    const { data, info } = await babyGoblin.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (r > 180 && g < 80 && b > 140 && b < 200) {
        data[i + 3] = 0; // Transparent
      }
    }

    const processedGoblin = sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 }
    }).png();

    // Generate 128x128
    await processedGoblin
      .resize(128, 128, { kernel: 'nearest' })
      .toFile(path.join(__dirname, '../public/icon-128.png'));
    console.log('✅ Created icon-128.png');

    // Generate 48x48
    await processedGoblin
      .clone()
      .resize(48, 48, { kernel: 'nearest' })
      .toFile(path.join(__dirname, '../public/icon-48.png'));
    console.log('✅ Created icon-48.png');

    // Generate 16x16
    await processedGoblin
      .clone()
      .resize(16, 16, { kernel: 'nearest' })
      .toFile(path.join(__dirname, '../public/icon-16.png'));
    console.log('✅ Created icon-16.png');

    console.log('\n✨ All icons generated successfully!');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();

