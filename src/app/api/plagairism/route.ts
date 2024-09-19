import { promises as fs } from "fs"; // To save the file temporarily
import { v4 as uuidv4 } from "uuid";
import path from "path";

import mammoth from "mammoth"; // For DOCX file handling
import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import OpenAI from "openai";

// To parse the PDF
const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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

      try {
        await fs.writeFile(tempFilePath, fileBuffer);
        console.log("File written successfully");
      } catch (error) {
        console.error("Error writing file:", error);
        // Handle the error appropriately, e.g., send an error response or retry
      }

      // await fs.writeFile(tempFilePath, fileBuffer);
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

      parsedText = await parsedPDF;
      await fs.unlink(tempFilePath);
      // // Parse the PDF file content using pdf-parse
      // const pdfData = await pdfParse(fileBuffer);
      // const extractedText = pdfData.text;
      console.log(parsedText);
    } else if (fileExtension === ".docx") {
      console.log("sry");
      const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });

      const extractedText = docxResult.value;

      parsedText = extractedText
        .replace(/\s+/g, " ") // Replace multiple spaces/newlines with a single space
        .replace(/^\s+|\s+$/g, "");

      console.log("extracted text:", extractedText);
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Unsupported file type" }),
        {
          status: 400,
        }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: 'you will be provided with a content.check it is it plagiarised or not.If it is plagiarised,Gave the percentage of plagiarized content with a title:"Plagiarised Percentage" and sections of the document that were flagged as plagiarized with a title "**Flagged Contents:**".Answer should be in the format of first give plagiarised percentage,then gave the section of plagiarised separated by numbers and points should be in one line.Just gave that nothing more.',
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: parsedText,
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "text",
      },
    });

    // const responseText = JSON.stringify(response.choices[0].message.content);
    const responseText = response.choices[0].message.content;
    // console.log("response text from openai", JSON.stringify(responseText));

    const result = responseText
      ? parsePlagiarismResponse(responseText)
      : { percentage: 0, flaggedSection: [] };
    console.log("Response:", result);
    return new NextResponse(JSON.stringify(result), {
      status: 200,
    });
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

function parsePlagiarismResponse(text: string) {
  // Assuming the response format is consistent, you might need to adjust parsing logic
  console.log("raw response Text:", text);

  const [percentageSection, flaggedSection] = text.split(
    "**Flagged Contents:**"
  );
  const percentage = parseFloat(percentageSection.replace(/[^0-9.]/g, ""));

  // console.log("precentage and flagged Contents:", percentage);
  console.log("percenteage:,", percentage);
  const cleanedFlaggedContent = flaggedSection
    // .replace(/^\s+|\s+$/g, "") // Trim leading and trailing whitespace
    // .replace(/----------------Page \(\d+\) Break----------------/g, "") // Remove page breaks
    // .split(/\d+\.\s+/); // Split by numbers and dots (e.g., 1. , 2. , etc.)
    .replace(/^\s+|\s+$/g, "") // Trim leading and trailing whitespace
    .replace(/```/g, "") // Remove code block delimiters
    .replace(/----------------Page \(\d+\) Break----------------/g, "") // Remove page breaks
    .replace(/\n+/g, " ") // Replace multiple newlines with a single space
    .split(/\d+\.\s+/) // Split by numbers and dots (e.g., 1. , 2. , etc.)
    .filter((section) => section.trim().length > 0) // Filter out empty sections
    .map((section) => section.trim()); // Trim each section
  console.log("flagged Contents:", cleanedFlaggedContent);
  console.log("helo");
  return {
    percentage,
    flaggedSection: cleanedFlaggedContent,
  };
  // return {
  //   percentage,
  //   flaggedSections: flaggedSection
  //     .map((section) => section.trim())
  //     .filter((section) => section.length > 0),
  // };
}
