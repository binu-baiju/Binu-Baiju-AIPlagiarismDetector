"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowDownToLine, FileText, Upload, X } from "lucide-react";
import { useState, useRef } from "react";

export default function UserScreen() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    percentage: number;
    flaggedSections: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
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
    const formData = new FormData();
    formData.append("file", file);

    try {
      // const response = await fetch("http://localhost:5000/api/analze", {
      //   method: "POST",
      //   body: formData,
      // });

      const response = await fetch("http://localhost:3000/api/plagairism", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the document.");
      }

      const data = await response.json();
      console.log("Analysis result:", data);

      setResults({
        percentage: data.percentage,
        flaggedSections: data.flaggedSections,
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

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen ">
      <h1 className="text-3xl font-bold mb-8">AI Plagiarism Detector</h1>
      <div className="bg-gray-900 shadow-md rounded-lg p-6 mb-8 flex flex-col ">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        <div className="w-full  flex flex-col items-center">
          <div className="mb-4  flex flex-col">
            <div
              className=" border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-emerald-500"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
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
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>
          {file && (
            <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md mb-4">
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
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="w- bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Document"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {isAnalyzing && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-300 mb-2">
              Analyzing document...
            </p>
            <Progress
              value={33}
              className="w-full bg-gray-700"
              // indicatorClassName="bg-emerald-500"
            />
          </div>
        )}
      </div>
      {results && (
        <div className="bg-gray-900 shadow-md rounded-lg p-6 border border-gray-800 flex justify-center">
          <div className="  w-1/2 flex flex-col justify-center items-center ">
            <h2 className="text-2xl font-bold mb-4  ">Plagiarism Results</h2>
            <div className="mb-4">
              <p className="text-lg font-medium">
                Plagiarism Percentage:{" "}
                <span
                  className={`font-bold ${
                    results.percentage > 20
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {results.percentage}%
                </span>
              </p>
            </div>
            <div className="mb-6  flex flex-col justify-center">
              <h3 className="text-lg font-medium mb-2  ">Flagged Sections:</h3>
              <ul className="list-disc list-inside flex flex-col items-center">
                {results.flaggedSections.map((section, index) => (
                  <li key={index} className="text-gray-400  w-full">
                    {section}
                  </li>
                ))}
              </ul>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Download Full Report
              <ArrowDownToLine className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
