// LocalStorage-backed service for Managing Trading Days (publish/unpublish/capacity).
// Used by Admin > TradingDays page.

export interface TradingDay {
  id: string;              // same as date (YYYY-MM-DD)
  date: string;            // YYYY-MM-DD
  maxBookings: number;     // stall capacity
  currentBookings: number; // mock count
  isPublished: boolean;
}

const STORAGE_KEY = "hcm_trading_days_v1";

// --------------------------- helpers ----------------------------------------

function loadAll(): Record<string, TradingDay> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, TradingDay>) : {};
  } catch {
    return {};
  }
}

function saveAll(map: Record<string, TradingDay>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sameMonth(iso: string, year: number, month1to12: number): boolean {
  const [y, m] = iso.split("-");
  return Number(y) === year && Number(m) === month1to12;
}

function seedIfEmpty() {
  const all = loadAll();
  if (Object.keys(all).length > 0) return;

  // Seed next 6 Saturdays as published, capacity 90
  const today = new Date();
  let added = 0;
  let probe = new Date(today);
  while (added < 6) {
    probe.setDate(probe.getDate() + 1);
    if (probe.getDay() === 6) {
      const iso = toIso(probe);
      all[iso] = {
        id: iso,
        date: iso,
        maxBookings: 90,
        currentBookings: 0,
        isPublished: true,
      };
      added++;
    }
  }
  saveAll(all);
}

// ----------------------------- public API -----------------------------------

/** Return all published TradingDays for the given year & month (1..12). */
export async function getDaysForMonth(
  year: number,
  month1to12: number
): Promise<TradingDay[]> {
  seedIfEmpty();
  const all = loadAll();
  return Object.values(all)
    .filter((d) => d.isPublished && sameMonth(d.date, year, month1to12))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

/** Publish one or more ISO date strings (YYYY-MM-DD) with a capacity. */
export async function publishDays(dates: string[], capacity: number): Promise<void> {
  const all = loadAll();
  for (const iso of dates) {
    all[iso] = {
      id: iso,
      date: iso,
      maxBookings: capacity,
      currentBookings: all[iso]?.currentBookings ?? 0,
      isPublished: true,
    };
  }
  saveAll(all);
}

/** Change stall capacity for a published day (creates it if missing). */
export async function setCapacity(dateIso: string, capacity: number): Promise<void> {
  const all = loadAll();
  const existing = all[dateIso];
  if (!existing) {
    all[dateIso] = {
      id: dateIso,
      date: dateIso,
      maxBookings: capacity,
      currentBookings: 0,
      isPublished: true,
    };
  } else {
    all[dateIso] = { ...existing, maxBookings: capacity };
  }
  saveAll(all);
}

/** Unpublish (remove) a day from the calendar. */
export async function unpublishDay(dateIso: string): Promise<void> {
  const all = loadAll();
  if (all[dateIso]) {
    delete all[dateIso];
    saveAll(all);
  }
}