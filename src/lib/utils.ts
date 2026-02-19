export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function replaceFractions(str: string): string {
  let fraction = "";
  const number = parseInt(str, 10);
  const remainder = parseFloat(str) % 1;

  switch (remainder) {
    case 0.5:
      fraction = "&frac12;";
      break;
    case 0.25:
      fraction = "&frac14;";
      break;
    case 0.75:
      fraction = "&frac34;";
      break;
    case 0.33:
      fraction = "&frac13;";
      break;
  }

  if (number) return number + " " + fraction;
  else return fraction;
}
