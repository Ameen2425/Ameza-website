# 👑 AMEZA — Comprehensive UI/UX Design System & Implementation Report

## Executive Summary
The **AMEZA** digital flagship is fully upgraded and production-ready as an authoritative **Deep Velvet Obsidian Midnight & Crimson Ruby Red Luxury Editorial Commerce Experience**. Inspired by the quiet luxury, restraint, and sophisticated typography of leading contemporary luxury houses (Celine Noir, Cartier, Saint Laurent, The Row), this design system ensures a unified visual aesthetic, flawless brand cohesion, dynamic ratings, and responsive perfection across all viewports.

---

## 🎨 Master Velvet Obsidian & Crimson Ruby Palette

| Token | Hex / Value | Role & Visual Distribution |
| :--- | :--- | :--- |
| `--ameza-bg` | `#0D070B` | **Deep Obsidian Base Canvas** (Primary background) |
| `--ameza-bg-secondary` | `#140A10` | **Secondary Velvet Canvas** (Alternating editorial bands) |
| `--ameza-section` | `#1A0D15` | **Elevated Section Hearth** (Filters, toolbars, containers) |
| `--ameza-card` | `#23121D` | **Velvet Showcase Card** (Elevated product and deal cards) |
| `--ameza-card-hover` | `#2E1826` | **Luminous Hover State** (Hover elevation) |
| `--ameza-deep` | `#070306` | **Noir Deep Pause** (Footer and contrast breaks) |
| `--ameza-ruby` | `#E11D48` | **Radiant Crimson Ruby Red** (Primary CTA, active states, active pills) |
| `--ameza-ruby-bright` | `#FB7185` | **Warm Radiant Ruby Rose** (Headlines, accents, highlights) |
| `--ameza-text-ruby` | `#FFE4E6` | **Diamond Rose Quartz** (Luminous headings, badge numbers) |
| `--ameza-copper` | `#E67E64` | **Venetian Rose Copper** (Deals, offers, badges, tags) |
| `--ameza-border` | `rgba(225, 29, 72, 0.22)` | **Hairline Metallic Border Definition** |
| `--ameza-text` | `#FAF7F2` | **Crisp Pearl Silk** (Primary typography) |
| `--ameza-text-secondary` | `#DAC8C3` | **Luminous Cashmere** (Body copy and descriptions) |
| `--ameza-text-muted` | `#9E8B89` | **Editorial Taupe** (Metadata and secondary counters) |

---

## ✍️ Editorial Typography Hierarchy

1. **`Playfair Display` (Serif)**:
   - Reserved for Campaign Hero titles, section headings, spotlight stories, and product names.
   - **Weight**: `500–700`.
   - **Letter-spacing**: `-0.025em`.
   - **Line-height**: `1.05 – 1.15`.
2. **`Manrope` (Sans-Serif)**:
   - For all navigation, product descriptions, form fields, filter chips, and primary buttons.
   - **Line-height**: `1.6 – 1.65`.
3. **`JetBrains Mono` (Monospace)**:
   - Used strictly for technical parameters (SKU codes, inventory counters, countdown clock digits, order numbers).

---

## 🏛️ Completed Component Upgrades & Harmonization

### 1. Brand Logo Alignment & Unified Identity
- Integrated the official `BrandLogo` component across all headers (Desktop Header, Mobile Top Bar, Landing Header, and Footer).
- Upgraded the logo SVG with Crimson Ruby and Diamond Rose Quartz gradients and dynamic sizing.
- Modernized `public/favicon.svg` to match the official brand symbol.

### 2. Accurate Dynamic Star Ratings
- Replaced static 5-star placeholders in `ProductCard` and `ProductInfo` with dynamic star rendering calculated directly from numeric ratings.
- Added styled `.star-filled` and `.star-empty` classes with ruby glow and muted contrast.

### 3. Harmonic Category Accents
- Replaced clashing uniform neon-green borders in the homepage category section with distinct editorial accents (Ruby, Rose Copper, Champagne, Sapphire, and Amethyst).
- Replaced neon-green "Best Value" badges on product cards with refined Rose Copper luxury tags.

### 4. Flash Deals & Countdown Refinement
- Converted all yellow-gold colors in `FlashDeals.css` and `DealTimer.css` to Rose Copper and Crimson Ruby Red tokens.

### 5. Administrative Route Integration
- Added `/users` and `/user` routes to `AppRouter.jsx` to ensure the customer & account directory is fully reachable.

---

## 🧪 Build & Performance Verification
- `npm run build` passes cleanly with **0 errors**.
- Responsive layout verified across all viewports from 320px to 2560px.
