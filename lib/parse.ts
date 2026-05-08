export function parseInput(input: string) {
  const text = input.toLowerCase();

  let dueDate: string | null = null;
  let cleanText = input;

  const today = new Date();

  // 👉 OGGI
  if (text.includes("oggi")) {
    dueDate = formatDate(today);
    cleanText = input.replace(/oggi/i, "").trim();
  }

  // 👉 DOMANI
  if (text.includes("domani")) {
    const d = new Date();
    d.setDate(today.getDate() + 1);
    dueDate = formatDate(d);
    cleanText = input.replace(/domani/i, "").trim();
  }

  // 👉 GIORNI SETTIMANA
  const days: Record<string, number> = {
    lunedì: 1,
    martedì: 2,
    mercoledì: 3,
    giovedì: 4,
    venerdì: 5,
    sabato: 6,
    domenica: 0,
  };

  for (const day in days) {
    if (text.includes(day)) {
      const target = days[day];
      const current = today.getDay();

      let diff = target - current;
      if (diff <= 0) diff += 7;

      const d = new Date();
      d.setDate(today.getDate() + diff);

      dueDate = formatDate(d);
      cleanText = input.replace(new RegExp(day, "i"), "").trim();
    }
  }

  // 👉 ORARIO (es: 15:30)
  const timeMatch = input.match(/(\d{1,2}:\d{2})/);
  if (timeMatch && dueDate) {
    dueDate += " " + timeMatch[0];
    cleanText = cleanText.replace(timeMatch[0], "").trim();
  }

  return {
    text: cleanText,
    dueDate,
  };
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}