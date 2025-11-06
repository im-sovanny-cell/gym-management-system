export default function calculateDuration(start, end) {
  if (!start || !end) return 0
  const a = new Date(`1970-01-01T${start}Z`)
  const b = new Date(`1970-01-01T${end}Z`)
  return Math.max(0, (b - a) / 3600000)
}
