# Campaign Module - Refactored

This is the refactored campaign module with a clean brand/creator split architecture.

## Structure

```
campaign-refactored/
├── campaign.component.jsx          # Main entry point
├── use-campaign.hook.js            # Role-based routing logic
│
├── brand-campaign/                 # All brand features
│   ├── create-campaign/            # Brand-only campaign creation
│   ├── discover/                   # Brand discovers creators
│   ├── applications/               # Brand reviews applications
│   ├── active/                     # Brand manages active campaigns
│   └── completed/                  # Brand views completed campaigns
│
├── creator-campaign/               # All creator features
│   ├── discover/                   # Creator discovers campaigns
│   ├── applications/               # Creator views applications
│   ├── active/                     # Creator manages active campaigns
│   └── completed/                  # Creator views completed campaigns
│
└── common/components/campaign/     # Shared components (both roles)
    ├── application-card/
    ├── contract-preview-modal/
    ├── message-thread-modal/
    └── invitation-modal/
```

## Architecture Rules

1. **STRICT 2-File Rule**: Every folder has EXACTLY 2 files:
   - `*.component.jsx` - JSX/UI rendering ONLY
   - `use-*.hook.js` - ALL logic (API calls, state, handlers, effects)

2. **Component Logic Separation**:
   - Components contain ZERO logic (no useState, useEffect, useCallback, etc.)
   - All logic lives in hooks
   - Components receive everything via props or hook returns

3. **Hook Size Limit**: Max 200 lines per hook
   - If exceeds → Create sub-components with own hooks
   - Example: `applications/components/hire-creator-modal/`

4. **Component Placement**:
   - Used by BOTH roles → `common/components/campaign/`
   - Brand-only → `brand-campaign/[feature]/` or `brand-campaign/components/`
   - Creator-only → `creator-campaign/[feature]/` or `creator-campaign/components/`

## Migration Status

✅ Main entry point with role-based routing
✅ Brand campaign features copied
✅ Creator campaign features copied
⏳ Shared components identification (in progress)
⏳ Hook splitting for oversized hooks
⏳ Testing
⏳ Validation and swap

## Key Features

### Brand Campaign
- **Create Campaign**: Multi-step wizard for campaign creation
- **Discover**: Search and shortlist creators
- **Applications**: Review creator applications, hire creators
- **Active**: Manage ongoing campaigns
- **Completed**: View campaign analytics and reports

### Creator Campaign
- **Discover**: Browse available campaigns
- **Applications**: Track application status, view offers
- **Active**: Manage active collaborations
- **Completed**: View completed work and payments

## Testing

Run tests:
```bash
npm test -- campaign-refactored
```

## Notes

- This module is built in parallel to the legacy `campaign/` folder
- Once validated, it will replace the old structure
- All imports use absolute paths from `@/`
- No breaking changes to Redux slices or API calls
