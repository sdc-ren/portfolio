# Local profile location intro

This prototype adds an SVG → GSAP camera move → profile code sequence inside the existing 186px profile viewport. It is local-only and does not change Supabase content or require an API key.

Run `pnpm install` and `pnpm dev`. On the homepage, the profile card starts with a simplified Vietnam mainland outline, moves to an approximate Da Nang city-centre point, then fades into the existing `const` → function → console animation. The toolbar switches from `location.svg` to `profile.ts`.

The map sequence lasts about 2.85 seconds once the card becomes visible. It restarts on every homepage mount, including reloads. After the console output finishes typing, it stays visible for 2.4 seconds, then the entire map → code → function → console cycle repeats with the next configured role. There is no replay button. Skip inside the intro moves directly to code. The code component mounts only after the map finishes or is skipped, and starts typing from an empty frame. Each transition unmounts the previous scene and clears its timers.

Reduced-motion preference skips the map and displays static code without looping. If the animation module cannot load within one second, code starts immediately; an additional watchdog prevents an interrupted animation from leaving the card blocked. GSAP timelines, the visibility observer, timers and media listeners are cleaned up when the component unmounts, including React Strict Mode.

The map is decorative, not interactive or intended for navigation. No visitor geolocation, tile requests, external fonts, map SDK or runtime third-party requests are used. Da Nang is a city-centre point, not a personal address. The simplified mainland geometry is from Natural Earth 1:110m, public domain; source is recorded in `src/components/profile-location-map.ts`.

The profile and other homepage content still come from the existing CMS. The map destination is intentionally fixed for this preview; a reusable, configurable location feature would require a separate content-model decision.
