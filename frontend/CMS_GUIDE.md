# CMS (Content Management System) - Complete Guide

## Overview
Your Djerba Tourism project now has a fully functional CMS that allows admins to edit all website content without touching code. All changes persist across page refreshes and are stored in browser localStorage.

## 🎯 What's New

### 1. **Content Manager Section**
Located in Admin Panel → **Content Manager**

This is the central hub where admins can:
- Select any page (Homepage, Construction, Cleaning, Rentals)
- Edit text content (titles, descriptions, buttons)
- Upload and manage images
- Toggle sections visibility (show/hide)
- Save and preview changes

### 2. **Editable Sections**

#### Homepage
- **Hero**: Main banner with title, subtitle, description
- **Services**: Title and description for services section
- **Rentals**: Title and description for featured rentals
- **Architecture**: Gerbian house architecture section with text and image
- **Testimonials**: Guest reviews section visibility
- **CTA**: Call-to-action section with button text and link

#### Other Pages (Coming Soon)
- Construction, Cleaning, Rentals pages follow the same structure

### 3. **Dynamic Content Loading**
All pages automatically load content from storage instead of hardcoded values.

---

## 🚀 How to Use

### For Admins

#### 1. **Access Content Manager**
1. Go to Admin Panel
2. Click "Content Manager" in the sidebar
3. Select the page you want to edit

#### 2. **Edit Content**
- Click any section card to expand it
- Edit text fields directly
- Upload images using the "Upload Image" button
- Changes show instantly in preview

#### 3. **Toggle Sections**
- Click the eye icon next to section name to hide/show
- Green = Visible, Red/Gray = Hidden

#### 4. **Save Changes**
- Click the floating "Save Changes" button
- Changes persist immediately
- Website updates in real-time

#### 5. **Reset to Defaults**
- Click "Reset to Defaults" to restore original content
- This action clears all custom edits

### For Developers

#### **Add a New Editable Section**

1. **Update Content Schema** (`src/data/contentSchema.js`)
```javascript
export const defaultPageContent = {
  yourpage: {
    yoursection: {
      visible: true,
      title: "Your Title",
      description: "Your description",
      image: "https://example.com/image.jpg",
    },
  },
};
```

2. **Update Page Component** (e.g., `src/pages/YourPage.jsx`)
```javascript
import { loadPageContent } from '../data/storage';

const [pageContent, setPageContent] = useState(() => loadPageContent().yourpage);

useEffect(() => {
  const handleUpdate = () => {
    const content = loadPageContent();
    setPageContent(content.yourpage);
  };
  window.addEventListener('content-updated', handleUpdate);
  return () => window.removeEventListener('content-updated', handleUpdate);
}, []);

// In JSX, use content like:
{pageContent.yoursection?.visible !== false && (
  <section>
    <h1>{pageContent.yoursection?.title}</h1>
    <p>{pageContent.yoursection?.description}</p>
    <img src={pageContent.yoursection?.image} alt="" />
  </section>
)}
```

#### **Use the EditableSection Component** (Optional)
```javascript
import EditableSection from '../components/EditableSection';

<EditableSection 
  page="homepage" 
  section="hero" 
  defaultContent={{title: 'Hello', visible: true}}
>
  {(content) => (
    <h1>{content.title}</h1>
  )}
</EditableSection>
```

---

## 📁 File Structure

```
src/
├── data/
│   ├── contentSchema.js        ← All default content
│   └── storage.js              ← Content loading/saving functions
├── admin/
│   └── AdminContentEditor.jsx  ← Main CMS interface
├── components/
│   └── EditableSection.jsx     ← Reusable component (optional)
└── pages/
    └── Home.jsx                ← Uses dynamic content
```

---

## 🔧 Storage Details

### Where Content is Stored
- **Location**: Browser localStorage
- **Key**: `djerba-page-content`
- **Format**: JSON object
- **Size**: Depends on number of images (base64 encoded)

### Data Structure
```javascript
{
  homepage: {
    hero: {
      visible: true,
      title: "Discover Authentic Djerba",
      subtitle: "Traditional Houses",
      description: "...",
      images: ["data:image/png;base64,..."],
      layout: "hero"
    },
    architecture: {
      visible: true,
      title: "Gerbian House Architecture",
      image: "data:image/png;base64,..."
    }
    // ... more sections
  },
  construction: { /* ... */ },
  cleaning: { /* ... */ },
  rentals: { /* ... */ }
}
```

