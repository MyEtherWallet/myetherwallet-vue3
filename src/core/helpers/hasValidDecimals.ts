const hasValidDecimals = function (
  amountStr: string,
  numDecimals: number
): boolean {
  const decimals = amountStr.split(".")[1];
  if (!decimals) return true;
  return decimals.length <= numDecimals;
};

export default hasValidDecimals;
