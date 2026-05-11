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

export const isOverdue = (dateStr?: string, timeStr?: string) => {
  if (!dateStr) return false;

  const now = new Date();
  
  // Se abbiamo sia data che ora
  if (timeStr) {
    const combinedDate = new Date(`${dateStr}T${timeStr}`);
    return combinedDate < now;
  }

  // Altrimenti solo data (scade a fine giornata)
  const d = new Date(dateStr);
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