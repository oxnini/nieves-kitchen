"""Match a pantry drawing to the shelf: one brown ink, the pomegranate red as the
only accent, and a square canvas at a matched optical size, so a tall bottle
and a wide bowl look alike on the same object-contain plate.

  python3 scripts/harmonize-pantry-art.py <src-dir> <out-dir> [--unfill]

Writes <out-dir>/<name>.png for every image in <src-dir>; convert with
`cwebp -q 82` into public/pantry/ (see the addpantry skill)."""
import os
import sys

import numpy as np
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]
# --unfill: pale opaque fills (cream bones, white seeds) fade to see-through, so
# nothing shows as a pale patch on the page or the night shelf
UNFILL = "--unfill" in sys.argv
INK = (0x56, 0x3A, 0x24)      # one warm brown for every line
ACCENT = (0xCB, 0x45, 0x28)   # the pomegranate seed red
PAPER = (0xF2, 0xEC, 0xE2)    # light opaque fills (seed highlights) stay paper-pale
CANVAS = 768
OPTICAL = 0.66                # sqrt(w*h) of the ink box, as a share of the canvas
CAP = 0.92                    # longest side never exceeds this share

def to_lin(c): c = c/255; return np.where(c <= 0.04045, c/12.92, ((c+0.055)/1.055)**2.4)
def to_srgb(c): c = np.clip(c,0,1); return np.where(c <= 0.0031308, c*12.92, 1.055*c**(1/2.4)-0.055)*255
M = np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]])
Mi = np.linalg.inv(M); WP = np.array([0.95047,1.0,1.08883])
def f(t): return np.where(t > 216/24389, np.cbrt(t), (24389/27*t+16)/116)
def fi(t): return np.where(t**3 > 216/24389, t**3, (116*t-16)/(24389/27))
def lab(rgb):
    xyz = to_lin(rgb) @ M.T / WP; fx,fy,fz = f(xyz[...,0]),f(xyz[...,1]),f(xyz[...,2])
    return np.stack([116*fy-16, 500*(fx-fy), 200*(fy-fz)], -1)
def rgb(lab_):
    fy = (lab_[...,0]+16)/116; fx = fy+lab_[...,1]/500; fz = fy-lab_[...,2]/200
    xyz = np.stack([fi(fx),fi(fy),fi(fz)],-1)*WP; return to_srgb(xyz @ Mi.T)

INK_L, ACC_L, PAPER_L = (lab(np.array(c,float)) for c in (INK, ACCENT, PAPER))

for name in sorted(os.listdir(SRC)):
    a = np.asarray(Image.open(os.path.join(SRC,name)).convert("RGBA")).astype(float)
    px, al = a[...,:3], a[...,3]
    L = lab(px)
    r,g = px[...,0], px[...,1]
    solid = al > 200
    # accent weight: how red (r/g) and how chromatic, eased so edges blend
    ratio = r/(g+1)
    w = np.clip((ratio-1.45)/(1.80-1.45),0,1) * np.clip((r-90)/40,0,1)
    acc_m = solid & (w > 0.9); ink_m = solid & (w < 0.1) & (L[...,0] < 55)
    acc_med = np.median(L[acc_m],0) if acc_m.any() else ACC_L
    ink_med = np.median(L[ink_m][:,0]) if ink_m.any() else INK_L[0]
    # ink: map this image's own ink→paper lightness range onto the shared INK→PAPER ramp
    t = np.clip((L[...,0]-ink_med)/(PAPER_L[0]-ink_med),0,1)[...,None]
    ink_new = INK_L*(1-t) + PAPER_L*t
    # accent: shared hue/chroma, keep this pixel's lightness offset from its image median
    acc_new = np.empty_like(L)
    acc_new[...,0] = np.clip(ACC_L[0] + (L[...,0]-acc_med[0]), 20, 90)
    chroma = np.hypot(L[...,1],L[...,2]); cm = np.hypot(acc_med[1],acc_med[2])
    s = np.clip(chroma/cm,0,1.3)[...,None]
    acc_new[...,1:] = ACC_L[1:]*s
    out = ink_new*(1-w[...,None]) + acc_new*w[...,None]
    if UNFILL:
        al = al * np.where(w > 0.5, 1, np.clip((1 - t[...,0]) / 0.35, 0, 1))
    res = np.dstack([rgb(out), al]).clip(0,255).astype(np.uint8)
    im = Image.fromarray(res)
    # crop to ink and re-seat at matched optical size
    ys,xs = np.where(al > 16); im = im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
    bw,bh = im.size
    scale = min(OPTICAL*CANVAS/np.sqrt(bw*bh), CAP*CANVAS/max(bw,bh))
    im = im.resize((round(bw*scale),round(bh*scale)), Image.LANCZOS)
    canvas = Image.new("RGBA",(CANVAS,CANVAS),(0,0,0,0))
    canvas.paste(im,((CANVAS-im.width)//2,(CANVAS-im.height)//2),im)
    canvas.save(os.path.join(OUT,os.path.splitext(name)[0]+".png"))
    print(f"{name:16s} ink L {ink_med:5.1f}→{INK_L[0]:.1f}  accent {acc_m.sum():6d}px  scale {scale:.2f}  long side {max(im.size)/CANVAS:.2f}")
