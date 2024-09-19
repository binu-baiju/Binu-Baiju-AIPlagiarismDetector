import { useEffect, useState } from "react";

// Custom hook to get API URL based on environment
export function useFetch() {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    // Check if the app is running in development or production
    const isDevelopment = process.env.NODE_ENV === "development";

    setApiUrl(
      "https://binu-baiju-ai-plagiarism-detector.vercel.app/api/plagairism"
    );

    // if (isDevelopment) {
    //   // Use localhost API for development
    //   setApiUrl("http://localhost:3000/api/plagairism");
    // } else {
    //   // Use the deployed API for production
    //   setApiUrl(
    //     "https://binu-baiju-ai-plagiarism-detector.vercel.app/api/plagairism"
    //   );
    // }
  }, []);

  return apiUrl;
}
