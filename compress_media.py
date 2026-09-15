#!/usr/bin/env python3
r"""
compress_media.py
==================
Website ke images (jpg/png/webp) aur PDFs ka size kam karta hai — poore
folder ko recursively scan karke.

USAGE
-----
    python compress_media.py <folder> [options]

EXAMPLES
--------
    # Sirf dekho kya-kya compress hoga, kuch badlega nahi (dry run)
    python compress_media.py "D:\cgs\Website\public" --dry-run

    # Asli compress karo, originals ko ek backup folder mein rakh ke
    python compress_media.py "D:\cgs\Website\public"

    # Backup ke bina, seedha overwrite (SAVE HONE SE PEHLE APNA DATA BACKUP
    # KAR LO KAHIN AUR - yeh option risky hai)
    python compress_media.py "D:\cgs\Website\public" --no-backup

    # Image quality/max-width control karo
    python compress_media.py "D:\cgs\Website\public" --quality 75 --max-width 1600

WHAT IT DOES
------------
- Images (.jpg/.jpeg/.png/.webp):
    - Bade images ko ek maximum width tak resize karta hai (default 1920px,
      taaki 4000px wali phone photos website par zaroorat se zyada bhaari
      na rahe)
    - JPEG/WEBP ko quality 80 (default, adjustable) par re-save karta hai
    - PNG ko lossless optimize karta hai (transparency wale images ke liye)
- PDFs (.pdf):
    - Content streams compress karta hai (pypdf's built-in compression)
    - Duplicate/unused objects hata deta hai
    - Note: agar PDF mein bahut saari high-res images hain, yeh utna
      compress nahi karega jitna Ghostscript karta — agar Ghostscript
      (`gs`) tumhare system par installed hai, script use khud detect
      karke behtar compression try karega.

SAFETY
------
Default behaviour: original files ek `_originals_backup` folder mein copy
kar deta hai (usi jagah jahan se command chalaya), phir hi original file ko
compressed version se replace karta hai. `--no-backup` se yeh skip hota hai.

Requirements: pip install Pillow pypdf
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow missing hai. Pehle chalao: pip install Pillow pypdf")
    sys.exit(1)

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    print("pypdf missing hai. Pehle chalao: pip install Pillow pypdf")
    sys.exit(1)


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
PDF_EXTS = {".pdf"}
SKIP_DIR_NAMES = {"node_modules", ".git", "bin", "obj", "build", "dist", ".vs", "__pycache__"}


def should_skip_dir(path: Path) -> bool:
    return any(part in SKIP_DIR_NAMES for part in path.parts)


def human_size(num_bytes):
    for unit in ["B", "KB", "MB", "GB"]:
        if num_bytes < 1024:
            return f"{num_bytes:.1f}{unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f}TB"


def has_ghostscript():
    return shutil.which("gs") is not None or shutil.which("gswin64c") is not None


def compress_image(path: Path, quality: int, max_width: int, dry_run: bool) -> tuple[int, int]:
    """Returns (original_size, new_size) in bytes."""
    original_size = path.stat().st_size

    if dry_run:
        return original_size, original_size  # can't know the real result without doing it

    try:
        img = Image.open(path)
        img_format = img.format  # JPEG / PNG / WEBP

        # Resize if wider than max_width, keeping aspect ratio
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        save_kwargs = {}
        if img_format in ("JPEG",):
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            save_kwargs = {"quality": quality, "optimize": True, "progressive": True}
        elif img_format == "WEBP":
            save_kwargs = {"quality": quality, "method": 6}
        elif img_format == "PNG":
            save_kwargs = {"optimize": True}
        else:
            save_kwargs = {"quality": quality, "optimize": True}

        img.save(path, format=img_format, **save_kwargs)
    except Exception as e:
        print(f"  ⚠ Skip (error): {path.name} -> {e}")
        return original_size, original_size

    new_size = path.stat().st_size
    return original_size, new_size


def compress_pdf(path: Path, dry_run: bool) -> tuple[int, int]:
    original_size = path.stat().st_size

    if dry_run:
        return original_size, original_size

    # Prefer Ghostscript if available — it compresses embedded images too,
    # which pypdf alone cannot do.
    if has_ghostscript():
        gs_bin = shutil.which("gs") or shutil.which("gswin64c")
        tmp_out = path.with_suffix(".tmp_compressed.pdf")
        try:
            subprocess.run(
                [
                    gs_bin,
                    "-sDEVICE=pdfwrite",
                    "-dCompatibilityLevel=1.4",
                    "-dPDFSETTINGS=/ebook",  # good balance of quality vs size
                    "-dNOPAUSE",
                    "-dQUIET",
                    "-dBATCH",
                    f"-sOutputFile={tmp_out}",
                    str(path),
                ],
                check=True,
                capture_output=True,
            )
            if tmp_out.exists() and tmp_out.stat().st_size > 0:
                shutil.move(str(tmp_out), str(path))
                return original_size, path.stat().st_size
        except Exception as e:
            print(f"  ⚠ Ghostscript failed for {path.name}, falling back to pypdf: {e}")
            if tmp_out.exists():
                tmp_out.unlink()

    # Fallback: pypdf content-stream compression (works, but modest gains)
    try:
        reader = PdfReader(str(path))
        writer = PdfWriter()
        for page in reader.pages:
            page.compress_content_streams()  # lossless-ish stream compression
            writer.add_page(page)
        tmp_out = path.with_suffix(".tmp_compressed.pdf")
        with open(tmp_out, "wb") as f:
            writer.write(f)
        if tmp_out.stat().st_size < original_size:
            shutil.move(str(tmp_out), str(path))
        else:
            tmp_out.unlink()  # compression didn't help, keep original
    except Exception as e:
        print(f"  ⚠ Skip (error): {path.name} -> {e}")

    return original_size, path.stat().st_size


def main():
    parser = argparse.ArgumentParser(description="Compress website images and PDFs.")
    parser.add_argument("folder", help="Folder to scan recursively (e.g. public/, wwwroot/uploads)")
    parser.add_argument("--quality", type=int, default=80, help="JPEG/WEBP quality 1-100 (default 80)")
    parser.add_argument("--max-width", type=int, default=1920, help="Resize images wider than this (default 1920px)")
    parser.add_argument("--no-backup", action="store_true", help="Skip backing up originals before compressing")
    parser.add_argument("--dry-run", action="store_true", help="Show what would happen, change nothing")
    args = parser.parse_args()

    root = Path(args.folder).resolve()
    if not root.exists():
        print(f"Folder not found: {root}")
        sys.exit(1)

    files = [
        p for p in root.rglob("*")
        if p.is_file() and p.suffix.lower() in (IMAGE_EXTS | PDF_EXTS) and not should_skip_dir(p.relative_to(root))
    ]
    if not files:
        print("Koi image/PDF nahi mili is folder mein.")
        return

    print(f"{len(files)} files mili. {'(DRY RUN — kuch badlega nahi)' if args.dry_run else ''}\n")

    if not args.dry_run and not args.no_backup:
        backup_dir = root.parent / f"{root.name}_originals_backup"
        print(f"Originals backup ho rahe hain yahan: {backup_dir}\n")
        for f in files:
            rel = f.relative_to(root)
            dest = backup_dir / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            if not dest.exists():
                shutil.copy2(f, dest)

    if not args.dry_run and has_ghostscript():
        print("Ghostscript mila — PDFs behtar compress honge.\n")
    elif not args.dry_run:
        print("Ghostscript nahi mila — PDFs sirf halka compress honge (behtar ke liye Ghostscript install karo: https://ghostscript.com/releases/gsdnld.html)\n")

    total_before = 0
    total_after = 0

    for f in files:
        ext = f.suffix.lower()
        if ext in IMAGE_EXTS:
            before, after = compress_image(f, args.quality, args.max_width, args.dry_run)
        else:
            before, after = compress_pdf(f, args.dry_run)

        total_before += before
        total_after += after
        saved_pct = (1 - after / before) * 100 if before else 0
        print(f"  {f.relative_to(root)}: {human_size(before)} -> {human_size(after)} ({saved_pct:.0f}% saved)")

    print("\n" + "=" * 50)
    print(f"Total: {human_size(total_before)} -> {human_size(total_after)}")
    if total_before:
        print(f"Overall saved: {(1 - total_after / total_before) * 100:.1f}%")
    print("=" * 50)


if __name__ == "__main__":
    main()