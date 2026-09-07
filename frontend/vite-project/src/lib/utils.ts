export function formatMessageTime(
  date: string | number | Date
): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}