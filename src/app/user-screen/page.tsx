"use client";

import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  CheckCircle,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { useFetch } from "@/hooks/useFetch";
import CircularChart from "@/components/ui/circular-chart";

import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";

export default function UserScreen() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    percentage: number;
    flaggedSections: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = useFetch();

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileType !== "pdf" && fileType !== "docx") {
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: "Please select a PDF or DOCX file.",
          duration: 5000,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFile(null);
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File size exceeds limit",
          description: "Please select a file smaller than 5MB.",
          duration: 5000,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    setIsAnalyzing(true);
    setResults(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for sending form data
        },
        timeout: 100000,
      });

      const data = response.data; // Axios automatically parses the response as JSON
      console.log("Analysis result:", data);

      setResults({
        percentage: data.percentage,
        flaggedSections: data.flaggedSection,
      });
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadReport = () => {
    // Create report content
    const reportContent = results
      ? `
      Report Summary:
      -----------------------
      Percentage: ${results.percentage}%

      Flagged Sections:
      -----------------------
      ${results.flaggedSections
        .map((section, index) => `Section ${index + 1}: ${section}`)
        .join("\n")}
    `
      : "No results available.";

    // Create a Blob from the text content
    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8",
    });

    // Download the report (use saveAs from 'file-saver' library for better browser support)
    saveAs(blob, "PlaigarismreportReport.txt");
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen ">
      <h1 className="text-xl md:text-3xl font-bold mb-8">
        AI Plagiarism Detector
      </h1>
      <div className="bg-gray-900 shadow-md rounded-lg p-6 mb-0 flex flex-col ">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        <div className="w-full  flex flex-col items-center ">
          <div className=" md:w-1/2 flex flex-col items-center">
            <div className="w-full mb-4  flex flex-col ">
              <div
                className=" border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-emerald-500"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-300">
                  {file
                    ? file.name
                    : "Drag and drop your file here, or click to select a file"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOCX
                </p>
              </div>
            </div>
            {file && (
              <div className="flex  items-center justify-between bg-gray-800 p-3 rounded-md mb-4 w-full">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-emerald-400 mr-2" />
                  <span className="text-sm text-gray-300 truncate max-w-xs">
                    {file.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:bg-emerald-600 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                <>
                  Check for Plagiarism
                  <Upload className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      {results && (
        <div className="bg-gray-900 shadow-md rounded-lg p-6 border border-gray-800 flex justify-center">
          <div className="  w-full flex flex-col justify-center items-center ">
            <h2 className="text-lg md:text-2xl  font-bold   ">
              Plagiarism Results
            </h2>

            <div className="flex flex-col flex-wrap justify-center items-center mt-2 w-full max-w-3xl">
              <div className="w-3/6 sm:w-2/4 md:w-2/6 lg:w-1/3 p-6  ">
                <CircularChart percentage={results.percentage} />
              </div>
            </div>
            {results.percentage === 0 ? (
              <div className="w-full mb-8 text-center  p-6 rounded-lg shadow-md">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-medium mb-2 text-white">
                  No Plagiarism Detected
                </h3>
                <p className="text-gray-300">
                  Congratulations! Your document appears to be original content.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 ml-2  flex flex-col justify-center ">
                  <h3 className="text-lg font-medium mb-4  ">
                    Flagged Sections:
                  </h3>
                  <ul className="space-y-2 list-none pl-0">
                    {results.flaggedSections.map((section, index) => (
                      <li
                        key={index}
                        className="bg-gray-800 rounded-lg p-4 text-gray-300 text-sm"
                      >
                        <span className="font-semibold text-emerald-400">
                          Section {index + 1}:
                        </span>{" "}
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleDownloadReport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Download Full Report
                  <ArrowDownToLine className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
