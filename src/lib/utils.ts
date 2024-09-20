import { clsx, type ClassValue } from "clsx";
import mammoth from "mammoth";
import { twMerge } from "tailwind-merge";
// import { v4 as uuidv4 } from "uuid";
// import { promises as fs } from "fs";
// import fs from "fs/promises";
// import PDFParser from "pdf2json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePlagiarismResponse(text: string) {
  const [percentageSection, flaggedSection] = text.split(
    "**Flagged Contents:**"
  );
  const percentage = parseFloat(percentageSection.replace(/[^0-9.]/g, ""));

  const cleanedFlaggedContent = flaggedSection
    .replace(/^\s+|\s+$/g, "") // Trim leading and trailing whitespace
    .replace(/```/g, "") // Remove code block delimiters
    .replace(/----------------Page \(\d+\) Break----------------/g, "") // Remove page breaks
    .replace(/\n+/g, " ") // Replace multiple newlines with a single space
    .split(/\d+\.\s+/) // Split by numbers and dots (e.g., 1. , 2. , etc.)
    .filter((section) => section.trim().length > 0) // Filter out empty sections
    .map((section) => section.trim()); // Trim each section

  return {
    percentage,
    flaggedSection: cleanedFlaggedContent,
  };
}

export async function handleDOCX(fileBuffer: Buffer) {
  const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
  const extractedText = docxResult.value;

  return extractedText
    .replace(/\s+/g, " ") // Replace multiple spaces/newlines with a single space
    .replace(/^\s+|\s+$/g, ""); // Trim leading and trailing whitespace
}
