export function getDisplayPrices(originalPrice) {
  const strikePrice = Math.round(originalPrice * 1.16);
  const payablePrice = Math.round(originalPrice * 1.08);
  return { strikePrice, payablePrice };
}
