// src/utils/convertToPdf.js
import { PDFDocument } from "pdf-lib";

/**
 * Convert an image file (jpg/png) to a PDF File
 * @param {File} file - Image File
 * @returns {Promise<File>} - PDF File
 */
export async function convertImageToPdf(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  const pdfDoc = await PDFDocument.create();
  const imageBytes = await file.arrayBuffer();

  let image;
  if (file.type === "image/jpeg") {
    image = await pdfDoc.embedJpg(imageBytes);
  } else {
    image = await pdfDoc.embedPng(imageBytes);
  }

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], `${file.name.split(".")[0]}.pdf`, {
    type: "application/pdf",
  });
}
