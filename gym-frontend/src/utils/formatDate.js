export default function formatDate(s) {
  if (!s) return ''
  try { return new Date(s).toISOString().slice(0,10) } catch { return s }
}
