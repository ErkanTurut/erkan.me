import fs from "fs";
import path from "path";
import { format as formatTz, toZonedTime } from "date-fns-tz";
import {
  format as formatDateFns,
  isValid,
  parseISO,
  type Locale,
} from "date-fns";
import { enUS, fr, nl } from "date-fns/locale";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  author?: string;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "app", "blog", "posts"));
}

export function formatDate(
  date: string,
  includeRelative = false,
  options?: { timeZone?: string; now?: Date; locale?: string | Locale }
) {
  // Parse input (supports ISO like YYYY-MM-DD or full ISO). If no time, treat as midnight UTC to avoid TZ shifts.
  const normalized = date.includes("T") ? date : `${date}T00:00:00Z`;
  const parsed = parseISO(normalized);

  const now = options?.now ?? new Date();
  const timeZone = options?.timeZone; // e.g., 'Europe/Paris' or 'UTC'; if omitted, use environment tz
  const locale = resolveLocale(options?.locale);

  const valid = isValid(parsed) ? parsed : new Date(normalized);
  const base = isValid(valid) ? valid : new Date(date);

  // Convert to target timezone for display without changing the actual instant in time
  const zoned = timeZone ? toZonedTime(base, timeZone) : base;

  // Full date like 'August 22, 2025'
  // Use localized skeleton (PPP) so month/day order matches the given locale
  // e.g., fr => "22 août 2025", en => "August 22, 2025", nl => "22 augustus 2025"
  const pattern = "PPP";
  const fullDate = timeZone
    ? formatTz(zoned, pattern, { timeZone, locale })
    : formatDateFns(zoned, pattern, { locale });

  if (!includeRelative) return fullDate;

  // Relative label: Today, Nd ago, Nmo ago, Ny ago (rough but timezone-aware)
  const compareZonedNow = timeZone ? toZonedTime(now, timeZone) : now;

  let yearsAgo = compareZonedNow.getFullYear() - zoned.getFullYear();
  let monthsAgo = compareZonedNow.getMonth() - zoned.getMonth() + yearsAgo * 12;
  let daysAgo = Math.floor(
    (compareZonedNow.setHours(0, 0, 0, 0), zoned.setHours(0, 0, 0, 0))
  );

  // Compute day difference accurately (midnight to midnight in tz)
  const msPerDay = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(compareZonedNow);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTarget = new Date(zoned);
  startOfTarget.setHours(0, 0, 0, 0);
  daysAgo = Math.floor(
    (startOfToday.getTime() - startOfTarget.getTime()) / msPerDay
  );

  let rel = "";
  if (yearsAgo >= 1) {
    rel = `${yearsAgo}y ago`;
  } else if (monthsAgo >= 1) {
    rel = `${monthsAgo}mo ago`;
  } else if (daysAgo >= 1) {
    rel = `${daysAgo}d ago`;
  } else {
    rel = "Today";
  }

  return `${fullDate} (${rel})`;
}

function resolveLocale(loc?: string | Locale): Locale | undefined {
  if (!loc) return undefined;
  if (typeof loc !== "string") return loc;
  const code = loc.toLowerCase();
  if (code === "en" || code === "en-us" || code === "en_us") return enUS;
  if (code === "fr" || code === "fr-fr" || code === "fr_fr") return fr;
  if (code === "nl" || code === "nl-nl" || code === "nl_nl") return nl;
  return undefined;
}
