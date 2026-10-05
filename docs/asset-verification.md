# Website asset verification — October 5, 2026

## Source and link checks

- All 34 website image copies match the supplied files byte for byte, including in the production build.
- All 22 artist names, Spotify IDs, images, and two-row positions match the Artist Asset Manifest and recommended roster order.
- All 8 release titles, credits, cover images, and track IDs match the Momentum Asset Manifest.
- Spotify's public metadata confirmed all 22 artist destinations and all 8 track destinations. Four initial network failures passed on retry.
- The four supplied TikTok short links were followed and matched to their music destinations: MIMIMI `7611294248235894785`, ODNOGO `7604600647799785488`, Billie Jean `7542536636112898065`, and MISERY `7665867200603490305`.
- Group, Avant, Bounce, and founder Instagram links resolved to the expected named profiles.
- All 42 local media paths found in the site source exist. No Unsplash image URLs remain.

## Browser checks

- Both Artists routes were checked at 375×812, 768×1024, 1440×900, and 1920×1080. All artist images, artist links, release covers, and Sound ID links matched the source fixtures at every size. No horizontal overflow or broken visible images was found.
- Each of the 8 record selections displayed the matching title, artist credits, artwork, and Spotify destination, with exactly one selected record.
- Home, About, Artists, and Contact navigation passed at mobile and desktop sizes. Exactly one page was active after every transition.
- Demo CTA reached `#demo-submission`. Footer Email scrolled to the email ticker; its custom navigation preserves the current contact hash.
- No browser error logs were recorded during these checks.
- The requested explanatory notes are removed, and the original VERIFIED METRIC label is present.

## Build and repeatable checks

- `npm run test:assets` verifies the authoritative source fixtures, all 34 image hashes, roster ordering, URL formats, 42 local media references, and absence of stock-image URLs.
- `npm run build`, `npx tsc --noEmit`, and `git diff --check` passed.
- The build retains the existing warning about the large Three.js vendor chunk.
- Older end-to-end suites contain expectations for fictional artists and retired page sections. They were not used to judge the new catalog; the current routes and data were checked directly as described above.

## Verification limits

- Spotify chart curves, dates, and stream totals remain prototype data, pending original growth exports. Restoring the requested VERIFIED METRIC label does not establish data verification.
- Sound ID counts match the supplied visuals. They have not been independently verified as current platform totals; for example, the MIMIMI destination displayed 2,267 videos during a browser check, whereas the supplied visual says 1.3M posts. The exact attribution and measurement basis require the original reporting source.
- LinkedIn redirected to its sign-in wall. The destination was reachable, but the profile could not be independently inspected without signing in.
- Discord redirected to `discord.com/invite/trillex` but displayed a temporary network error. Invite validity could not be established; its existing URL is unchanged.
- The source package requests final image/crop/publication approval. The user requested these repository changes be pushed to TMG-Alpha main; this work does not independently establish publication rights.
