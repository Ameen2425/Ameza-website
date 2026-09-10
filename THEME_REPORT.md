# 📑 AMEZA — Master Theme & UI Architecture Report
**Theme Identity: DEEP VELVET OBSIDIAN MIDNIGHT + CRIMSON RUBY RED — Final Premium Luxury Flagship**  
**Repository / Workspace:** `Ameen2425/novaX-design` (`practicefileR`)  
**Design Lead:** Senior Luxury Brand Designer, Creative Director & CSS Architect  

---

## 1. 🌟 Theme Identity & Overview

| Dimension | Specification |
| :--- | :--- |
| **Brand Name** | **AMEZA** |
| **Theme Aesthetic** | High-End Noir Luxury Editorial Commerce (Celine Noir, Cartier, Saint Laurent, The Row) |
| **Color Spectrum** | Deep Obsidian Base Canvas (`#0D070B`) + Secondary Velvet (`#140A10`) + Elevated Section (`#1A0D15`) + Velvet Showcase Card (`#23121D`) + Luminous Card Hover (`#2E1826`) + Radiant Crimson Ruby Red (`#E11D48`) + Diamond Rose Quartz (`#FFE4E6`) + Warm Ruby Rose (`#FB7185`) + Deep Velvet Sangria (`#9F1239`) + Venetian Rose Copper (`#E67E64`) + Crisp Pearl Silk (`#FAF7F2`) |
| **Primary Interaction** | Crimson Ruby Red Gradient (`#FB7185` $\longrightarrow$ `#E11D48` $\longrightarrow$ `#9F1239`) with Rose Copper Accents |
| **Typography System** | `Playfair Display` (Serif, `font-weight: 500–700`, Headings/Editorial) + `Manrope` (Sans-Serif, Controls/Descriptions) + `JetBrains Mono` (SKU/Technical only) |
| **Tagline & Mission** | *"Everything Worth Discovering — A curated collection of products designed around modern everyday living."* |

---

## 2. 🛠️ Technology Stack & Dependencies

```json
{
  "framework": "React 19.2.7",
  "build_tool": "Vite 8.1.5",
  "router": "React Router DOM 7.18.1",
  "state_management": "Redux Toolkit 2.12.0 + React Redux 9.3.0",
  "animation_engine": "Framer Motion 13.1.0",
  "http_client": "Axios 1.19.0",
  "styling_engine": "Pure Vanilla CSS Custom Properties (Variables + Reset + Typography + Animations)",
  "typography_sources": "Google Fonts (Playfair Display, Manrope, JetBrains Mono, Outfit)",
  "live_api_endpoints": "DummyJSON REST API (Products, Categories, Users) + SceneSKU Fallback"
}
```

---

## 3. 🎨 Master Color Architecture & Principle of Luxury Restraint

AMEZA adheres strictly to the **principle of dark luxury restraint**: Radiant Crimson Ruby and Rose Copper accents are used purposefully for surgical CTAs, active indicators, badges, and pricing highlights, allowing the serene velvet noir surfaces to deliver depth and focus.

