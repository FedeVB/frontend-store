# Tienda - Angular Project

## Commands
- `ng serve` - Start dev server (http://localhost:4200)
- `ng build` - Production build
- `ng test` - Run unit tests with Karma

## Architecture
- Angular 19.2 standalone components
- Components in `src/app/pages/` and `src/app/components/`
- Global styles in `src/styles.css`
- Google Fonts (`DM Sans`, `DM Mono`) imported in `src/index.html`
- Component-scoped styles use CSS variables defined in `:host`

## CSS Conventions
- Use CSS variables (defined in `:host`): `--bg-primary`, `--text-primary`, `--font-sans`, `--font-mono`, etc.
- Badge colors (global in `styles.css`): `.badge-venta`, `.badge-compra`, `.badge-devolucion`
- Border radii: `--radius-md` (8px), `--radius-lg` (12px)