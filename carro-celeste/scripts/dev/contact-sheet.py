"""Development aid: tile several screenshots into one image.

python3 scripts/dev/contact-sheet.py out.png <columns> a.png b.png ...
"""
import sys

from PIL import Image

out, columns, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
images = [Image.open(name).convert("RGB") for name in files]
width, height = images[0].size
rows = (len(images) + columns - 1) // columns
sheet = Image.new("RGB", (width * columns, height * rows), (0, 0, 0))
for index, image in enumerate(images):
    sheet.paste(image, ((index % columns) * width, (index // columns) * height))
sheet.save(out)
print(sheet.size)
