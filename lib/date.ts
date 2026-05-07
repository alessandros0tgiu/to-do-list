export const isToday = (dateStr?: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();

  return d.toDateString() === today.toDateString();
};

export const isThisWeek = (dateStr?: string) => {
  if (!dateStr) return false;

  const d = new Date(dateStr);
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return d >= start && d <= end;
};

export const isOverdue = (dateStr?: string) => {
  if (!dateStr) return false;

  const d = new Date(dateStr);
  const now = new Date();

  // scaduto se prima di oggi
  return d < new Date(now.toDateString());
};

export const isDueSoon = (dateStr?: string) => {
  if (!dateStr) return false;

  const d = new Date(dateStr);
  const now = new Date();

  const diff = d.getTime() - now.getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  return diff > 0 && diff <= oneDay;
};