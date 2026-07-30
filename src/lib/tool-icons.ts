/**
 * Icon registry.
 *
 * Tools and categories reference icons by name so that `tools.ts` and
 * `categories.ts` stay pure data. Only modules that actually render a tool
 * grid import this map; the header imports its seven category icons directly
 * so the shared chrome never pulls the whole set into every route.
 */
import {
  AlignLeft,
  ArrowLeftRight,
  Binary,
  Braces,
  CalendarDays,
  Calculator,
  CaseSensitive,
  CircleDollarSign,
  Clock,
  Code2,
  Database,
  Download,
  Eye,
  Facebook,
  FileCode,
  FileImage,
  FileText,
  Globe,
  Image,
  Instagram,
  Key,
  Layers,
  Laptop,
  Link2,
  Lock,
  Palette,
  Percent,
  QrCode,
  Regex,
  Replace,
  RotateCw,
  Ruler,
  Scissors,
  Shield,
  ShieldCheck,
  Shrink,
  Table,
  TextQuote,
  TrendingUp,
  Type,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICONS = {
  "align-left": AlignLeft,
  "arrow-left-right": ArrowLeftRight,
  binary: Binary,
  braces: Braces,
  calculator: Calculator,
  "calendar-days": CalendarDays,
  "case-sensitive": CaseSensitive,
  clock: Clock,
  code: Code2,
  coins: CircleDollarSign,
  database: Database,
  download: Download,
  eye: Eye,
  facebook: Facebook,
  "file-code": FileCode,
  "file-image": FileImage,
  "file-text": FileText,
  globe: Globe,
  image: Image,
  instagram: Instagram,
  key: Key,
  laptop: Laptop,
  layers: Layers,
  link: Link2,
  lock: Lock,
  palette: Palette,
  percent: Percent,
  "qr-code": QrCode,
  regex: Regex,
  replace: Replace,
  rotate: RotateCw,
  ruler: Ruler,
  scissors: Scissors,
  shield: Shield,
  "shield-check": ShieldCheck,
  shrink: Shrink,
  table: Table,
  "text-quote": TextQuote,
  "trending-up": TrendingUp,
  type: Type,
  youtube: Youtube,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function getIcon(name: IconName): LucideIcon {
  return ICONS[name];
}
