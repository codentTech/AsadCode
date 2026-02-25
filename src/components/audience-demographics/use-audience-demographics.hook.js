import { useMemo } from "react";

export const COUNTRY_NAMES = {
  US: "USA",
  GB: "UK",
  CA: "Canada",
  AU: "Australia",
  IN: "India",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  BR: "Brazil",
  MX: "Mexico",
  JP: "Japan",
  KR: "S. Korea",
  CN: "China",
  CH: "Switzerland",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  BE: "Belgium",
  AT: "Austria",
  IE: "Ireland",
  NZ: "New Zealand",
  SG: "Singapore",
  HK: "Hong Kong",
  AE: "UAE",
  SA: "Saudi Arabia",
  ZA: "S. Africa",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  LK: "Sri Lanka",
  TR: "Turkey",
  RO: "Romania",
  PK: "Pakistan",
  NG: "Nigeria",
  PH: "Philippines",
  TH: "Thailand",
  MY: "Malaysia",
  KW: "Kuwait",
  GR: "Greece",
  IR: "Iran",
  IL: "Israel",
  EG: "Egypt",
  GH: "Ghana",
  ID: "Indonesia",
  KE: "Kenya",
  JM: "Jamaica",
  TT: "Trinidad & Tobago",
  PT: "Portugal",
};

export const DEFAULT_COLORS = {
  age: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
  gender: ["#3b82f6", "#ec4899"],
  location: ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
};

export const generateCustomAgeColors = ({ colors, ageData }) =>
  ageData.map((item, index) => ({
    value: item.name,
    percentage: item.value,
    color: colors.age[index % colors.age.length],
    id: `age-${index}`,
  }));

export const generateCustomLocationColors = ({ colors, locationData }) =>
  locationData.map((item, index) => ({
    value: item.name,
    percentage: item.value,
    color: colors.location[index % colors.location.length],
    id: `location-${index}`,
  }));

export const generateCustomGenderColors = ({ colors, genderData }) =>
  genderData.map((item, index) => ({
    value: item.name,
    percentage: item.value,
    color: colors.gender[index % colors.gender.length],
    id: `gender-${index}`,
  }));

export const useAudienceDemographics = (audienceData, colors = DEFAULT_COLORS) => {
  const { ageData, genderData, locationData } = useMemo(() => {
    const empty = { ageData: [], genderData: [], locationData: [] };
    if (!audienceData?.has_data) return empty;

    // Age
    const ageDist = audienceData.audience_age_distribution;
    const ageData =
      Array.isArray(ageDist) && ageDist.length > 0
        ? ageDist.map((d) => ({
            name: d.range,
            value: Math.round(Number(d.percentage) || 0),
          }))
        : [];

    // Gender
    const genderDist = audienceData.audience_gender_distribution;
    const nameMap = { male: "Male", female: "Female" };
    const genderOrder = ["Male", "Female"];

    let genderData = [];
    if (Array.isArray(genderDist) && genderDist.length > 0) {
      genderData = genderDist
        .filter((d) => d.gender === "male" || d.gender === "female")
        .map((d) => ({
          name: nameMap[d.gender] || d.gender,
          value: Math.round(Number(d.percentage) || 0),
        }))
        .filter((d) => d.value > 0)
        .sort((a, b) => genderOrder.indexOf(a.name) - genderOrder.indexOf(b.name));

      if (genderData.length >= 2) {
        const sum = genderData.reduce((a, i) => a + i.value, 0);
        if (sum !== 100) genderData[genderData.length - 1].value += 100 - sum;
      }
    }

    // Location
    const countryDist = audienceData.audience_country_distribution;
    const locationData =
      Array.isArray(countryDist) && countryDist.length > 0
        ? countryDist
            .filter((d) => Math.round(Number(d.percentage) || 0) > 0)
            .slice(0, 12)
            .map((d) => ({
              name: COUNTRY_NAMES[d.country_code] || d.country_code,
              value: Math.round(Number(d.percentage) || 0),
            }))
        : [];

    return { ageData, genderData, locationData };
  }, [audienceData]);

  const ageColorItems = useMemo(
    () => generateCustomAgeColors({ colors, ageData }),
    [colors, ageData]
  );
  const genderColorItems = useMemo(
    () => generateCustomGenderColors({ colors, genderData }),
    [colors, genderData]
  );
  const locationColorItems = useMemo(
    () => generateCustomLocationColors({ colors, locationData }),
    [colors, locationData]
  );

  return {
    colors,
    ageData,
    genderData,
    locationData,
    ageColorItems,
    genderColorItems,
    locationColorItems,
  };
};