---

## ✨ Key Features

### 1. **Real-time Updates**
- Changes appear instantly on the website
- No page refresh needed
- Multiple admins can see updates live

### 2. **Image Optimization**
- Images are converted to base64 (data URLs)
- No external storage needed
- Works offline

### 3. **Visibility Control**
- Hide/show entire sections from website
- No need to delete content
- Easy to manage seasonal content

### 4. **Persistent Storage**
- Changes survive page refreshes
- Works across browser sessions
- Browser LocalStorage has ~5-10MB limit

### 5. **No Code Required**
- Admins make changes via UI
- No need to touch code
- No deployment required

---

## 🎨 Customization Examples

### Example 1: Add a New Field to Architecture Section
```javascript
// In contentSchema.js
architecture: {
  visible: true,
  title: "Gerbian House Architecture",
  description1: "...",
  description2: "...",
  description3: "...",
  image: "...",
  // Add this:
  videoLink: "https://youtube.com/watch?v=...",
}

// The Content Manager will automatically show an input for "videoLink"
```

### Example 2: Add a New Page Section
```javascript
// In contentSchema.js - add under homepage
gallery: {
  visible: true,
  title: "Photo Gallery",
  description: "Browse our collection",
  images: ["image1.jpg", "image2.jpg"]
}

// In Home.jsx - add the section JSX
{pageContent.gallery?.visible !== false && (
  <Section>
    <h2>{pageContent.gallery?.title}</h2>
    {/* Gallery grid */}
  </Section>
)}
```

### Example 3: Update Hero Images from CMS
The architecture image is now fully editable:
1. Go to Admin → Content Manager
2. Select "Homepage"
3. Click "architecture" section
4. Upload a new image
5. Save - website updates instantly!

---

## 🐛 Troubleshooting

### Changes Not Appearing
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear localStorage: Open DevTools → Application → Local Storage → Delete `djerba-page-content`

### Images Not Uploading
- Check file size (must be < 5MB)
- Supported formats: JPG, PNG, GIF, WebP
- Large images may cause localStorage to fill up

### Content Reset After Refresh
- This is normal if you're in private/incognito mode
- localStorage is cleared in private browsing

### Form Not Saving
- Check browser console for errors: `F12` → Console
- Ensure localStorage is not disabled
- Try resetting: Admin → Content Manager → Reset to Defaults

---

## 🔐 Best Practices

1. **Backup Important Content**: Screenshot text before major changes
2. **Test Changes**: Preview before saving
3. **Keep Images Optimized**: Use compressed images to save space
4. **Regular Reset**: If experiencing bugs, use "Reset to Defaults"
5. **Document Custom Fields**: Note any custom fields added to schema

---

## 📊 Current Status

✅ **Implemented**:
- Homepage content management (all sections)
- Architecture section image editing (✨ THIS FIXES YOUR ISSUE!)
- Dynamic content loading
- Real-time updates
- Persistent storage
- Admin UI with live preview

⏳ **Ready for Implementation**:
- Construction page CMS
- Cleaning page CMS
- Rentals page CMS
- Services management (upgrade from basic listing)

---

## 🚀 Next Steps

To add more pages to CMS:

1. Add section to `contentSchema.js`:
```javascript
construction: {
  hero: { title: "...", visible: true },
  services: { title: "...", visible: true }
}
```

2. Update page component to load `loadPageContent().construction`

3. Use loaded content in JSX

That's it! The Content Manager will automatically show new sections.

---

## 📞 Support

If you encounter issues:
1. Check if browser localStorage is enabled
2. Verify you're logged in as admin
3. Check browser console for errors (`F12`)
4. Try "Reset to Defaults"
5. Clear browser cache

---

## ✅ Summary

Your project now has:
- ✅ Fully editable homepage (including architecture image!)
- ✅ CMS admin interface
- ✅ Persistent storage
- ✅ Real-time updates
- ✅ No code changes needed for content updates
- ✅ Scalable architecture for future pages

**The architecture section image is now fully editable from Admin → Content Manager → Homepage → Architecture section!**
