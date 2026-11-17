/**
 * Self-contained pure TypeScript QR Code generator (Model 2, Byte mode, ECC Level M).
 * Generates standards-compliant QR module matrices without any external network dependencies.
 */

const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

for (let i = 0, x = 1; i < 255; i++) {
  GF256_EXP[i] = x;
  GF256_EXP[i + 255] = x;
  GF256_LOG[x] = i;
  x <<= 1;
  if (x & 256) x ^= 0x11d;
}

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[(GF256_LOG[x] + GF256_LOG[y]) % 255];
}

function polyMul(p1: Uint8Array, p2: Uint8Array): Uint8Array {
  const result = new Uint8Array(p1.length + p2.length - 1);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMul(p1[i], p2[j]);
    }
  }
  return result;
}

function getGeneratorPoly(degree: number): Uint8Array {
  let g: Uint8Array = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    g = polyMul(g, new Uint8Array([1, GF256_EXP[i]])) as Uint8Array;
  }
  return g;
}

function rsEncode(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = getGeneratorPoly(ecCount);
  const msg = new Uint8Array(data.length + ecCount);
  msg.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

interface VersionInfo {
  total: number;
  dataM: number;
  ecM: number;
  bM: [number, number, number][]; // [blockCount, dataLenPerBlock, ecLenPerBlock]
}

const VERSION_TABLE: (VersionInfo | null)[] = [
  null,
  // v1: 21x21
  { total: 26, dataM: 16, ecM: 10, bM: [[1, 16, 10]] },
  // v2: 25x25
  { total: 44, dataM: 28, ecM: 16, bM: [[1, 28, 16]] },
  // v3: 29x29
  { total: 70, dataM: 44, ecM: 26, bM: [[1, 44, 26]] },
  // v4: 33x33
  { total: 100, dataM: 64, ecM: 36, bM: [[2, 32, 18]] },
  // v5: 37x37
  { total: 134, dataM: 86, ecM: 48, bM: [[2, 43, 24]] },
  // v6: 41x41
  { total: 172, dataM: 108, ecM: 64, bM: [[4, 27, 16]] },
  // v7: 45x45
  { total: 196, dataM: 124, ecM: 72, bM: [[4, 31, 18]] },
  // v8: 49x49
  {
    total: 242,
    dataM: 154,
    ecM: 88,
    bM: [
      [2, 38, 22],
      [2, 39, 22],
    ],
  },
  // v9: 53x53
  {
    total: 292,
    dataM: 182,
    ecM: 110,
    bM: [
      [3, 36, 22],
      [2, 37, 22],
    ],
  },
  // v10: 57x57
  {
    total: 346,
    dataM: 216,
    ecM: 130,
    bM: [
      [4, 43, 26],
      [1, 44, 26],
    ],
  },
];

const ALIGNMENT_PATTERNS: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

// Format info bitmasks for ECC Level M (00)
const FORMAT_INFO_M = [
  0x5412 ^ 0x0000,
  0x5412 ^ 0x0537,
  0x5412 ^ 0x0a6e,
  0x5412 ^ 0x0f59,
  0x5412 ^ 0x11f1,
  0x5412 ^ 0x14c6,
  0x5412 ^ 0x1b9f,
  0x5412 ^ 0x1ea8,
];

function isMasked(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    case 7:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    default:
      return false;
  }
}

