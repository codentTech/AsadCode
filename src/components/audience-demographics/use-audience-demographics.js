import { useState } from "react";

function useAudienceDemographics() {
  const [colors] = useState({
    // Primary colors
    primary: "#6366f1", // Indigo
    secondary: "#a855f7", // Purple
    tertiary: "#ec4899", // Pink
    quaternary: "#06b6d4", // Cyan

    // Shades for variety with proper contrast
    gender: ["#6366f1", "#ec4899", "#06b6d4"],
    age: ["#6366f1", "#818cf8", "#a855f7", "#d946ef", "#ec4899"],
    location: ["#6366f1", "#a855f7", "#ec4899", "#06b6d4"],
  });

  // Demographics data for charts
  const genderData = [
    { name: "Female", value: 63 },
    { name: "Male", value: 27 },
    { name: "Other", value: 10 },
  ];

  const ageData = [
    { name: "0-18", value: 15 },
    { name: "18-25", value: 30 },
    { name: "25-32", value: 40 },
    { name: "32-40", value: 10 },
    { name: "40+", value: 5 },
  ];

  const locationData = [
    { name: "US", value: 35 },
    { name: "Dubai", value: 28 },
    { name: "UK", value: 22 },
    { name: "Other", value: 15 },
  ];

  return {
    colors,
    genderData,
    ageData,
    locationData,
  };
}

export default useAudienceDemographics;
