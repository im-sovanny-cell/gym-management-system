export default (n) => new Intl.NumberFormat(undefined, { style:'currency', currency:'USD' }).format(n ?? 0)
