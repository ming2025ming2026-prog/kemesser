// Relocate an end-of-file MP4 index without decoding or re-encoding any media.
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const file = path.resolve(__dirname, '../assets/video/kemesser-thawing-intro.mp4');
const data = fs.readFileSync(file);
function atoms(buffer, start = 0, end = buffer.length) {
  const result = [];
  for (let offset = start; offset < end;) {
    const size = buffer.readUInt32BE(offset);
    if (size < 8 || offset + size > end) throw new Error('Unsupported MP4 atom layout');
    result.push({ offset, size, type: buffer.toString('ascii', offset + 4, offset + 8) });
    offset += size;
  }
  return result;
}
const top = atoms(data);
const moov = top.find((atom) => atom.type === 'moov');
const mdat = top.find((atom) => atom.type === 'mdat');
if (!moov || !mdat) throw new Error('Missing media/index atom');
if (moov.offset < mdat.offset) { console.log('Already fast-start'); process.exit(0); }
if (top.at(-1) !== moov || top.filter((atom) => atom.type === 'mdat').length !== 1) throw new Error('Only a single-media MP4 with a trailing index is supported');
const index = Buffer.from(data.subarray(moov.offset, moov.offset + moov.size));
let entries = 0;
function relocate(start, end) {
  for (const atom of atoms(index, start, end)) {
    if (['moov', 'trak', 'mdia', 'minf', 'stbl'].includes(atom.type)) relocate(atom.offset + 8, atom.offset + atom.size);
    if (!['stco', 'co64'].includes(atom.type)) continue;
    const count = index.readUInt32BE(atom.offset + 12);
    const stride = atom.type === 'stco' ? 4 : 8;
    if (16 + count * stride !== atom.size) throw new Error('Invalid offset table');
    for (let i = 0; i < count; i++) {
      const offset = atom.offset + 16 + i * stride;
      const value = stride === 4 ? index.readUInt32BE(offset) : Number(index.readBigUInt64BE(offset));
      if (value < mdat.offset + 8 || value >= mdat.offset + mdat.size) throw new Error('Chunk outside media data');
      const next = value + moov.size;
      if (stride === 4) index.writeUInt32BE(next, offset);
      else index.writeBigUInt64BE(BigInt(next), offset);
      entries++;
    }
  }
}
relocate(0, index.length);
if (!entries) throw new Error('No chunk offsets relocated');
const result = Buffer.concat([data.subarray(0, mdat.offset), index, data.subarray(mdat.offset, moov.offset)]);
const nextMedia = atoms(result).find((atom) => atom.type === 'mdat');
const hash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const before = hash(data.subarray(mdat.offset + 8, mdat.offset + mdat.size));
const after = hash(result.subarray(nextMedia.offset + 8, nextMedia.offset + nextMedia.size));
if (before !== after || data.length !== result.length) throw new Error('Media integrity check failed');
fs.writeFileSync(file, result);
console.log(JSON.stringify({ entries, indexBytes: moov.size, bytes: result.length, mediaHashBefore: before, mediaHashAfter: after, atoms: atoms(result) }, null, 2));
