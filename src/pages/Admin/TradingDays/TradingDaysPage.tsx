import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../components/shared/Card";
import {
  getDaysForMonth,
  publishDays,
  setCapacity,
  unpublishDay,
  type TradingDay,
} from "../../../services/tradingDaysService";

// --- helpers ---------------------------------------------------------------

function monthName(year: number, month1to12: number) {
  return new Date(year, month1to12 - 1, 1).toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function isoFor(y: number, m1to12: number, d: number) {
  const m = String(m1to12).padStart(2, "0");
  const day = String(d).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function saturdaysInMonth(year: number, month1to12: number): string[] {
  const month0 = month1to12 - 1;
  const lastDay = new Date(year, month1to12, 0).getDate();
  const out: string[] = [];
  for (let d = 1; d <= lastDay; d++) {
    const dt = new Date(year, month0, d);
    if (dt.getDay() === 6) out.push(isoFor(year, month1to12, d));
  }
  return out;
}

// --- component -------------------------------------------------------------

const TradingDaysPage: React.FC = () => {
  // current calendar view
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1..12

  // data
  const [published, setPublished] = useState<TradingDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // selection for new publishes
  const [selectedDraft, setSelectedDraft] = useState<Set<string>>(new Set());
  const [draftCapacity, setDraftCapacity] = useState<number>(90);

  // focus a published day to edit/unpublish
  const [focusIso, setFocusIso] = useState<string | null>(null);
  const focusedDay = useMemo(
    () => published.find((d) => d.id === focusIso) ?? null,
    [published, focusIso]
  );

  const monthSaturdays = useMemo(
    () => saturdaysInMonth(year, month),
    [year, month]
  );

  const publishedMap = useMemo(() => {
    const m = new Map<string, TradingDay>();
    for (const d of published) m.set(d.id, d);
    return m;
  }, [published]);

  async function refresh() {
    try {
      setLoading(true);
      setErr(null);
      const days = await getDaysForMonth(year, month);
      setPublished(days);
    } catch (e) {
      setErr("Failed to load trading days.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // clear UI selections when changing months
    setSelectedDraft(new Set());
    setFocusIso(null);
  }, [year, month]);

  function prevMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function toggleDraft(iso: string) {
    const copy = new Set(selectedDraft);
    if (copy.has(iso)) copy.delete(iso);
    else copy.add(iso);
    setSelectedDraft(copy);
    // if you click a not-published day, remove any focus on a published one
    setFocusIso(null);
  }

  async function handlePublish() {
    const toPublish = Array.from(selectedDraft);
    if (toPublish.length === 0) return;
    await publishDays(toPublish, draftCapacity);
    setSelectedDraft(new Set());
    await refresh();
  }

  async function handleSaveCapacity() {
    if (!focusIso || !focusedDay) return;
    if (focusedDay.maxBookings === draftCapacity) return;
    await setCapacity(focusIso, draftCapacity);
    await refresh();
  }

  async function handleUnpublish() {
    if (!focusIso) return;
    await unpublishDay(focusIso);
    setFocusIso(null);
    await refresh();
  }

  // keep the right-side capacity field in sync with the focused day
  useEffect(() => {
    if (focusedDay) setDraftCapacity(focusedDay.maxBookings);
  }, [focusedDay]);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6">
      <Card
        title={
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
            >
              ‹
            </button>
            <span>{monthName(year, month)}</span>
            <button
              onClick={nextMonth}
              className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
            >
              ›
            </button>
          </div>
        }
      >
        {loading ? (
          <p>Loading…</p>
        ) : err ? (
          <p className="text-red-600">{err}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {monthSaturdays.map((iso) => {
              const pub = publishedMap.get(iso);
              const isSelected = selectedDraft.has(iso);

              let classes =
                "p-3 rounded-lg border text-sm cursor-pointer select-none";
              if (pub) {
                classes +=
                  " border-green-300 bg-green-50 hover:bg-green-100 text-green-900";
              } else if (isSelected) {
                classes +=
                  " border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900";
              } else {
                classes +=
                  " border-slate-300 bg-white hover:bg-slate-50 text-slate-700";
              }

              return (
                <div
                  key={iso}
                  className={classes}
                  onClick={() => {
                    if (pub) {
                      setFocusIso(iso);
                      setSelectedDraft(new Set());
                    } else {
                      toggleDraft(iso);
                    }
                  }}
                >
                  <div className="font-semibold">{iso}</div>
                  {pub ? (
                    <div className="text-xs mt-1">
                      Capacity: {pub.currentBookings} / {pub.maxBookings}
                    </div>
                  ) : (
                    <div className="text-xs mt-1 text-slate-500">
                      Not published
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="space-y-6">
        <Card title="Publish new days">
          <div className="space-y-3">
            <div className="text-sm">
              Selected: <strong>{selectedDraft.size}</strong>
            </div>
            <label className="text-sm block">
              Stall capacity
              <input
                type="number"
                min={1}
                className="mt-1 w-full border rounded px-3 py-2"
                value={draftCapacity}
                onChange={(e) => setDraftCapacity(Math.max(1, +e.target.value))}
              />
            </label>
            <button
              disabled={selectedDraft.size === 0}
              onClick={handlePublish}
              className="px-3 py-2 rounded bg-sky-600 text-white disabled:opacity-50"
            >
              Publish selected
            </button>
          </div>
        </Card>

        <Card title="Manage published day">
          {focusedDay ? (
            <div className="space-y-3">
              <div className="text-sm">
                <div>Date: <strong>{focusedDay.date}</strong></div>
                <div>
                  Bookings:{" "}
                    <strong>
                      {focusedDay.currentBookings} / {focusedDay.maxBookings}
                    </strong>
                </div>
              </div>

              <label className="text-sm block">
                Capacity
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={draftCapacity}
                  onChange={(e) =>
                    setDraftCapacity(Math.max(1, +e.target.value))
                  }
                />
              </label>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveCapacity}
                  className="px-3 py-2 rounded bg-emerald-600 text-white"
                >
                  Save capacity
                </button>
                <button
                  onClick={handleUnpublish}
                  className="px-3 py-2 rounded bg-red-600 text-white"
                >
                  Unpublish
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Click a <span className="font-semibold">published</span> Saturday
              in the calendar to edit or unpublish it.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TradingDaysPage;