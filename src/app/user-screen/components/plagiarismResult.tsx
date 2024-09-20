// components/PlagiarismResults.tsx

import React from "react";

import { Button } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle } from "lucide-react";
import CircularChart from "@/components/ui/circular-chart";

interface PlagiarismResultsProps {
  results: {
    percentage: number;
    flaggedSections: string[];
  };
  handleDownloadReport: () => void;
}

const PlagiarismResults: React.FC<PlagiarismResultsProps> = ({
  results,
  handleDownloadReport,
}) => {
  return (
    <div className="bg-gray-900 shadow-md rounded-lg p-6 border border-gray-800 flex justify-center">
      <div className="  w-full flex flex-col justify-center items-center ">
        <h2 className="text-lg md:text-2xl  font-bold   ">
          Plagiarism Results
        </h2>

        <div className="flex flex-col flex-wrap justify-center items-center mt-2 w-full max-w-3xl">
          <div className="w-3/6 sm:w-2/4 md:w-2/6 lg:w-1/3 p-6 flex flex-col items-center justify-center gap-2">
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
              <h3 className="text-lg font-medium mb-4  ">Flagged Sections:</h3>
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
  );
};

export default PlagiarismResults;
