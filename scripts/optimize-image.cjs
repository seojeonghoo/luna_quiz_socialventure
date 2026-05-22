const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = path.resolve(__dirname, '..', 'public', 'socialventure.jpg');
const backupsDir = path.resolve(__dirname, '..', 'backups');
const backup = path.resolve(backupsDir, `socialventure.backup.${Date.now()}.jpg`);
const tmp = path.resolve(__dirname, '..', 'scripts', 'socialventure.tmp.jpg');

(async () => {
  try {
    if (!fs.existsSync(src)) {
      console.error('Source file not found:', src);
      process.exit(1);
    }

    // ensure backups directory exists and create backup outside `public`
    fs.mkdirSync(backupsDir, { recursive: true });
    fs.copyFileSync(src, backup);
    console.log('Backup created:', backup);

    // optimize: resize to max width 1200, keep aspect ratio, compress
    // disable sharp's input pixel limit for very large images
    await sharp(src, { limitInputPixels: false })
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tmp);

    // replace original
    fs.renameSync(tmp, src);
    console.log('Optimized image written to:', src);
    process.exit(0);
  } catch (err) {
    console.error('Error optimizing image:', err);
    process.exit(1);
  }
})();
