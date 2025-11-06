import QRCode from "qrcode";

export const generateQr = (text) => {
  return QRCode.toDataURL(text);
};
