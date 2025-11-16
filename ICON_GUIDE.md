# Icon Guide

## Converting SVG to PNG

The extension icon is provided as `icon.svg`. To create the required PNG format:

### Option 1: Using Inkscape (Recommended)
```bash
inkscape icon.svg --export-filename=icon.png --export-width=128 --export-height=128
```

### Option 2: Using ImageMagick
```bash
convert -background none -size 128x128 icon.svg icon.png
```

### Option 3: Using Online Tools
- Upload `icon.svg` to https://cloudconvert.com/svg-to-png
- Set output size to 128x128 pixels
- Download as `icon.png`

### Option 4: Using Node.js (sharp)
```bash
npm install sharp
node -e "require('sharp')('icon.svg').resize(128, 128).png().toFile('icon.png')"
```

## Icon Specifications

- **Size**: 128x128 pixels
- **Format**: PNG (with transparency)
- **Theme**: Black background with neon pink (#FF2DBE) accents
- **Design**: Cyberpunk/neon style with animated elements (SVG only)

Once you have `icon.png`, update `package.json`:
```json
{
  "icon": "icon.png"
}
```
