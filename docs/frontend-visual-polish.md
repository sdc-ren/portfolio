# Frontend visual polish

Shared motion tokens, outlined wave-fill buttons, responsive hero typography, sticky navigation with active section, scroll reveals, card interactions, gallery swipe, dialog transitions, and a pause control for the profile animation.

Existing equal project cards and order remain. No AI playground is added. Reduced-motion preferences render content without movement. Keyboard focus receives the same button fill as hover.

Hero and three case-study descriptions use a guarded content migration; run `pnpm db:deploy` during deployment. Customized published text and other locales are preserved.

Validation: 61 automated tests pass, TypeScript passes, production build passes. Migration verified against the assembled seed, custom published text, other locales, null publication, and repeated execution. Interactive browser verification of the local server was blocked because the cloud browser cannot reach local loopback; deployment preview still needs visual review on desktop and mobile.
