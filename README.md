# Arabian Plates Frontend

Premium frontend-only marketplace for buying, browsing, and listing UAE car number plates.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Reusable component architecture with mock API-style service layer

## Implemented Pages

- `/` Homepage
	- Luxury hero + search
	- Browse by emirate and digit count
	- Featured carousel
	- Trending listings
	- Premium/VIP collection
	- How it works
	- Trust and verification section
	- Testimonials
	- FAQ
	- Final seller CTA
- `/explore` Explore / Search Results
	- Top controls + advanced filters
	- Sort options
	- Grid/list toggle
	- Pagination
	- Empty and error states
- `/plates/[id]` Plate Details
	- Large visual plate presentation
	- Pricing and badges
	- Seller card
	- Make offer modal
	- Save/share/compare/contact actions
	- Similar listings + recently viewed
	- Mobile bottom action bar
- `/sell` Sell Your Plate
	- Multi-step form wizard UI
	- Featured options
	- Preview before submit
- `/dashboard` User Dashboard
	- Overview cards
	- Tabs for listings/saved/offers/messages/profile
	- Analytics cards/charts
- `/admin` Admin Dashboard
	- Marketplace metrics
	- Listings table and user table
	- Moderation queue and reported items
	- Featured listing management controls

## Data Layer

Mock API-style data and async services are available under:

- `src/data/mock/*`
- `src/lib/services/*`
- `src/lib/types.ts`

These are intentionally structured to be replaced by real backend APIs later.

## i18n Readiness

English-first implementation with dictionary structure prepared for future Arabic localization:

- `src/lib/i18n/en.ts`

## Design Notes

- Premium, clean visual language
- Light and dark mode support
- Responsive across mobile, tablet, desktop
- AED currency formatting
- UAE-specific emirates and listing examples

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Validation

```bash
npm run lint -- --max-warnings=0
npm run build
```

Both commands pass in the current implementation.
# Arabian-Plates
