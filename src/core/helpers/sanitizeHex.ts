const padLeftEven = (hex: string): string => {
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return hex;
};

const sanitizeHex = (hex: string): string => {
  hex = hex ? (hex.substring(0, 2) == "0x" ? hex.substring(2) : hex) : "";
  if (hex == "") return "";
  return "0x" + padLeftEven(hex);
};

export default sanitizeHex;
