# Local website asset handoff

The October 5, 2026 asset package is integrated into the website. The original source folder and ZIP remain local; the website uses the curated copies in `public/assets/`.

- 22 roster images are served from `public/assets/artists/` in the two-row manifest order (11 artists per row).
- 8 release covers are served from `public/assets/releases/`, with supplied titles, credits, and exact Spotify track URLs.
- 4 supplied Sound ID visuals are served from `public/assets/sound-ids/`. Cards link to the corresponding user-provided TikTok URLs; post counts are copied from the supplied visuals, not independently verified live metrics.
- Both Artists routes use this catalog. About-page service backgrounds use local release covers.
- The source package is preserved unchanged. `utils/realAssets.ts` is the shared website catalog.

## Remaining final content

1. Original Spotify growth exports, reporting periods, and verified metrics for the eight releases. Existing chart curves, dates, and stream counts remain illustrative. At the user's request, the website's preview notes are removed and its original VERIFIED METRIC label is restored; this label does not establish source verification.
2. Final image/crop/publication approval before launch, as requested by the source package's Working Asset Notes.

## TikTok links

User-provided short links were matched to their destination sound IDs:

- MIMIMI (HARDTEKK): `https://vt.tiktok.com/ZS9Dm2So4S1qC-UCjuA/` → `7611294248235894785`.
- MISERY. (HARDTEKK): `https://vt.tiktok.com/ZS9Dm2U24EEFx-kQhJY/` → `7665867200603490305`.
- ODNOGO (ULTRAFUNK): `https://vt.tiktok.com/ZS9Dm25SCScch-3kcDc/` → `7604600647799785488`.
- Billie Jean (Hoodtrap): `https://vt.tiktok.com/ZS9Dm2mJfnWFt-2LbGv/` → `7542536636112898065`.

Optional: dedicated artist profile images for Jynxx, TRPJRK, NewEra, levi22, and The Syndicate. Their supplied release-artwork fallbacks are currently used. The package contains no artist banners.

Preserve The Syndicate's exact Spotify artist ID: `4kdYyJ6DNuDVBt8a0cv0jk`. EXXCLUSIVE retains the supplied display name; the manifest identifies its Spotify title as EXXCLUSlVE.