export function generateQRMatrix(text: string): boolean[][] {
  const utf8 = new TextEncoder().encode(text);
  let version = 1;
  while (version <= 10 && utf8.length + 3 > (VERSION_TABLE[version]?.dataM ?? 0)) {
    version++;
  }
  if (version > 10) {
    throw new Error("Text too long for supported QR capacity");
  }

  const vInfo = VERSION_TABLE[version]!;
  const dataCapacity = vInfo.dataM;

  const bits: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  }

  // 0100 = 8-bit byte mode
  pushBits(0b0100, 4);
  pushBits(utf8.length, version <= 9 ? 8 : 16);
  for (let i = 0; i < utf8.length; i++) {
    pushBits(utf8[i], 8);
  }

  // Terminator
  const rem = dataCapacity * 8 - bits.length;
  const termLen = Math.min(4, rem);
  pushBits(0, termLen);

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  // Pad bytes
  let padToggle = false;
  while (bits.length < dataCapacity * 8) {
    pushBits(padToggle ? 0x11 : 0xec, 8);
    padToggle = !padToggle;
  }

  const dataBytes = new Uint8Array(dataCapacity);
  for (let i = 0; i < dataCapacity; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j];
    }
    dataBytes[i] = b;
  }

  // Segment into blocks and compute RS error correction
  const blocks: { data: Uint8Array; ec: Uint8Array }[] = [];
  let offset = 0;
  for (const [count, dataLen, ecLen] of vInfo.bM) {
    for (let c = 0; c < count; c++) {
      const bData = dataBytes.slice(offset, offset + dataLen);
      offset += dataLen;
      const bEc = rsEncode(bData, ecLen);
      blocks.push({ data: bData, ec: bEc });
    }
  }

  // Interleave data codewords
  const finalCodewords: number[] = [];
  let maxDataLen = 0;
  for (const b of blocks) maxDataLen = Math.max(maxDataLen, b.data.length);
  for (let i = 0; i < maxDataLen; i++) {
    for (const b of blocks) {
      if (i < b.data.length) finalCodewords.push(b.data[i]);
    }
  }

  let maxEcLen = 0;
  for (const b of blocks) maxEcLen = Math.max(maxEcLen, b.ec.length);
  for (let i = 0; i < maxEcLen; i++) {
    for (const b of blocks) {
      if (i < b.ec.length) finalCodewords.push(b.ec[i]);
    }
  }

  // Matrix creation
  const size = 17 + 4 * version;
  const matrix: (number | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function setFunc(r: number, c: number, val: number) {
    matrix[r][c] = val;
    isFunction[r][c] = true;
  }

  // Add finders
  function addFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr < 0 || tr >= size || tc < 0 || tc >= size) continue;
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          const isBlack =
            r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          setFunc(tr, tc, isBlack ? 1 : 0);
        } else {
          setFunc(tr, tc, 0);
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Alignment patterns
  const alignCoords = ALIGNMENT_PATTERNS[version] || [];
  for (const r of alignCoords) {
    for (const c of alignCoords) {
      if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const isBlack = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          setFunc(r + dr, c + dc, isBlack ? 1 : 0);
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) setFunc(6, i, i % 2 === 0 ? 1 : 0);
    if (matrix[i][6] === null) setFunc(i, 6, i % 2 === 0 ? 1 : 0);
  }

  // Dark module
  setFunc(4 * version + 9, 8, 1);

  // Reserve format info
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) setFunc(8, i, 0);
    if (matrix[i][8] === null) setFunc(i, 8, 0);
  }
  for (let i = size - 8; i < size; i++) {
    if (matrix[8][i] === null) setFunc(8, i, 0);
    if (matrix[i][8] === null) setFunc(i, 8, 0);
  }

  // Convert codewords to bit stream
  const dataBits: number[] = [];
  for (const byte of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      dataBits.push((byte >> i) & 1);
    }
  }

  // Place data bits zig-zag
  let bitIdx = 0;
  let upwards = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--;
    const rows = upwards
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);
    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isFunction[r][c]) {
          matrix[r][c] = bitIdx < dataBits.length ? dataBits[bitIdx++] : 0;
        }
      }
    }
    upwards = !upwards;
  }

  // Apply standard mask 0
  const mask = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c] && isMasked(mask, r, c)) {
        matrix[r][c] = (matrix[r][c] ?? 0) ^ 1;
      }
    }
  }

  // Write format info (Mask 0, Level M)
  const fmtBits = FORMAT_INFO_M[mask];
  for (let i = 0; i < 15; i++) {
    const bit = (fmtBits >> (14 - i)) & 1;
    if (i <= 5) matrix[8][i] = bit;
    else if (i === 6) matrix[8][7] = bit;
    else if (i === 7) matrix[8][8] = bit;
    else if (i === 8) matrix[7][8] = bit;
    else matrix[14 - i][8] = bit;

    if (i < 8) matrix[size - 1 - i][8] = bit;
    else matrix[8][size - 15 + i] = bit;
  }

  return matrix.map((row) => row.map((cell) => cell === 1));
}
