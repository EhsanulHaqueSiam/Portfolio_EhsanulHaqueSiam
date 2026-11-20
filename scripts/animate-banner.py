# Animates waterfalls in a pixel-art banner as a seamless loop.
# Falling water (long vertical runs of pale pixels) gets a blocky brightness
# pattern that scrolls down one pixel-block per frame; its period equals the
# frame count, so the last frame flows straight into the first. Foam at the
# foot of each fall sparkles, and small bright specks elsewhere (stars,
# fireflies, lanterns) twinkle.
# usage: uv run --with pillow --with numpy python scripts/animate-banner.py <src.png> <out_dir> [frames] [rect=x0,y0,x1,y1 ...] [circle=x,y,r ...]
# The current banner: src = the 3:1 centre crop of the generated still, 10 frames,
#   circle=820,98,100 rect=0,0,1360,40 (keep the moon and sky still), then
#   img2webp -loop 0 -lossy -q 72 -m 6 -d 110 out/f*.png -o public/images/banner-anim.webp
#   rect/circle (1360px-wide coords) keep pale non-water areas (sky, moon) still.
import math
import random
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src, out = Path(sys.argv[1]), Path(sys.argv[2])
FRAMES = int(sys.argv[3]) if len(sys.argv) > 3 else 10
EXCLUDE = [a.split("=") for a in sys.argv[4:]]
out.mkdir(parents=True, exist_ok=True)
W, BLOCK, MIN_RUN = 1360, 3, 15

img = Image.open(src).convert("RGB")
img = img.resize((W, round(img.height * W / img.width)), Image.LANCZOS)
base = np.asarray(img).astype(np.float32)
H = base.shape[0]
R, G, B = base[..., 0], base[..., 1], base[..., 2]
mx, mn = base.max(-1), base.min(-1)
lum = 0.299 * R + 0.587 * G + 0.114 * B

# Candidate water: pale and unsaturated, or bright and clearly blue/turquoise.
pale = ((lum > 150) & (mx - mn < 80) & (B >= R - 20)) | ((lum > 120) & (B > 150) & (B > R + 40))

yy, xx = np.mgrid[0:H, 0:W]
for kind, nums in EXCLUDE:
    v = [int(n) for n in nums.split(",")]
    if kind == "rect":
        pale[v[1] : v[3], v[0] : v[2]] = False
    elif kind == "circle":
        pale[(xx - v[0]) ** 2 + (yy - v[1]) ** 2 <= v[2] ** 2] = False

# Falls are narrow: drop candidates in horizontal runs wider than 260px (pools, sky).
for y in range(H):
    row = pale[y]
    x = 0
    while x < W:
        if row[x]:
            x0 = x
            while x < W and row[x]:
                x += 1
            if x - x0 > 260:
                row[x0:x] = False
        else:
            x += 1

# Keep only pixels inside a vertical run of at least MIN_RUN pale pixels.
water = np.zeros_like(pale)
foot = np.zeros_like(pale)
for x in range(W):
    col = pale[:, x]
    y = 0
    while y < H:
        if col[y]:
            y0 = y
            while y < H and col[y]:
                y += 1
            if y - y0 >= MIN_RUN:
                water[y0:y, x] = True
                foot[max(y0, y - 9) : y, x] = True
        else:
            y += 1

rng = random.Random(7)
cols = math.ceil(W / BLOCK)
col_phase = np.repeat(np.array([rng.random() for _ in range(cols)], dtype=np.float32), BLOCK)[:W]
col_speed = np.repeat(np.array([rng.choice([1, 1, 1, 2]) for _ in range(cols)], dtype=np.int32), BLOCK)[:W]
yb = (np.arange(H) // BLOCK)[:, None].astype(np.float32)

# Twinkle specks: small bright points outside the falls whose 15px surroundings are dark
# (stars, fireflies, lantern cores), not big bright shapes like the moon.
def box_mean(a, r):
    c = np.pad(a, r + 1, mode="edge").cumsum(0).cumsum(1)
    n = 2 * r + 1
    return (c[n:, n:] - c[:-n, n:] - c[n:, :-n] + c[:-n, :-n])[: a.shape[0], : a.shape[1]] / (n * n)
speck = (lum > 175) & ~water & (box_mean(lum, 7) < lum * 0.55)
CELL = 6
ch, cw = math.ceil(H / CELL), math.ceil(W / CELL)
cell_phase = np.kron(np.array([[rng.random() for _ in range(cw)] for _ in range(ch)], dtype=np.float32), np.ones((CELL, CELL)))[:H, :W]

for f in range(FRAMES):
    t = f / FRAMES
    frame = base.copy()

    # Downward-scrolling streaks: phase moves by speed/FRAMES of a period per frame.
    s = np.sin(2 * math.pi * ((yb - f * col_speed[None, :]) / FRAMES + col_phase[None, :]))
    k = np.where(s > 0.55, 1.14, np.where(s < -0.55, 0.84, 1.0))
    frame[water] *= k[water][:, None]

    # Foam: random pale sparkle at the foot of each run (fresh each frame).
    noise = np.random.default_rng(f).random((H, W))
    sp = foot & (noise > 0.55)
    frame[sp] = frame[sp] * 0.5 + 255 * 0.5

    # Specks twinkle 45%..100%.
    tw = 0.45 + 0.55 * (0.5 + 0.5 * np.cos(2 * math.pi * (t + cell_phase)))
    frame[speck] *= tw[speck][:, None]

    Image.fromarray(np.clip(frame, 0, 255).astype(np.uint8)).save(out / f"f{f:02d}.png")

Image.fromarray(base.astype(np.uint8)).save(out / "still.png")
print(f"{out}: water px={int(water.sum())} foot px={int(foot.sum())} specks={int(speck.sum())}")
