# Djouri Showcase

Lovable.dev Senior Designer Prompt: DJOURI DESIGNE ATELIER D'ARCHITECTURE
Goal: Create a high-end, professional showcase website for "DJOURI DESIGNE ATELIER D'ARCHITECTURE," a studio specializing in premium architecture, interior design, and multi-story developments. The site must be bilingual (French and Arabic) and present a refined, precise aesthetic typical of the industry.

Design Philosophy: Minimalist, structural, and sophisticated. The design must emphasize the imagery, using clean lines and a professional layout.

1. Technical Requirements & Structure
Platform: Lovable.dev (use standard components like carousels, forms, and grid systems where possible).

Bilingual System (FR/AR):
Implement a persistent, elegant language switcher (top right of the header).
The entire site must support RTL (Right-to-Left) layout in Arabic. When Arabic is selected, the layout should reverse, and typography should align accordingly.
Placeholder translations are required (e.g., "Notre Atelier" / "مكتبنا").

Performance: All images must be optimized and support lazy loading. The carousel should be lightweight.

SEO: Implement basic SEO structure for both languages (Title tags, Meta descriptions, Alt texts).

2. Visual Identity, Logo, and Color Palette
Decision: I have selected the BLACK logo.
Rationale: A black logo is the definitive industry standard for professional architecture firms on a clean, light background. It offers the highest contrast, precision, and sophistication, projecting a message of structural clarity. (The white logo is for dark backgrounds; the black logo will be the primary on the white site).

Professional Architecture Color Palette (Industry Standard):
Background (Canvas): Primary: FFFFFF (Pure White) and Secondary: F7F7F7 (Light Architectural Grey).
Typography (Primary): 1A1A1A (Near Black) for high readability.
Typography (Secondary) / Accents: 787878 (Medium Grey) for descriptions, captions, and structural lines.
Call-to-Action / Active Element: 9C8461 (Warm Bronze/Champagne) for subtle elegance, or a simple bordered button (standard in the industry).

3. Section-by-Section Design Breakdown
Section A: Professional Header (Nav Bar)
Left Side: The BLACK version of the provided logo, scaled precisely.
Center (RTL on AR): Navigation menu. Primary Nav Items (FR/AR): Home / Accueil / الرئيسية | Projects / Projets / المشاريع | About / Notre Atelier / مكتبنا | Contact / اتصل بنا
Right Side (LTR on FR): The Language Switcher (e.g., "FR | AR"). The switcher should be very subtle.

Section B: Hero / Feature Carousel (The Key Requirement)
Layout: A large, elegant, auto-scrolling (slow speed) Hero Carousel that fills 70-80% of the screen height. This carousel must feature the most representative, high-resolution projects.
Image Sourcing & Context: The carousel should start with a diverse mix.
Slide 1: Start with high-rise contemporary projects. Place a subtle overlay caption on this slide: "Design Contemporain de Haute Tour" / "تصميم برجي معاصر" and include the firm name "DJOURI DESIGNE ATELIER D'ARCHITECTURE."
Subsequent Slides: Include key detailed images to show scope (e.g., Moroccan-infused architecture, complex 3D plan).
Carousel Specifics:
Smooth fade-in/out transitions.
Simple, discreet navigation (prev/next arrows) and unobtrusive pagination dots at the bottom.
Each slide must accommodate a title and a sub-caption, visible on hover or persistent (must work bilingually).

Section C: Project Showcase Grid (Static Gallery)
Layout: A clean, structural grid (3x2 or 4x2) for featured projects. This is where users see the wider portfolio after the carousel.
Implementation: Use thumbnails of provided project images.
Content (Placeholder titles):
Façade Plan: "Plan de Façade Villa Andalousie" / "مخطط واجهة فيلا أندلسية"
Villa with car: "Conception de Résidence Privée" / "تصميم سكن خاص"
3D Plan: "Planification Intérieure et 3D" / "تخطيط داخلي وثلاثي الأبعاد"
Living room: "Intérieur Résidentiel Haut de Gamme" / "تصميم داخلي سكني فاخر"
UX: Ensure standard lightbox behavior when a project thumbnail is clicked, allowing full-screen viewing of the selected image.

Section D: "Notre Atelier / مكتبنا" (About Us)
Layout: A simple split-screen layout.
Left (Text): Professional bilingual copy explaining the firm's philosophy, expertise (interior design, structure, urban planning), and mission. (FR text and AR text).
Right (Visual): A high-quality interior shot of the studio to suggest precision.

Section E: Contact and Inquiry
Layout: A clean, functional section.
Right (Form): A simple contact form with fields for Name, Email, Project Type, and Message. Field labels must be bilingual. (Bilingual CTA Button: "Envoyer" / "إرسال").
Left (Contact Details): Professional contact information, physical address (map view optional but recommended), phone numbers, and email.

Section F: Footer
Content: Copyright notice, credits, and links to professional social media (LinkedIn). All text bilingual. (e.g., "© 2024 DJOURI DESIGNE. All rights reserved." / "© 2024 ديجوري ديزاين. جميع الحقوق محفوظة.")

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/895d89ee-2d79-497f-8fdb-f45f54fd197c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
