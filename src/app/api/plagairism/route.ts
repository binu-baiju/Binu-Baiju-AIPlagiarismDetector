import { promises as fs } from "fs"; // To save the file temporarily
import { v4 as uuidv4 } from "uuid";
import path from "path";

import mammoth from "mammoth"; // For DOCX file handling
import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export const config = {
  api: {
    bodyParser: false,
  },
};

// To parse the PDF

export async function POST(req: NextRequest) {
  try {
    // Parse form data from the request
    const formData = await req.formData();
    let parsedText = "";
    // Retrieve the uploaded file (assuming the input name in the form is "file")
    const uploadedFile = formData.get("file") as File;
    console.log(uploadedFile);

    // Ensure the file is present
    if (!uploadedFile) {
      return new NextResponse(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }
    const fileExtension = path.extname(uploadedFile.name).toLowerCase();
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    if (fileExtension === ".pdf") {
      // // Generate a unique filename and save the file temporarily
      const fileName = `${uuidv4()}.pdf`;
      const tempFilePath = `/tmp/${fileName}`;

      console.log(fileName);
      console.log(tempFilePath);

      console.log("filetype", fileExtension);

      // // Convert the uploaded file into a Buffer

      // // Save the buffer as a temporary PDF file
      await fs.writeFile(tempFilePath, fileBuffer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParser = new (PDFParser as any)(null, 1);

      const parsedPDF = new Promise<string>((resolve, reject) => {
        pdfParser.on(
          "pdfParser_dataError",
          (errData: { parserError: Error }) => {
            reject(errData.parserError);
          }
        );

        pdfParser.on("pdfParser_dataReady", () => {
          parsedText = pdfParser.getRawTextContent();
          resolve(parsedText);
        });

        // Load the temporary PDF file
        pdfParser.loadPDF(tempFilePath);
      });

      const extractedText = await parsedPDF;
      await fs.unlink(tempFilePath);
      // // Parse the PDF file content using pdf-parse
      // const pdfData = await pdfParse(fileBuffer);
      // const extractedText = pdfData.text;
      console.log(extractedText);

      // Return the extracted text in the response
      return new NextResponse(JSON.stringify({ extractedText }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (fileExtension === ".docx") {
      console.log("sry");
      const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });

      let extractedText = docxResult.value;

      extractedText = extractedText
        .replace(/\s+/g, " ") // Replace multiple spaces/newlines with a single space
        .replace(/^\s+|\s+$/g, "");

      console.log("extracted text:", extractedText);
      return new NextResponse(JSON.stringify({ extractedText }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Unsupported file type" }),
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error processing file" }),
      {
        status: 500,
      }
    );
  }
}