$$\boxed{\text{Deep Obsidian (\#0D070B)}} \longrightarrow \boxed{\text{Elevated Section (\#1A0D15)}} \longrightarrow \boxed{\text{Velvet Card (\#23121D)}} \longrightarrow \boxed{\text{Card Hover (\#2E1826)}} \longrightarrow \boxed{\text{Radiant Ruby Red (\#E11D48)}}$$

### Complete Design Token Matrix (`src/styles/variables.css`)

```css
:root {
  /* ── 1. VELVET OBSIDIAN MIDNIGHT SURFACES ──────────────── */
  --ameza-bg:             #0D070B; /* Deep Obsidian Base Canvas */
  --ameza-bg-secondary:   #140A10; /* Rich Secondary Velvet Canvas */
  --ameza-section:        #1A0D15; /* Elevated Section Canvas */
  --ameza-section-alt:    #160B12; /* Subtle Alternating Section */
  --ameza-card:           #23121D; /* Elevated Velvet Showcase Card */
  --ameza-card-hover:     #2E1826; /* Luminous Velvet Card Hover */
  --ameza-card-muted:     #1B0E17; /* Recessed Velvet Card Surface */
  --ameza-deep:           #070306; /* Noir Base Footer & Deep Accents */
  --ameza-image-bg:       #180C14; /* Product Image Well Backdrop */
  --ameza-glass-bg:       rgba(26, 13, 21, 0.92); /* Frosted Glass Surface */

  /* ── 2. CRIMSON RUBY RED LUXURY SYSTEM ───────────────── */
  --ameza-ruby:           #E11D48; /* Radiant Crimson Ruby Red */
  --ameza-ruby-bright:    #FB7185; /* Warm Radiant Ruby Rose */
  --ameza-ruby-light:     #F43F5E; /* Vibrant Ruby */
  --ameza-ruby-dark:      #9F1239; /* Deep Velvet Sangria Ruby */
  --ameza-ruby-deep:      #881337; /* Midnight Royal Garnet */
  --ameza-ruby-gradient:  linear-gradient(135deg, #FB7185 0%, #E11D48 50%, #9F1239 100%);
  --ameza-ruby-gradient-hover: linear-gradient(135deg, #FDA4AF 0%, #F43F5E 50%, #BE123C 100%);
  --ameza-ruby-subtle:    rgba(225, 29, 72, 0.14);
  --ameza-ruby-glow-color: rgba(225, 29, 72, 0.42);

  /* ── 3. JEWEL ACCENT PALETTE (DEALS, STATUS, CATEGORIES) ── */
  --ameza-copper:         #E67E64; /* Venetian Rose Copper (Deals & Offers) */
  --ameza-copper-hover:   #F08C73; /* Sunlit Rose Copper Glow */
  --ameza-copper-bg:      rgba(230, 126, 100, 0.18);
  --ameza-copper-border:  rgba(230, 126, 100, 0.45);
  --ameza-emerald:        #10B981; /* Imperial Emerald */
  --ameza-sapphire:       #3B82F6; /* Midnight Sapphire */

  /* ── 4. PEARL SILK & CASHMERE TYPOGRAPHY ──────────────── */
  --ameza-text:           #FAF7F2; /* Crisp Pearl Silk / Warm Ivory */
  --ameza-text-secondary: #DAC8C3; /* Luminous Cashmere Secondary */
  --ameza-text-muted:     #9E8B89; /* Editorial Taupe Metadata */
  --ameza-text-ruby:      #FFE4E6; /* Glowing Headline Ruby Quartz */

  /* ── 5. BORDERS & SHADOW SYSTEM ───────────────────────── */
  --ameza-border:         rgba(225, 29, 72, 0.22);
  --ameza-border-card:    rgba(225, 29, 72, 0.28);
  --ameza-border-ruby:    rgba(225, 29, 72, 0.65);
  --radius-card:          18px;
  --radius-pill:          999px;
  --shadow-card:          0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(225, 29, 72, 0.2);
  --shadow-card-hover:    0 18px 45px -8px rgba(0, 0, 0, 0.9), 0 0 28px rgba(225, 29, 72, 0.28);
}
```

---

## 4. ✍️ Typography Architecture & Hierarchy

| Typography Level | Font Family | Weight | Tracking / Leading | Target Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero & Major Headings** | `Playfair Display` | `500–700` | `-0.025em` / `1.05–1.15` | Campaign Hero, Category Headings, Featured Spotlight, About Story |
| **Subheadings & Titles** | `Playfair Display` / `Manrope` | `600` | `-0.015em` / `1.15–1.25` | Section Titles, Card Titles, Dialog Headers |
| **Body & UI Controls** | `Manrope` | `400` / `600` / `700` | `0.02em` / `1.65` | Navigation Links, Descriptions, Filter Pills, Action Buttons |
| **Eyebrows & Editorial Labels** | `Manrope` | `700` | `0.18em` uppercase | Section Eyebrows (`THE AMEZA EDIT`, `ATELIER CURATED`) |
| **Technical Metadata** | `JetBrains Mono` | `500–700` | `0.08em` | SKU numbers, inventory counters, countdown timer values |

---

## 5. 📱 Component Implementations & Verified Visual Hierarchy

1. **Floating Capsule Navigation (Desktop)**:
   - Centered floating capsule: `rgba(22, 11, 18, 0.88)`, `backdrop-filter: blur(28px)`, hairline border `rgba(225, 29, 72, 0.25)`.
   - Unified official `BrandLogo` with geometric apex silhouette and Crimson Ruby chevron.
   - Active link pill powered by Framer Motion `layoutId="activeNavPill"` in ruby gradient.
2. **Mobile Navigation Dock**:
   - High-contrast bottom floating pill with active ruby indicator for fluid one-thumb navigation.
3. **Product Cards & Catalog**:
   - Velvet obsidian card with dynamic star rating based on actual review score (filled `★` and hollow `☆`).
   - Interactive 3D tilt perspective and radial ruby sheen reflection on cursor hover.
   - Rose copper curated badge replacing clashing neon green indicators.
4. **Flash Deals & Boutique Spotlight**:
   - Rose copper countdown pill, dynamic live countdown timer, and ruby quick-add interaction.
5. **Admin User Management**:
   - Accessible via `/users` and `/user` with search, filter, and offcanvas edit controls.
6. **Footer**:
   - Deep Noir `#070306` background with brand social links, shop directory, newsletter subscription, and legal links.

---

## 6. 🧪 Verification & Build Status

- **Vite Production Build**: Verified with `npm run build` $\longrightarrow$ **0 errors**.
- **Responsive Guarantee**: Fluid breakpoints from `320px` to `2560px` with zero horizontal overflow.
- **Brand Cohesion**: 100% unified logo, color tokens, and star ratings across all routes.
