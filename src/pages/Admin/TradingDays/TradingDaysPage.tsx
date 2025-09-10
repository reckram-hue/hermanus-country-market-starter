import React, { useEffect, useMemo, useState } from "react";
import {
  getDaysForMonth,
  publishDays,
  setCapacity,
  unpublishDay,
  type TradingDay,
} from "../../../services/tradingDaysService";

/** Utility: month name like "September 2025" */
function monthLabel(year: number, month1to12: number) {
  const d = new Date(year, month1to12 - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

/** Compute all Saturdays in given month, returned as ISO (YYYY-MM-DD). */
function saturdaysOfMonth(year: number, month1to12: number): string[] {
  const result: string[] = [];
  const first = new Date(year, month1to12 - 1, 1);
  const last = new Date(year, month1to12, 0); // last day
  const d = new Date(first);
  while (d <= last) {
    if (d.getDay() === 6) {
      const iso = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
      result.push(iso);
    }
    d.setDate(d.getDate() + 1);
  }
  return result;
}

type RowVM = {
  iso: string;
  published: boolean;
  capacity: number;
  currentBookings: number;
};

export default function TradingDaysPage() {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1); // 1..12
  const [rows, setRows] = useState<RowVM[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingIso, setSavingIso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const monthKey = `${year}-${month}`;

  const saturdayIsos = useMemo(() => saturdaysOfMonth(year, month), [year, month]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const published = await getDaysForMonth(year, month);
      const byIso = new Map<string, TradingDay>();
      for (const d of published) byIso.set(d.date, d);

      const vm: RowVM[] = saturdayIsos.map((iso) => {
        const found = byIso.get(iso);
        return {
          iso,
          published: !!found,
          capacity: found?.maxBookings ?? 90,
          currentBookings: found?.currentBookings ?? 0,
        };
      });

      setRows(vm);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load trading days.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  function prevMonth() {
    const d = new Date(year, month - 2, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  }
  function nextMonth() {
    const d = new Date(year, month, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  }

  async function handlePublish(iso: string, capacity: number) {
    setSavingIso(iso);
    setError(null);
    try {
      await publishDays([iso], capacity);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Publish failed.");
    } finally {
      setSavingIso(null);
    }
  }

  async function handleUnpublish(iso: string) {
    setSavingIso(iso);
    setError(null);
    try {
      await unpublishDay(iso);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Unpublish failed.");
    } finally {
      setSavingIso(null);
    }
  }

  async function handleSaveCapacity(iso: string, capacity: number) {
    setSavingIso(iso);
    setError(null);
    try {
      await setCapacity(iso, capacity);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Save capacity failed.");
    } finally {
      setSavingIso(null);
    }
  }

  function updateCapacity(iso: string, val: number) {
    setRows((old) =>
      old.map((r) => (r.iso === iso ? { ...r, capacity: val } : r))
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Trading Days</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300"
            disabled={loading}
          >
            ◀ Prev
          </button>
          <div className="font-medium">{monthLabel(year, month)}</div>
          <button
            onClick={nextMonth}
            className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300"
            disabled={loading}
          >
            Next ▶
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Date (Saturday)</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Capacity</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const disabled = savingIso === r.iso || loading;
              return (
                <tr key={r.iso} className="border-t">
                  <td className="p-3">{r.iso}</td>
                  <td className="p-3">
                    {r.published ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-green-700 bg-green-50">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-slate-700 bg-slate-50">
                        Unpublished
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={1}
                      className="w-24 rounded border px-2 py-1"
                      value={r.capacity}
                      onChange={(e) => updateCapacity(r.iso, Number(e.target.value))}
                      disabled={disabled}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {r.published ? (
                        <>
                          <button
                            onClick={() => handleSaveCapacity(r.iso, r.capacity)}
                            disabled={disabled}
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            Save capacity
                          </button>
                          <button
                            onClick={() => handleUnpublish(r.iso)}
                            disabled={disabled}
                            className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                          >
                            Unpublish
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handlePublish(r.iso, r.capacity)}
                          disabled={disabled}
                          className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  No Saturdays this month (unexpected)—try another month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(loading || savingIso) && (
        <div className="mt-3 text-sm text-slate-500">Working…</div>
      )}
    </div>
  );
}