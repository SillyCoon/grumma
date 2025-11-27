# Admin Screen Implementation - Grammar Point Management

## Overview
Complete admin interface for creating and editing grammar points without examples. The system is optimized for admin workflow with essential fields and a clean, intuitive UI.

## Architecture Analysis & Design Decisions

### Database Schema Usage
The implementation uses the existing `grammarPoints` table from `libs/db/schema.ts` which contains:

**Core Fields (required for all grammar points):**
- `id` (integer, primary key): Unique identifier
- `shortTitle` (text, unique): Used as identifier (e.g., "nominative")
- `order` (integer): Display/sequence order
- `title` (text, unique): Full formal title (e.g., "Nominative Case (Именительный падеж)")

**Optional Detail Fields:**
- `structure` (text): Grammar structure explanation (e.g., "Кто? Что?")
- `detailedTitle` (text, unique): Russian description
- `englishTitle` (text, unique): English translation/description
- `torfl` (varchar(2)): Russian proficiency level (A1, A2, B1, etc.)

**Related Data:**
- `exercises`: Managed separately (referenced via `grammarPointId`)
- `createdAt`, `updatedAt`: Automatic timestamps

### Optimization for Admin Workflow

**Form Optimization:**
1. **Essential fields first**: shortTitle, title, order are prominently placed and required
2. **Logical grouping**: Fields organized in a 2-column grid on desktop for scanning
3. **Smart defaults**: Order defaults to 1, optional fields start empty
4. **Immediate feedback**: Success/error messages appear inline
5. **Non-destructive reset**: Reset button available for new form entries

**List Optimization:**
- Displays grammar points in order
- Quick visual indicators (TORFL level badges, structure checkmark)
- Edit link directly accessible from each row
- Shows count of grammar points
- Responsive table with truncation for long text

**Edit Page Optimization:**
- Back navigation for quick returns
- Related exercises shown below (read-only for now)
- ID displayed for reference
- Single form for both create and edit (reuses GrammarPointForm component)

## Files Created/Modified

### New Files

#### 1. `/src/layouts/AdminLayout.astro`
- Two-column layout with sidebar navigation
- Responsive design (stacks on mobile)
- Navigation links to Dashboard and Grammar Points
- Consistent styling with main Layout wrapper

#### 2. `/src/pages/admin/index.astro`
- Admin dashboard with quick stats
- Getting started guidance
- Links to key admin functions
- Placeholder for future dashboard features

#### 3. `/src/pages/admin/grammar/index.astro`
- Lists all grammar points with key information
- Create new grammar point form integrated
- Quick edit links
- Shows grammar point count
- Visual indicators for completeness (TORFL, Structure)

#### 4. `/src/pages/admin/grammar/[id]/index.astro`
- Edit interface for individual grammar points
- Shows related exercises (read-only, future enhancement)
- Back navigation
- Displays grammar point ID for reference

#### 5. `/src/components/solid/admin/GrammarPointForm.tsx`
- Reusable form component for create/edit operations
- TextField components from UI library (Kobalte primitives)
- Handles form state with Solid.js signals
- Error and success messaging
- Supports both insert and update operations
- Form reset for new entries

### Modified Files

#### 1. `/src/actions/index.ts`
Added two new server actions:
- **`createGrammarPoint`**: Creates new grammar point in database
  - Validates required fields (shortTitle, title, order)
  - Auto-generates next sequential ID
  - Returns created record
  - Includes error handling with descriptive messages
  - TODO: Add admin role check

- **`updateGrammarPoint`**: Updates existing grammar point
  - Accepts id + any fields to update
  - Validates required fields
  - Returns updated record or NOT_FOUND error
  - TODO: Add admin role check

#### 2. `/src/middleware.ts`
- Added admin route protection
- Admin routes require authentication
- Unauthenticated users redirected to home
- TODO: Add admin role/permission check

## Component Structure

### GrammarPointForm Component
Uses Kobalte UI primitives wrapped by the `ui/text-field` package:
- `TextField`: Root component
- `TextFieldLabel`: Accessible labels
- `TextFieldInput`: Text/number inputs with validation
- `TextFieldDescription`: Helper text

**Form Flow:**
```
User Input → handleInputChange → formData signal update
Submit → handleSubmit → Action call → Success/Error message
```

## Usage Guide

### Create New Grammar Point
1. Navigate to `/admin/grammar`
2. Fill in required fields: Short Title, Full Title, Order
3. Optionally add Structure, TORFL level, and translations
4. Click "Create Grammar Point"
5. Form resets on success

### Edit Existing Grammar Point
1. Navigate to `/admin/grammar`
2. Click "Edit" on any grammar point in the table
3. Update desired fields
4. Click "Update Grammar Point"
5. Form preserves data on success

### View All Grammar Points
- `/admin/grammar` shows complete list
- Sorted by order field
- Quick visual indicators for status
- Direct edit access

## Security Considerations

### Current State
- Admin routes require user authentication
- Server actions validate user context

### TODO
- Add admin role check in middleware
- Verify admin role in `createGrammarPoint` action
- Verify admin role in `updateGrammarPoint` action
- Consider audit logging for admin changes

## Future Enhancements

1. **Exercise Management**: Edit exercises within grammar point editor
2. **Bulk Operations**: Import/export grammar points
3. **History/Audit**: Track changes made by admins
4. **Draft Status**: Support draft grammar points before publishing
5. **Search/Filter**: Advanced filtering in list view
6. **Validation**: Real-time validation for unique fields (shortTitle, title)
7. **Admin Role System**: Proper permission/role-based access control
8. **Examples Management**: Interface for managing examples without editing exercises
9. **Structure Preview**: Live preview of structure HTML
10. **Dashboard Stats**: Real counts of grammar points, exercises, etc.

## Field Specifications

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| id | integer | Yes | Yes | Auto-generated on create |
| shortTitle | text | Yes | Yes | Identifier, no spaces recommended |
| title | text | Yes | Yes | Full formal name |
| order | integer | Yes | No | Display sequence |
| structure | text | No | No | Grammar question, supports HTML |
| detailedTitle | text | No | Yes | Russian description |
| englishTitle | text | No | Yes | English translation |
| torfl | varchar(2) | No | No | A1, A2, B1, B2, C1, C2 |
| createdAt | timestamp | Auto | No | Set on insert |
| updatedAt | timestamp | Auto | No | Updated on every change |

## Authentication Flow

```
Request to /admin/* 
  → Middleware checks auth
    → Not authenticated → Redirect to /
    → Authenticated → Continue
      → TODO: Check admin role
        → Not admin → Redirect to /
        → Admin → Render page
```

## API Endpoints

### POST /_actions/createGrammarPoint
```json
{
  "shortTitle": "nominative",
  "title": "Nominative Case",
  "order": 1,
  "structure": "Кто? Что?",
  "detailedTitle": "The Case of the Subject",
  "englishTitle": "Who? What?",
  "torfl": "A1"
}
```

### POST /_actions/updateGrammarPoint
```json
{
  "id": 1,
  "structure": "Updated structure",
  "torfl": "A2"
}
```

## Testing Considerations

1. Test create with minimal fields (shortTitle, title, order only)
2. Test create with all optional fields
3. Test update of single field
4. Test update of multiple fields
5. Test form validation
6. Test error handling (duplicate shortTitle, etc.)
7. Test authentication (unauthenticated user redirected)
8. Test authorization (TODO: verify admin role)
