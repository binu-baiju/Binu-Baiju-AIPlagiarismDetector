export const maxDuration = 30;

import { NextRequest, NextResponse } from "next/server";

import OpenAI from "openai";
import path from "path";

import { handleDOCX, parsePlagiarismResponse } from "@/lib/utils";
import { handlePDF } from "../utils/handlepdf";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse form data from the request
    const formData = await req.formData();
    let parsedText = "";
    // Retrieve the uploaded file (assuming the input name in the form is "file")
    const uploadedFile = formData.get("file") as File;

    // Ensure the file is present
    if (!uploadedFile) {
      return new NextResponse(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }
    const fileExtension = path.extname(uploadedFile.name).toLowerCase();
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    if (fileExtension === ".pdf") {
      parsedText = await handlePDF(fileBuffer);
    } else if (fileExtension === ".docx") {
      parsedText = await handleDOCX(fileBuffer);
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Unsupported file type" }),
        {
          status: 400,
        }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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

    const responseText = response.choices[0].message.content;

    const result = responseText
      ? parsePlagiarismResponse(responseText)
      : { percentage: 0, flaggedSection: [] };

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
