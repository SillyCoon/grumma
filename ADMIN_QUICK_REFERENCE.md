# Admin Screen Quick Reference

## Accessing the Admin Interface

### Routes
- **Admin Dashboard**: `http://localhost:4321/admin`
- **Grammar Points List**: `http://localhost:4321/admin/grammar`
- **Edit Grammar Point**: `http://localhost:4321/admin/grammar/[id]` (e.g., `/admin/grammar/1`)

### Authentication
- Admin routes require user login (redirects to `/` if not authenticated)
- TODO: Admin role check (currently checks only for authenticated user)

## Creating a Grammar Point

### Minimal Form (Required Fields Only)
```
Short Title: nominative
Full Title: Nominative Case (Именительный падеж)
Order: 1
```

### Full Form Example
```
Short Title: nominative
Full Title: Nominative Case (Именительный падеж)
Order: 1
Structure: Кто? Что?
Detailed Title (Russian): The Case of the Subject
English Title: Who? What?
TORFL Level: A1
```

### Form Field Guide

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| Short Title | Text | ✓ | `nominative` | Used as identifier, appears in URLs |
| Full Title | Text | ✓ | `Nominative Case (Именительный падеж)` | Main display name |
| Order | Number | ✓ | `1` | Display sequence, must be positive |
| Structure | Text Area | × | `Кто? Что?` | Grammar question, can include HTML |
| Detailed Title | Text | × | `The Case of the Subject` | Russian description |
| English Title | Text | × | `Who? What?` | English translation |
| TORFL Level | Text | × | `A1` | Russian proficiency level |

## Component Files

```
src/
├── layouts/
│   └── AdminLayout.astro              # Admin page layout with sidebar
├── pages/
│   └── admin/
│       ├── index.astro                # Admin dashboard
│       └── grammar/
│           ├── index.astro            # Grammar list + create form
│           └── [id]/
│               └── index.astro        # Edit individual grammar point
└── components/
    └── solid/
        └── admin/
            └── GrammarPointForm.tsx    # Reusable form component
```

## Server Actions

### Create Grammar Point
**File**: `src/actions/index.ts`
**Action**: `actions.createGrammarPoint()`

```typescript
await actions.createGrammarPoint({
  shortTitle: "nominative",
  title: "Nominative Case (Именительный падеж)",
  order: 1,
  structure: "Кто? Что?",
  detailedTitle: "The Case of the Subject",
  englishTitle: "Who? What?",
  torfl: "A1"
});
```

### Update Grammar Point
**File**: `src/actions/index.ts`
**Action**: `actions.updateGrammarPoint()`

```typescript
await actions.updateGrammarPoint({
  id: 1,
  structure: "Updated structure",
  torfl: "A2"
  // Only include fields you want to update
});
```

## Database

### Grammar Points Table
- **Schema**: `libs/db/schema.ts` → `grammarPoints` table
- **Connection**: `libs/db/index.ts` (uses drizzle-orm)
- **Migrations**: `drizzle/` directory

### Related Tables
- **Exercises**: Related via `grammarPointId` FK
- **Space Repetitions**: Related via `grammarPointId` FK
- **Feedback**: Can reference `grammarPointId`

## Middleware Auth Flow

**File**: `src/middleware.ts`

```
Request → Is /admin/* path?
  ├─ Yes → Check authentication
  │         ├─ Not authenticated → Redirect to /
  │         └─ Authenticated → Allow
  └─ No → Continue to PATHS_TO_IGNORE check
```

## UI Components Used

### Layout Components
- `Card`: Border container with padding
- `CardHeader`: Header section with title
- `CardContent`: Main content area
- `CardTitle`: Styled heading

### Form Components
- `TextField`: Root wrapper for form fields
- `TextFieldLabel`: Accessible label
- `TextFieldInput`: Text/number input field
- `TextFieldDescription`: Helper text below input

### Button
- `Button`: Primary CTA button
  - `type="submit"` for form submission
  - `variant="outline"` for secondary actions
  - `disabled={boolean}` for loading state

### Solid.js Components
- `Show`: Conditional rendering
- `For`: List rendering (not used in current implementation)
- `createSignal`: State management

## Common Tasks

### Add a New Grammar Point
1. Navigate to `/admin/grammar`
2. Fill form at top of page
3. Click "Create Grammar Point"
4. Page refreshes and form clears on success

### Edit Existing Grammar Point
1. Navigate to `/admin/grammar`
2. Find grammar point in list
3. Click "Edit" link
4. Update fields on `/admin/grammar/[id]`
5. Click "Update Grammar Point"

### View Grammar Point Details
- Click "Edit" on any grammar point in list
- See full details including:
  - All fields
  - Associated exercises (read-only)
  - Created/updated timestamps

## Styling

### Tailwind Classes Used
- Spacing: `gap-4`, `p-6`, `mb-2`, `pt-4`
- Layout: `grid`, `grid-cols-1`, `md:grid-cols-2`, `flex`
- Colors: `slate-*`, `blue-*`, `green-*`, `red-*`
- Typography: `text-sm`, `font-medium`, `font-semibold`, `text-3xl`
- Borders: `border`, `border-slate-200`, `rounded-md`, `rounded-lg`
- Backgrounds: `bg-slate-50`, `bg-white`, `bg-slate-100`
- States: `hover:`, `focus:`, `disabled:`

## Error Handling

### Client-Side
- Form validation happens on input
- Server action errors caught in try/catch
- Error messages displayed in red box below form title
- Success messages displayed in green box

### Server-Side
- SQL unique constraint violations caught
- Missing grammar point 404 handled
- Unauthorized access (TODO: implement)
- All errors return ActionError with code + message

## Performance Considerations

### Current Implementation
- Grammar point list loads all points on page load
- No pagination (OK for small datasets)
- Form uses Solid.js reactivity (fast updates)
- Individual grammar point edit loads full record

### Future Optimizations
- Add pagination/infinite scroll
- Lazy load exercise list
- Cache grammar point list
- Debounce form submission

## Testing Checklist

- [ ] Create grammar point with required fields only
- [ ] Create grammar point with all fields
- [ ] Edit existing grammar point
- [ ] Update single field
- [ ] Try duplicate shortTitle (should fail)
- [ ] Try duplicate title (should fail)
- [ ] Access `/admin` without auth (should redirect)
- [ ] Access `/admin/grammar` without auth (should redirect)
- [ ] Form validation (required field errors)
- [ ] Error message display
- [ ] Success message display
- [ ] List displays newly created grammar point
- [ ] List shows correct order
- [ ] TORFL badges display correctly
- [ ] Structure indicator shows correctly

## Debugging

### Enable Verbose Logging
```bash
npm run dev -- --verbose
```

### Check Database State
```bash
# Connect to local database and query
psql -d grumma -c "SELECT id, short_title, order FROM grumma.grammar_point ORDER BY \"order\";"
```

### Inspect Network Requests
1. Open browser DevTools
2. Go to Network tab
3. Look for `_actions/createGrammarPoint` or `_actions/updateGrammarPoint`
4. Check request/response payload

### Check Middleware
- Verify `/src/middleware.ts` includes admin route handling
- Test by accessing `/admin` without session cookies

## Notes

- Examples are managed separately from grammar points (future feature)
- Exercises reference grammar points but are read-only in admin interface
- Admin role check is TODO - currently only checks authentication
- Structure field supports HTML formatting
- All timestamps are UTC
