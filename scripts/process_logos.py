from PIL import Image
import os

brand = r"c:\Users\apoor\ashviNextgen\public\brand"


def content_bbox(img):
    """BBox of navy/blue/teal ink pixels (ignore pale washes)."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 10:
                continue
            # ink / brand colors: dark navy or teal accents
            is_navy = b > r + 15 and b > g + 10 and (r + g + b) < 280
            is_teal = g > 150 and b > 150 and r < 120 and g > r + 40
            is_dark = (r + g + b) < 180 and a > 200
            if is_navy or is_teal or is_dark:
                found = True
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    if not found:
        return img.getbbox()
    return (minx, miny, maxx + 1, maxy + 1)


def make_transparent_light(img):
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3
            # wipe pale backgrounds / decorative washes
            if lum > 210 and not (g > 160 and b > 160 and r < 100):
                px[x, y] = (r, g, b, 0)
            elif r > 200 and g > 210 and b > 220:
                px[x, y] = (r, g, b, 0)
    return img


def make_transparent_dark(img):
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # deep navy / near-black backdrop
            if r < 40 and g < 55 and b < 95 and not (g > 140 and b > 140 and r < 90):
                # keep teal accents
                if g > 160 and b > 150 and r < 80:
                    continue
                px[x, y] = (r, g, b, 0)
    return img


def pad(img, p=16):
    c = Image.new("RGBA", (img.width + p * 2, img.height + p * 2), (0, 0, 0, 0))
    c.paste(img, (p, p), img)
    return c


# --- Horizontal light ---
src = Image.open(os.path.join(brand, "AshviTech Horizontal logo.png"))
h = make_transparent_light(src)
bb = content_bbox(h)
h = h.crop(bb)
# wipe remaining pale inside crop
h = make_transparent_light(h)
h = pad(h, 24)
h.save(os.path.join(brand, "logo-horizontal-light.png"))
print("horizontal-light", h.size)

# --- Stacked light (no swatches) ---
src = Image.open(os.path.join(brand, "Ashvi tech Up and down logo.png"))
s = make_transparent_light(src)
bb = content_bbox(s)
s = s.crop(bb)
# remove bottom color pills: keep rows that contain navy text/mark only
# cut at ~78% of content height (swatches sit below wordmark)
cut_y = int(s.height * 0.78)
s = s.crop((0, 0, s.width, cut_y))
bb = content_bbox(s)
s = s.crop(bb)
s = pad(s, 20)
s.save(os.path.join(brand, "logo-stacked-light.png"))
print("stacked-light", s.size)

# Symbol = top of stacked before wordmark (~58%)
sym = s.crop((0, 0, s.width, int(s.height * 0.58)))
bb = content_bbox(sym)
sym = sym.crop(bb)
side = max(sym.width, sym.height) + 8
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(sym, ((side - sym.width) // 2, (side - sym.height) // 2), sym)
sq.save(os.path.join(brand, "logo-symbol.png"))
for size in (32, 48, 180, 512):
    sq.resize((size, size), Image.Resampling.LANCZOS).save(
        os.path.join(brand, f"icon-{size}.png")
    )
print("symbol", sq.size)

# --- Dark / reversed horizontal ---
src = Image.open(os.path.join(brand, "Ashvi tech dark logo.png"))
d = make_transparent_dark(src)
bb = content_bbox(d)
# also include white pixels for dark logo
px = d.load()
w, hh = d.size
minx, miny, maxx, maxy = w, hh, 0, 0
for y in range(hh):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 10:
            continue
        if (r + g + b) > 500 or (g > 150 and b > 150 and r < 100) or (r < 80 and b > r):
            minx = min(minx, x)
            miny = min(miny, y)
            maxx = max(maxx, x)
            maxy = max(maxy, y)
d = d.crop((minx, miny, maxx + 1, maxy + 1))
d = pad(d, 20)
d.save(os.path.join(brand, "logo-horizontal-dark.png"))
print("horizontal-dark", d.size)

# OG
og = Image.new("RGB", (1200, 630), (2, 19, 54))
logo = Image.open(os.path.join(brand, "logo-horizontal-dark.png"))
target_w = 700
ratio = target_w / logo.width
logo2 = logo.resize((target_w, int(logo.height * ratio)), Image.Resampling.LANCZOS)
og.paste(logo2, ((1200 - logo2.width) // 2, (630 - logo2.height) // 2), logo2)
og.save(os.path.join(brand, "og-image.png"))
print("done")
