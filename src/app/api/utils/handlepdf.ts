import PDFParser from "pdf2json";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";

export async function handlePDF(fileBuffer: Buffer): Promise<string> {
  const fileName = `${uuidv4()}.pdf`;
  const tempFilePath = `/tmp/${fileName}`;

  try {
    await fs.writeFile(tempFilePath, fileBuffer);
    console.log("File written successfully");
  } catch (error) {
    console.error("Error writing file:", error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfParser = new (PDFParser as any)(null, 1);

  const parsedPDF = new Promise<string>((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const parsedText = pdfParser.getRawTextContent();
      resolve(parsedText);
    });

    // Load the temporary PDF file
    pdfParser.loadPDF(tempFilePath);
  });

  const parsedText = await parsedPDF;
  await fs.unlink(tempFilePath);
  return parsedText;
}
