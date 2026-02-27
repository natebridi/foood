export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/ +/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function replaceFractions(str: string): string {
  let fraction = "";
  const number = parseInt(str, 10);
  const remainder = parseFloat(str) % 1;

  switch (remainder) {
    case 0.5:
      fraction = "\u00bd";
      break;
    case 0.25:
      fraction = "\u00bc";
      break;
    case 0.75:
      fraction = "\u00be";
      break;
    case 0.33:
      fraction = "\u2153";
      break;
    case 0.67:
      fraction = "\u2154";
      break;
  }

  if (number) return number + " " + fraction;
  else return fraction;
}
