/** Minutes as a cook reads them: "40 min", "3 hr", "1 hr 15 min". Shared by
    the recipe page's facts row and the atlas recipe cards. */
export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}
