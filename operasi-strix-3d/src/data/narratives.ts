import { DiffieHellmanResult, ElGamalResult } from '../crypto/math';

export type MissionId = 'diffie-hellman' | 'elgamal';

export interface StageNarration {
  step: number;
  shortTitle: string;
  headline: string;
  speakerText: string;
  analogyBadge: string;
  highlights: { label: string; value: string; tone: 'purple' | 'pink' | 'green' | 'amber' | 'neutral' }[];
}

export function getDiffieHellmanNarrations(dh: DiffieHellmanResult): StageNarration[] {
  return [
    {
      step: 1,
      shortTitle: 'Persiapan Bahan',
      headline: 'Tahap 1: Persiapan Cat Dasar & Warna Rahasia',
      speakerText: `Di meja tengah (Zona Publik), diletakkan satu tabung berisi cat dasar ${dh.colors.baseName} (g = ${dh.g}) dari katalog ${dh.p} warna yang dapat dilihat semua orang. Sementara itu, di dalam bilik kaca buram yang tertutup dari pengintaian, Lloyd menyiapkan botol rahasia ${dh.colors.lloydSecretName} (x = ${dh.x}) dan Anya menyiapkan botol rahasia ${dh.colors.anyaSecretName} (y = ${dh.y}).`,
      analogyBadge: 'Privat & Terlindung',
      highlights: [
        { label: 'Katalog Warna (p)', value: `${dh.p}`, tone: 'neutral' },
        { label: 'Cat Publik (g)', value: `${dh.g} · ${dh.colors.baseName}`, tone: 'amber' },
        { label: 'Rahasia Lloyd (x)', value: `${dh.x} · ${dh.colors.lloydSecretName}`, tone: 'pink' },
        { label: 'Rahasia Anya (y)', value: `${dh.y} · ${dh.colors.anyaSecretName}`, tone: 'purple' },
      ],
    },
    {
      step: 2,
      shortTitle: 'Pencampuran Awal',
      headline: 'Tahap 2: Mencampur Cat Publik dengan Rahasia Pribadi',
      speakerText: `Lloyd mengambil cat publik ${dh.colors.baseName} lalu mencampurkannya dengan cat rahasianya (${dh.colors.lloydSecretName}) hingga menghasilkan cat campuran ${dh.colors.lloydMixName} (X = ${dh.X}). Secara bersamaan, Anya mencampur cat publik dengan cat rahasianya (${dh.colors.anyaSecretName}) hingga menjadi ${dh.colors.anyaMixName} (Y = ${dh.Y}).`,
      analogyBadge: 'Mudah Dicampur, Sulit Dipisah',
      highlights: [
        { label: 'Campuran Lloyd (X)', value: `${dh.X} (${dh.colors.lloydMixName})`, tone: 'pink' },
        { label: 'Campuran Anya (Y)', value: `${dh.Y} (${dh.colors.anyaMixName})`, tone: 'purple' },
        { label: 'Rumus Lloyd', value: `${dh.g}^${dh.x} mod ${dh.p} = ${dh.X}`, tone: 'neutral' },
        { label: 'Rumus Anya', value: `${dh.g}^${dh.y} mod ${dh.p} = ${dh.Y}`, tone: 'neutral' },
      ],
    },
    {
      step: 3,
      shortTitle: 'Pertukaran Publik',
      headline: 'Tahap 3: Pengiriman di Jalur Publik & Pengintaian Penyadap',
      speakerText: `Tabung ${dh.colors.lloydMixName} (X = ${dh.X}) meluncur menuju Anya, dan tabung ${dh.colors.anyaMixName} (Y = ${dh.Y}) meluncur menuju Lloyd melalui jalur terbuka. Penyadap di tengah hanya melihat dua warna campuran tersebut — sama seperti cat yang sudah diaduk, mustahil baginya memisahkan kembali warna asli masing-masing agen.`,
      analogyBadge: 'Jalur Terbuka Aman',
      highlights: [
        { label: 'Terlihat Penyadap (X)', value: `${dh.X} · ${dh.colors.lloydMixName}`, tone: 'pink' },
        { label: 'Terlihat Penyadap (Y)', value: `${dh.Y} · ${dh.colors.anyaMixName}`, tone: 'purple' },
        { label: 'Status Penyadap', value: 'Gagal menebak x dan y', tone: 'amber' },
      ],
    },
    {
      step: 4,
      shortTitle: 'Kunci Bersama',
      headline: 'Tahap 4: Pencampuran Terakhir & Kunci Identik',
      speakerText: `Lloyd menuangkan botol rahasia ${dh.colors.lloydSecretName} miliknya ke dalam tabung ${dh.colors.anyaMixName} dari Anya. Di sisi seberang, Anya menuangkan botol ${dh.colors.anyaSecretName} miliknya ke dalam tabung ${dh.colors.lloydMixName} dari Lloyd. Keduanya berakhir dengan warna ${dh.colors.sharedName} yang sama persis (K = K' = ${dh.K_lloyd}) tanpa pernah mengirim cat rahasia mereka!`,
      analogyBadge: 'Kunci Rahasia Disepakati',
      highlights: [
        { label: 'Hasil Lloyd (K)', value: `${dh.K_lloyd} (${dh.colors.sharedName})`, tone: 'green' },
        { label: "Hasil Anya (K')", value: `${dh.K_anya} (${dh.colors.sharedName})`, tone: 'green' },
        { label: 'Status Misi', value: 'Identik & Terverifikasi', tone: 'green' },
      ],
    },
  ];
}

