"""Generate or verify pixel-identical WebP alternatives (requires Pillow)."""

import argparse
from pathlib import Path

from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--check", action="store_true", help="Verify existing alternatives without changing files")
args = parser.parse_args()
root = Path(__file__).resolve().parents[1] / "public/assets/sound-ids"
saved = 0
for original in sorted(root.glob("*.png")):
    alternative = original.with_suffix(".webp")
    with Image.open(original) as source:
        if not args.check:
            options = {"icc_profile": source.info["icc_profile"]} if "icc_profile" in source.info else {}
            source.save(alternative, "WEBP", lossless=True, method=6, exact=True, **options)
        with Image.open(alternative) as result:
            assert source.size == result.size, f"Dimensions changed: {original.name}"
            assert source.convert("RGBA").tobytes() == result.convert("RGBA").tobytes(), f"Pixels changed: {original.name}"
            assert source.info.get("icc_profile") == result.info.get("icc_profile"), f"Color profile changed: {original.name}"
    reduction = original.stat().st_size - alternative.stat().st_size
    saved += reduction
    print(f"PASS: {original.name}: identical pixels; {reduction:,} bytes smaller")
print(f"Total saved: {saved:,} bytes")
