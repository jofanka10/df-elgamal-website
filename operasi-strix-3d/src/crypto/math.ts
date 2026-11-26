export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function modExp(base: number, exp: number, mod: number): number {
  if (mod <= 0) return 0;
  let result = 1n;
  let b = BigInt(((base % mod) + mod) % mod);
  let e = BigInt(Math.max(0, Math.floor(exp)));
  const m = BigInt(mod);
  while (e > 0n) {
    if (e & 1n) {
      result = (result * b) % m;
    }
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(result);
}

export function isPrimitiveRoot(g: number, p: number): boolean {
  if (!isPrime(p) || p > 20000) return false;
  if (g <= 1 || g >= p) return false;
  const seen = new Set<number>();
  let x = 1;
  for (let i = 0; i < p - 1; i++) {
    x = (x * g) % p;
    if (seen.has(x)) return false;
    seen.add(x);
  }
  return seen.size === p - 1;
}

export interface DiffieHellmanParams {
  p: number;
  g: number;
  x: number;
  y: number;
}

export interface DiffieHellmanResult {
  valid: boolean;
  error?: string;
  p: number;
  g: number;
  x: number;
  y: number;
  X: number;
  Y: number;
  K_lloyd: number;
  K_anya: number;
  colors: {
    base: string;
    lloydSecret: string;
    anyaSecret: string;
    lloydMix: string;
    anyaMix: string;
    shared: string;
    baseName: string;
    lloydSecretName: string;
    anyaSecretName: string;
    lloydMixName: string;
    anyaMixName: string;
    sharedName: string;
  };
}

export const DH_PRESET: DiffieHellmanParams = {
  p: 251,
  g: 6,
  x: 124,
  y: 158,
};

function valueToColor(val: number, p: number): string {
  const hue = Math.round(((val % Math.max(2, p)) / Math.max(2, p)) * 320);
  return `hsl(${hue}, 82%, 56%)`;
}

export function computeDiffieHellman(params: DiffieHellmanParams): DiffieHellmanResult {
  const { p, g, x, y } = params;
  const isPreset =
    p === DH_PRESET.p &&
    g === DH_PRESET.g &&
    x === DH_PRESET.x &&
    y === DH_PRESET.y;

  const fallbackColors = {
    base: '#f6d147',
    lloydSecret: '#eb5757',
    anyaSecret: '#3b82f6',
    lloydMix: '#f97316',
    anyaMix: '#22c55e',
    shared: '#6b4226',
    baseName: 'Kuning',
    lloydSecretName: 'Merah',
    anyaSecretName: 'Biru',
    lloydMixName: 'Oranye',
    anyaMixName: 'Hijau',
    sharedName: 'Cokelat Gelap',
  };

  if (!Number.isInteger(p) || !Number.isInteger(g) || !Number.isInteger(x) || !Number.isInteger(y)) {
    return {
      valid: false,
      error: 'Semua parameter harus berupa bilangan bulat.',
      p, g, x, y, X: 0, Y: 0, K_lloyd: 0, K_anya: 0,
      colors: fallbackColors,
    };
  }
  if (p < 5 || p > 10000) {
    return {
      valid: false,
      error: 'Ukuran katalog p sebaiknya antara 5 dan 10.000 agar visualisasi tetap responsif.',
      p, g, x, y, X: 0, Y: 0, K_lloyd: 0, K_anya: 0,
      colors: fallbackColors,
    };
  }
  if (!isPrime(p)) {
    return {
      valid: false,
      error: `p = ${p} bukan bilangan prima. Contoh prima: 23, 47, 251, 353.`,
      p, g, x, y, X: 0, Y: 0, K_lloyd: 0, K_anya: 0,
      colors: fallbackColors,
    };
  }
  if (!isPrimitiveRoot(g, p)) {
    return {
      valid: false,
      error: `g = ${g} bukan akar primitif dari p = ${p}. Coba nilai g lain.`,
      p, g, x, y, X: 0, Y: 0, K_lloyd: 0, K_anya: 0,
      colors: fallbackColors,
    };
  }
  if (x <= 1 || x >= p - 1 || y <= 1 || y >= p - 1) {
    return {
      valid: false,
      error: `Kunci rahasia x dan y harus berada di antara 2 hingga ${p - 2}.`,
      p, g, x, y, X: 0, Y: 0, K_lloyd: 0, K_anya: 0,
      colors: fallbackColors,
    };
  }

  const X = modExp(g, x, p);
  const Y = modExp(g, y, p);
  const K_lloyd = modExp(Y, x, p);
  const K_anya = modExp(X, y, p);

  const colors = isPreset
    ? fallbackColors
    : {
        base: '#f6d147',
        lloydSecret: '#eb5757',
        anyaSecret: '#3b82f6',
        lloydMix: valueToColor(X, p),
        anyaMix: valueToColor(Y, p),
        shared: '#6b4226',
        baseName: `Warna Dasar #${g}`,
        lloydSecretName: `Rahasia Lloyd #${x}`,
        anyaSecretName: `Rahasia Anya #${y}`,
        lloydMixName: `Campuran Lloyd #${X}`,
        anyaMixName: `Campuran Anya #${Y}`,
        sharedName: `Kunci Identik #${K_lloyd}`,
      };

  return {
    valid: true,
    p, g, x, y,
    X,
    Y,
    K_lloyd,
    K_anya,
    colors,
  };
}

// ---------------------------------------------------------------------------
// ElGamal
// ---------------------------------------------------------------------------

export interface ElGamalParams {
  p: number;
  g: number;
  x: number;
  message: string;
  customKs?: number[];
}

export interface ElGamalBlockInfo {
  index: number;
  label: string;
  digits: string;
  m: number;
  k: number;
  a: number;
  b: number;
  decryptedM: number;
  decryptedDigits: string;
}

export interface ElGamalResult {
  valid: boolean;
  error?: string;
  p: number;
  g: number;
  x: number;
  y: number;
  cleanMessage: string;
  letterPairs: { char: string; code: string }[];
  blockSize: number;
  blocks: ElGamalBlockInfo[];
  decryptedMessage: string;
}

export const EG_PRESET: ElGamalParams = {
  p: 2273,
  g: 3,
  x: 243,
  message: 'INTEL',
  customKs: [1055, 27, 239],
};

export function textToBlocks(text: string, p: number): {
  blocks: number[];
  paddedDigits: string[];
  labels: string[];
  blockSize: number;
  cleanMessage: string;
  letterPairs: { char: string; code: string }[];
} {
  const cleanMessage = text.toUpperCase().replace(/[^A-Z]/g, '');
  const letterPairs = cleanMessage.split('').map((ch) => ({
    char: ch,
    code: String(ch.charCodeAt(0) - 65).padStart(2, '0'),
  }));
  let digits = letterPairs.map((item) => item.code).join('');
  const blockSize = String(p - 1).length;

  let paddedChars = cleanMessage;
  while (digits.length % blockSize !== 0) {
    digits += '00';
    paddedChars += '_';
  }

  const blocks: number[] = [];
  const paddedDigits: string[] = [];
  const labels: string[] = [];
  const charsPerBlock = Math.max(1, Math.floor(blockSize / 2));

  for (let i = 0; i < digits.length; i += blockSize) {
    const chunk = digits.slice(i, i + blockSize);
    paddedDigits.push(chunk);
    blocks.push(parseInt(chunk, 10));
    const charIdx = Math.floor(i / 2);
    labels.push(paddedChars.slice(charIdx, charIdx + charsPerBlock));
  }

  return {
    blocks,
    paddedDigits,
    labels,
    blockSize,
    cleanMessage,
    letterPairs,
  };
}

export function blocksToText(blocks: number[], p: number, trimLength: number): string {
  const blockSize = String(p - 1).length;
  const digits = blocks.map((b) => String(b).padStart(blockSize, '0')).join('');
  let chars = '';
  for (let i = 0; i < digits.length; i += 2) {
    const val = parseInt(digits.slice(i, i + 2), 10);
    if (val >= 0 && val <= 25) {
      chars += String.fromCharCode(65 + val);
    }
  }
  return chars.slice(0, trimLength);
}

export function generateRandomKs(count: number, p: number): number[] {
  const maxK = Math.max(3, p - 2);
  const res: number[] = [];
  for (let i = 0; i < count; i++) {
    res.push(2 + Math.floor(Math.random() * (maxK - 2)));
  }
  return res;
}

export function computeElGamal(params: ElGamalParams): ElGamalResult {
  const { p, g, x, message, customKs } = params;
  const cleanMessage = message.toUpperCase().replace(/[^A-Z]/g, '');

  const emptyResult = (error: string): ElGamalResult => ({
    valid: false,
    error,
    p, g, x, y: 0,
    cleanMessage,
    letterPairs: [],
    blockSize: 4,
    blocks: [],
    decryptedMessage: '',
  });

  if (!Number.isInteger(p) || !Number.isInteger(g) || !Number.isInteger(x)) {
    return emptyResult('Parameter p, g, dan x harus berupa bilangan bulat.');
  }
  if (p < 257 || p > 10000) {
    return emptyResult('Pilih bilangan prima p antara 257 hingga 10.000 agar blok huruf 2-digit valid.');
  }
  if (!isPrime(p)) {
    return emptyResult(`p = ${p} bukan bilangan prima. Contoh prima: 2273, 2503, 3001.`);
  }
  if (!isPrimitiveRoot(g, p)) {
    return emptyResult(`g = ${g} bukan akar primitif dari p = ${p}.`);
  }
  if (x <= 1 || x >= p - 1) {
    return emptyResult(`Kunci privat Anya (x) harus di antara 2 hingga ${p - 2}.`);
  }
  if (cleanMessage.length === 0) {
    return emptyResult('Pesan minimal harus memiliki 1 huruf (A–Z).');
  }
  if (cleanMessage.length > 8) {
    return emptyResult('Untuk kejelasan panggung 3D, batasi panjang pesan maksimal 8 huruf.');
  }

  const blockSize = String(p - 1).length;
  if (blockSize < 4 || blockSize % 2 !== 0) {
    return emptyResult(`Gunakan bilangan prima p yang menghasilkan ukuran blok genap minimal 4 digit (misal 1001–9999, seperti 2273).`);
  }

  const y = modExp(g, x, p);
  const parsed = textToBlocks(cleanMessage, p);

  // Verify every block m < p
  for (let i = 0; i < parsed.blocks.length; i++) {
    if (parsed.blocks[i] >= p) {
      return emptyResult(
        `Nilai blok "${parsed.paddedDigits[i]}" (${parsed.blocks[i]}) melebihi atau sama dengan p = ${p}. Gunakan p yang lebih besar (misal p > 2525 seperti 2531) atau huruf dengan kode lebih kecil.`
      );
    }
  }

  const isExactPreset =
    p === EG_PRESET.p &&
    g === EG_PRESET.g &&
    x === EG_PRESET.x &&
    cleanMessage === EG_PRESET.message;

  const ks = isExactPreset
    ? EG_PRESET.customKs!
    : parsed.blocks.map((_, i) => {
        const candidate = customKs?.[i];
        if (candidate && candidate > 1 && candidate < p - 1) return candidate;
        return 17 + ((i * 73 + 29) % Math.max(5, p - 20));
      });

  const blocks: ElGamalBlockInfo[] = parsed.blocks.map((m, i) => {
    const k = ks[i];
    const a = modExp(g, k, p);
    const b = (modExp(y, k, p) * m) % p;
    const axInv = modExp(a, p - 1 - x, p);
    const decryptedM = (b * axInv) % p;
    return {
      index: i,
      label: parsed.labels[i],
      digits: parsed.paddedDigits[i],
      m,
      k,
      a,
      b,
      decryptedM,
      decryptedDigits: String(decryptedM).padStart(blockSize, '0'),
    };
  });

  const decryptedMessage = blocksToText(
    blocks.map((blk) => blk.decryptedM),
    p,
    cleanMessage.length
  );

  return {
    valid: true,
    p,
    g,
    x,
    y,
    cleanMessage,
    letterPairs: parsed.letterPairs,
    blockSize,
    blocks,
    decryptedMessage,
  };
}
