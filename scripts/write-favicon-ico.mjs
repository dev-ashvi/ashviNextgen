/**
 * Build a multi-size .ico that embeds PNG payloads (Vista+ / modern browsers).
 * Sources must be official AshviTech square PNGs.
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const sources = ["icon-32.png", "icon-48.png", "icon-96.png"].map((f) =>
  path.join(root, "public", "brand", f),
);
const pngs = sources.map((p) => fs.readFileSync(p));

const count = pngs.length;
const headerSize = 6 + count * 16;
let offset = headerSize;
const entries = pngs.map((buf, i) => {
  // Parse PNG IHDR for dimensions
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const entry = {
    w: w >= 256 ? 0 : w,
    h: h >= 256 ? 0 : h,
    size: buf.length,
    offset,
  };
  offset += buf.length;
  return entry;
});

const out = Buffer.alloc(offset);
out.writeUInt16LE(0, 0); // reserved
out.writeUInt16LE(1, 2); // type icon
out.writeUInt16LE(count, 4);

entries.forEach((e, i) => {
  const o = 6 + i * 16;
  out.writeUInt8(e.w, o);
  out.writeUInt8(e.h, o + 1);
  out.writeUInt8(0, o + 2); // color palette
  out.writeUInt8(0, o + 3); // reserved
  out.writeUInt16LE(1, o + 4); // planes
  out.writeUInt16LE(32, o + 6); // bit count
  out.writeUInt32LE(e.size, o + 8);
  out.writeUInt32LE(e.offset, o + 12);
});

let cursor = headerSize;
for (const buf of pngs) {
  buf.copy(out, cursor);
  cursor += buf.length;
}

const dest = path.join(root, "public", "favicon.ico");
fs.writeFileSync(dest, out);
console.log("wrote", dest, out.length, "bytes from", sources.length, "PNGs");
