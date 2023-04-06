export default function capitalizeString(string) {
  return string.replace(/\b\w/g, l => l.toUpperCase());
}