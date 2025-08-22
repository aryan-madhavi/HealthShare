import { PDFDocument } from "pdf-lib";

/**
 * Compress a PDF file by re-saving it.
 * @param {File} pdfFile 
 * @returns {Promise<File>}
 */
export async function compressPdf(pdfFile) {
    // Read the PDF as ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Create a new PDF and copy pages
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => newPdf.addPage(page));

    // Save PDF bytes
    const compressedPdfBytes = await newPdf.save({ useObjectStreams: false });

    // Return new File object
    return new File([compressedPdfBytes], pdfFile.name, {
        type: "application/pdf",
    });
}
