export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = date.getUTCFullYear();
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();

  return `${month} ${day}, ${year}`;
}
