// lib/pdfmakeClient.js
export const getPdfMake = async () => {
  const pdfMake = (await import("pdfmake/build/pdfmake")).default;
  const pdfFonts = await import("pdfmake/build/vfs_fonts");

  // ✅ Correct access: vfs is directly available here
  pdfMake.vfs = pdfFonts.vfs;

  return pdfMake;
};