export function getElGamalNarrations(eg: ElGamalResult): StageNarration[] {
  const blockSummary = eg.blocks
    .map((b) => `(${b.a}, ${b.b})`)
    .join('  ·  ');
  const plainDigitsSummary = eg.blocks.map((b) => b.digits).join(' · ');

  return [
    {
      step: 1,
      shortTitle: 'Kunci & Gembok',
      headline: 'Tahap 1: Anya Membuat Gembok Publik & Mengirimnya ke Lloyd',
      speakerText: `Anya menyimpan satu-satunya anak kunci emas rahasia (x = ${eg.x}) di dalam bilik privatnya. Dari kunci emas tersebut, Anya mencetak gembok publik (y = ${eg.y}) dalam keadaan TERBUKA dan mengirimkannya ke meja Lloyd. Siapa pun boleh melihat atau memakai gembok ini untuk mengunci kotak, tetapi hanya Anya yang bisa membukanya.`,
      analogyBadge: 'Asimetris: Gembok vs Anak Kunci',
      highlights: [
        { label: 'Parameter Publik', value: `p = ${eg.p}, g = ${eg.g}`, tone: 'neutral' },
        { label: 'Kunci Privat Anya (x)', value: `${eg.x} (Anak Kunci Emas)`, tone: 'amber' },
        { label: 'Gembok Publik (y)', value: `${eg.y} (${eg.g}^${eg.x} mod ${eg.p})`, tone: 'purple' },
      ],
    },
    {
      step: 2,
      shortTitle: 'Pemecahan Blok',
      headline: `Tahap 2: Mengubah Pesan "${eg.cleanMessage}" Menjadi Kotak Kargo Angka`,
      speakerText: `Lloyd menerjemahkan setiap huruf laporan rahasia "${eg.cleanMessage}" menjadi pasangan 2 digit (A=00 hingga Z=25), lalu mengemasnya ke dalam ${eg.blocks.length} kotak kargo logam bernomor ${plainDigitsSummary}. Pembagian blok memastikan setiap muatan muat dan aman dihitung di dalam ruang sandi p = ${eg.p}.`,
      analogyBadge: 'Pengemasan Muatan Rahasia',
      highlights: eg.blocks.map((b, idx) => ({
        label: `Kotak ${idx + 1} (${b.label})`,
        value: b.digits,
        tone: 'purple' as const,
      })),
    },
    {
      step: 3,
      shortTitle: 'Kunci & Segel',
      headline: 'Tahap 3: Mengunci Gembok Publik & Memasang Segel Pengacak Unik',
      speakerText: `Lloyd menutup seluruh kotak kargo lalu menguncinya memakai gembok publik Anya (y = ${eg.y}) sehingga isi pesan tersembunyi menjadi nilai b. Agar pola pesan tidak bisa ditebak penyadap, Lloyd juga menempelkan segel pengacak sekali pakai (k) yang menghasilkan nilai segel a. Penyadap di jalur tengah hanya melihat kotak baja terkunci dengan pasangan angka acak: ${blockSummary}.`,
      analogyBadge: 'Terkunci & Tersegel Unik',
      highlights: eg.blocks.map((b, idx) => ({
        label: `Segel Kotak ${idx + 1} (k=${b.k})`,
        value: `(a=${b.a}, b=${b.b})`,
        tone: 'pink' as const,
      })),
    },
    {
      step: 4,
      shortTitle: 'Pembukaan Anya',
      headline: 'Tahap 4: Anak Kunci Emas Membuka Gembok & Memulihkan Pesan',
      speakerText: `Ketiga kotak kargo tiba dengan selamat di meja Anya. Anya memasukkan anak kunci emas pribadinya (x = ${eg.x}) ke setiap gembok, memutarnya untuk melepaskan segel pengacak, dan membuka kotak untuk mengambil kembali blok ${plainDigitsSummary} yang menyatu menjadi pesan asli "${eg.decryptedMessage}"!`,
      analogyBadge: 'Dekripsi Berhasil Sempurna',
      highlights: [
        { label: 'Kunci Pembuka', value: `x = ${eg.x}`, tone: 'amber' },
        { label: 'Blok Pulih', value: plainDigitsSummary, tone: 'purple' },
        { label: 'Pesan Terbuka', value: eg.decryptedMessage, tone: 'green' },
      ],
    },
  ];
}
