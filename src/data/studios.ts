// Demo studiyalar. Nomlar, manzillar va narxlar namunaviy.
// Backend ulanganda bu fayl o‘rniga API javobi ishlatiladi (src/api/studios.ts).
import { generatedImages, type GeneratedImage } from './images.generated';

export type StudioType = 'foto' | 'video' | 'podkast';

export interface Studio {
  id: string;
  name: string;
  type: StudioType;
  district: string;
  address: string;
  pricePerHour: number; // so‘m
  highlight: string; // kartada ko‘rinadigan asosiy xususiyat
  description: string;
  area: number; // m²
  capacity: number; // kishi
  equipment: string[];
  /** Ish vaqti, soatlarda (masalan 9 → 09:00). */
  openHour: number;
  closeHour: number;
  images: GeneratedImage[];
}

export const STUDIO_TYPE_LABELS: Record<StudioType, string> = {
  foto: 'Fotostudiya',
  video: 'Videostudiya',
  podkast: 'Podkast',
};

export const studios: Studio[] = [
  {
    id: 'yorug-loft',
    name: 'Yorug‘ Loft',
    type: 'foto',
    district: 'Mirzo Ulug‘bek',
    address: 'Buyuk Ipak Yo‘li ko‘chasi, 112-uy, 4-qavat',
    pricePerHour: 180_000,
    highlight: 'Tabiiy yorug‘lik',
    description:
      'Katta derazali oq g‘ishtli loft. Kun bo‘yi yumshoq tabiiy yorug‘lik tushadi — portret, oilaviy va brend suratlari uchun qulay.',
    area: 85,
    capacity: 8,
    equipment: ['2 ta softboks', 'Oq va bej fon rulonlari', 'Reflektor 110 sm', 'Kreslo va stullar', 'Grim stoli'],
    openHour: 9,
    closeHour: 21,
    images: generatedImages['yorug-loft'],
  },
  {
    id: 'siklorama',
    name: 'Oq Siklorama',
    type: 'foto',
    district: 'Yunusobod',
    address: 'Amir Temur shoh ko‘chasi, 108-uy',
    pricePerHour: 220_000,
    highlight: 'Oq siklorama 6 m',
    description:
      'Burchaksiz oq siklorama va rangli fonlar to‘plami. Katalog, moda va mahsulot suratlari uchun tayyor yoritish sxemalari bor.',
    area: 120,
    capacity: 12,
    equipment: ['Oktaboks 150 sm', 'Stripboks ×2', '7 xil rangli fon', 'Grim xonasi', 'Kiyim almashtirish joyi'],
    openHour: 8,
    closeHour: 22,
    images: generatedImages['siklorama'],
  },
  {
    id: 'kadr-sahna',
    name: 'Kadr Sahna',
    type: 'video',
    district: 'Chilonzor',
    address: 'Bunyodkor shoh ko‘chasi, 22-uy',
    pricePerHour: 350_000,
    highlight: 'Yashil fon (xromakey)',
    description:
      'Uch devorli xromakey sahna, ferma yoritgichlari va boshqaruv xonasi. Reklama roliklari, intervyu va onlayn kurslar uchun.',
    area: 150,
    capacity: 15,
    equipment: ['Xromakey 8×5 m', 'Fermadagi LED projektorlar', 'Telesuflyor', '3 monitorli boshqaruv stoli', 'Shtativlar'],
    openHour: 10,
    closeHour: 22,
    images: generatedImages['kadr-sahna'],
  },
  {
    id: 'neon-box',
    name: 'Neon Box',
    type: 'video',
    district: 'Yakkasaroy',
    address: 'Shota Rustaveli ko‘chasi, 41-uy',
    pricePerHour: 290_000,
    highlight: 'RGB LED yoritish',
    description:
      'Qorong‘i xona, boshqariladigan RGB chiroqlar va neon halqa. Klip, reels va kreativ portret videolari uchun.',
    area: 70,
    capacity: 6,
    equipment: ['RGB LED panel devori', 'Neon halqa 1,5 m', 'Tuman mashinasi', 'Gimbal', 'Softboks'],
    openHour: 12,
    closeHour: 23,
    images: generatedImages['neon-box'],
  },
  {
    id: 'sado-podkast',
    name: 'Sado Podkast',
    type: 'podkast',
    district: 'Mirobod',
    address: 'Nukus ko‘chasi, 7-uy',
    pricePerHour: 150_000,
    highlight: 'Ovoz izolyatsiyasi',
    description:
      'Akustik panellar bilan qoplangan tinch xona. Ikki kishilik suhbat, audiokitob va ovozli reklama yozish uchun.',
    area: 28,
    capacity: 3,
    equipment: ['2 ta dinamik mikrofon', 'Audio mikser', 'Studiya quloqchinlari', 'Akustik ko‘pik', 'Iliq chiroq'],
    openHour: 9,
    closeHour: 21,
    images: generatedImages['sado-podkast'],
  },
  {
    id: 'suhbat-xonasi',
    name: 'Suhbat Xonasi',
    type: 'podkast',
    district: 'Shayxontohur',
    address: 'Navoiy ko‘chasi, 30-uy',
    pricePerHour: 260_000,
    highlight: '4 kamerali yozuv',
    description:
      'Kitob javonli shinam lounj. To‘rt kamera va mikrofonlar o‘rnatilgan — video-podkast va intervyuni darhol yozishni boshlash mumkin.',
    area: 55,
    capacity: 5,
    equipment: ['4 ta kamera', '4 ta mikrofon', 'Video mikser', 'Kreslolar va divan', 'Monitorlar devori'],
    openHour: 10,
    closeHour: 20,
    images: generatedImages['suhbat-xonasi'],
  },
];

export const districts = Array.from(new Set(studios.map((s) => s.district))).sort((a, b) =>
  a.localeCompare(b, 'uz'),
);

export function getStudio(id: string): Studio | undefined {
  return studios.find((s) => s.id === id);
}
