# Image Assets Guide

## Current Image Sources

All images in this project are currently sourced from **Unsplash** (external CDN).

### Image Locations by Component

#### 1. **Hero Section** (`src/components/Hero.jsx`)
- **File path**: `src/components/Hero.jsx` (line ~145)
- **Current source**: `https://images.unsplash.com/photo-1578662996442-48f60103fc96`
- **Purpose**: Hero background image showing traditional Djerba architecture
- **Replacement**: Replace the URL in the `<img>` tag to use a local image

#### 2. **Listings/Properties** (`src/data/mockData.js`)
- **File path**: `src/data/mockData.js` (lines 7-29)
- **Listing 1 - Houch Jerbi Bleu** Images:
  ```
  - https://images.unsplash.com/photo-1578662996442-48f60103fc96
  - https://images.unsplash.com/photo-1502672260266-1c1ef2d93688
  - https://images.unsplash.com/photo-1449844908441-8829872d2607
  ```
- **Listing 2 - Maison Blanc Houch** Images:
  ```
  - https://images.unsplash.com/photo-1502211945540-48f33fa8d9f7
  - https://images.unsplash.com/photo-1512917774080-9991f1c4c750
  - https://images.unsplash.com/photo-1502213572-0f8d0c9f6e7f
  ```
- **Listing 3 - Villa Sidi Beshr** Images:
  ```
  - https://images.unsplash.com/photo-1578662996442-48f60103fc96
  - https://images.unsplash.com/photo-1502672260266-1c1ef2d93688
  - https://images.unsplash.com/photo-1449844908441-8829872d2607
  ```

#### 3. **User Avatars** (`src/data/mockData.js`)
- **File path**: `src/data/mockData.js` (listings host avatars)
- **Current sources**: `https://randomuser.me/api/portraits/...`
- **Purpose**: Host profile pictures

---

## How to Replace Images

### Option 1: Local Images (Recommended)
1. Create a folder: `src/assets/images/`
2. Add your images with clear names:
   - `src/assets/images/hero-djerba.jpg`
   - `src/assets/images/houch-1.jpg`
   - `src/assets/images/houch-2.jpg`
   - etc.

3. Update the import paths in code:
   ```jsx
   // Before
   src="https://images.unsplash.com/photo-1578662996442..."
   
   // After
   import heroImage from '../assets/images/hero-djerba.jpg';
   src={heroImage}
   ```

### Option 2: CDN (Current)
- Keep using Unsplash or similar CDN
- URLs are maintained in:
  - `src/components/Hero.jsx`
  - `src/data/mockData.js`

---

## Directory Structure for Local Assets

```
djerba-tourism/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── hero/
│   │   │   │   └── hero-djerba.jpg
│   │   │   ├── listings/
│   │   │   │   ├── houch-bleu-1.jpg
│   │   │   │   ├── houch-bleu-2.jpg
│   │   │   │   ├── maison-blanc-1.jpg
│   │   │   │   └── ...
│   │   │   └── avatars/
│   │   │       ├── amina.jpg
│   │   │       ├── fathi.jpg
│   │   │       └── youssef.jpg
│   │   └── .gitkeep
│   ├── components/
│   └── ...
```

---

## Manual Image Replacement Steps

### Step 1: Add Images to `src/assets/images/`
Save your property and hero images in the appropriate folders.

### Step 2: Update Hero Component
File: `src/components/Hero.jsx` (~line 145)
```jsx
// Change this:
src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop"

// To this:
src={require('../assets/images/hero/hero-djerba.jpg')}
// OR if using import:
import heroImage from '../assets/images/hero/hero-djerba.jpg';
src={heroImage}
```

### Step 3: Update Mock Data
File: `src/data/mockData.js` (listings array)
```javascript
// Change this:
images: [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
  ...
]

// To this:
images: [
  require('../assets/images/listings/houch-bleu-1.jpg'),
  require('../assets/images/listings/houch-bleu-2.jpg'),
  ...
]
```

### Step 4: Update Avatar Sources
For local avatars, update the host avatar URLs in mockData:
```javascript
host: { 
  name: 'Amina', 
  avatar: require('../assets/images/avatars/amina.jpg')
}
```

---

## Image Specifications

### Recommended Sizes
- **Hero Image**: 800x1000px (3:4 aspect ratio)
- **Listing Thumbnails**: 1200x800px (3:2 aspect ratio)
- **Avatar Images**: 150x150px (square)

### File Format
- **JPG/JPEG**: For photographs (best compression)
- **PNG**: For transparent backgrounds
- **WebP**: For better compression (if supported)

---

## Current External Sources

If you prefer to keep external images:
1. **Unsplash** (current): https://unsplash.com/
2. **Pexels**: https://www.pexels.com/
3. **Pixabay**: https://pixabay.com/

---

## Notes
- All image URLs can be updated without changing component logic
- The project uses Tailwind CSS for image styling
- Images are responsive and optimized for different screen sizes
- Consider using a CDN for production deployment
