# iOS Theme - Shopify Theme Documentation

## Overview

A modern, iOS-inspired Shopify theme with glassmorphism design and Rolex-inspired color scheme. Built for German dropshipping brands with a focus on performance, accessibility, and maintainability.

## Features

- **Modern Design**: iOS-inspired glassmorphism with Rolex-inspired dark green and gold accents
- **Performance Optimized**: Modular JavaScript, optimized CSS, lazy loading
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes and keyboard navigation
- **SEO Ready**: Structured data (FAQPage, Service schemas), enhanced meta tags
- **GDPR Compliant**: Cookie consent banner with proper focus management
- **Responsive**: Mobile-first design with breakpoints at 980px and 640px
- **Maintainable**: Modular code structure, reusable snippets, organized CSS

## Project Structure

```
shopify/
├── assets/
│   ├── ios.css              # Main stylesheet
│   └── js/                   # Modular JavaScript
│       ├── smooth-scroll.js
│       ├── mobile-menu.js
│       ├── cookie-banner.js
│       ├── faq-accordion.js
│       └── main.js
├── config/
│   ├── settings_data.json    # Theme settings data
│   └── settings_schema.json  # Theme settings schema
├── layout/
│   └── theme.liquid          # Main theme layout
├── sections/                 # Shopify sections
│   ├── ios-hero.liquid
│   ├── ios-features.liquid
│   ├── ios-pricing.liquid
│   ├── ios-faq.liquid
│   └── ...
├── snippets/                 # Reusable components
│   ├── ios-navigation.liquid
│   ├── ios-section-header.liquid
│   ├── ios-button.liquid
│   └── ios-card.liquid
└── templates/
    └── index.json            # Homepage template
```

## Setup & Installation

1. **Upload Theme to Shopify**
   - Zip the theme directory
   - Upload via Shopify Admin → Online Store → Themes → Upload theme

2. **Configure Theme Settings**
   - Go to Online Store → Themes → Customize
   - Configure colors, typography, and navigation in theme settings
   - Set up navigation items in the Navigation section

3. **Customize Sections**
   - All sections are customizable via the theme editor
   - Content can be edited directly in the Shopify admin

## CSS Architecture

The CSS is organized into logical sections:

1. **CSS Custom Properties**: Theme variables for colors, spacing, z-index
2. **Reset & Base Styles**: Global resets and base typography
3. **Layout & Utilities**: Wrapper, grids, utility classes
4. **Components**: Buttons, cards, navigation, glass effects
5. **Sections**: Hero, pricing, FAQ, CTA, etc.
6. **Responsive Design**: Mobile breakpoints and adjustments
7. **Print Styles**: Print-specific styles

### CSS Custom Properties

All colors and design tokens are defined as CSS variables:

```css
--bg0, --bg1, --bg2          /* Background colors */
--emerald, --emerald2        /* Green accents */
--gold                       /* Gold accent */
--text, --muted, --muted2    /* Text colors */
--card, --card2              /* Card backgrounds */
--stroke, --stroke2          /* Border colors */
--shadow, --shadow2          /* Shadow values */
--radius, --radius2          /* Border radius */
--max                       /* Max width */
--z-skip, --z-nav, --z-overlay /* Z-index scale */
```

## JavaScript Modules

The theme uses a modular JavaScript architecture:

- **smooth-scroll.js**: Handles smooth scrolling for anchor links
- **mobile-menu.js**: Mobile menu toggle with focus trap
- **cookie-banner.js**: GDPR cookie consent with accessibility
- **faq-accordion.js**: FAQ accordion functionality
- **main.js**: Main orchestrator that initializes all modules

All modules use the `IOSTheme` namespace and include error handling.

## Theme Settings

### Color Palette
- Rolex Smaragdgrün (Emerald)
- Rolex Gold
- Background colors
- Text colors

### Typography
- Heading font
- Body font
- Base font size

### Layout & Design
- Max content width
- Border radius
- Glass effect toggle

### Navigation
- Configurable navigation items (up to 6)
- Each item has label and link

### SEO & Metadata
- Default meta title
- Default meta description
- Social media preview image

### GDPR & Legal
- Cookie banner toggle
- Cookie banner text
- Privacy policy URL
- Imprint URL

### Performance
- Lazy load images toggle
- Preload fonts toggle

### Advanced
- Custom CSS injection
- Custom JavaScript injection
- Debug mode

## Customization

### Adding New Sections

1. Create a new `.liquid` file in `sections/`
2. Use the section header snippet: `{% render 'ios-section-header', title: ..., subtitle: ... %}`
3. Follow the existing section patterns

### Modifying Colors

Colors can be customized via:
1. Theme settings (for main colors)
2. CSS custom properties in `assets/ios.css`
3. CSS variables are used throughout for consistency

### Adding Navigation Items

1. Go to Theme Settings → Navigation
2. Configure up to 6 navigation items
3. Navigation automatically updates in both desktop and mobile menus

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties with fallback
- Backdrop filter with fallback
- Smooth scroll with polyfill

## Performance Tips

1. **Images**: Use Shopify's responsive image filters
2. **JavaScript**: Already optimized with deferred loading
3. **CSS**: Critical CSS can be extracted if needed
4. **Fonts**: Configure font preloading in theme settings

## Accessibility

- WCAG 2.1 AA compliant
- Proper ARIA attributes
- Keyboard navigation support
- Focus trap in modals
- Skip to content link
- Screen reader friendly

## Debug Mode

Add `?debug=1` to the URL to enable debug logging in the browser console.

## Support

For theme support, visit: https://launchheld.com/support

## License

Proprietary - LaunchHeld
