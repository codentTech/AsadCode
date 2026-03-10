import { useMemo } from "react";

const TOP_LOCATION_ITEMS = 6;

const toTopPlusOther = (items, nameKey = "name", valueKey = "value") => {
  if (!Array.isArray(items) || items.length <= TOP_LOCATION_ITEMS) return items;
  const top = items.slice(0, TOP_LOCATION_ITEMS);
  const rest = items.slice(TOP_LOCATION_ITEMS);
  const otherValue = rest.reduce((sum, i) => sum + (Number(i[valueKey]) || 0), 0);
  if (otherValue <= 0) return top;
  return [...top, { [nameKey]: "Other", [valueKey]: Math.round(otherValue) }];
};

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

export const useAudienceDemographics = (audienceData, colors = DEFAULT_COLORS, platform = null) => {
  const { ageData, genderData, locationData, cityData } = useMemo(() => {
    const empty = { ageData: [], genderData: [], locationData: [], cityData: [] };
    if (!audienceData?.has_data) return empty;

    const ageDist = audienceData.audience_age_distribution;
    const ageRangesOnly = audienceData.audience_age_ranges;
    let ageData = [];
    if (Array.isArray(ageDist) && ageDist.length > 0) {
      ageData = ageDist.map((d) => ({
        name: d.range,
        value: Math.round(Number(d.percentage) || 0),
      }));
    } else if (Array.isArray(ageRangesOnly) && ageRangesOnly.length > 0) {
      const pct = Math.round(100 / ageRangesOnly.length);
      ageData = ageRangesOnly.map((range, i, arr) => ({
        name: range,
        value: i === arr.length - 1 ? 100 - pct * (arr.length - 1) : pct,
      }));
    }

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

    const countryDist = audienceData.audience_country_distribution;
    const countriesOnly = audienceData.audience_countries;
    let locationData = [];
    if (Array.isArray(countryDist) && countryDist.length > 0) {
      const all = countryDist
        .filter((d) => Math.round(Number(d.percentage) || 0) > 0)
        .map((d) => ({
          name: COUNTRY_NAMES[d.country_code] || d.country_code,
          value: Math.round(Number(d.percentage) || 0),
        }));
      locationData = toTopPlusOther(all);
    } else if (Array.isArray(countriesOnly) && countriesOnly.length > 0) {
      const pct = Math.round(100 / countriesOnly.length);
      const all = countriesOnly.map((code, i, arr) => ({
        name: COUNTRY_NAMES[code] || code,
        value: i === arr.length - 1 ? Math.max(0, 100 - pct * (arr.length - 1)) : pct,
      }));
      locationData = toTopPlusOther(all);
    }

    // Top Follower Cities: only supported for Instagram (Phyllo does not provide for TikTok/YouTube)
    let cityData = [];
    if (platform?.toLowerCase() === "instagram" && audienceData.audience_city_distribution?.length > 0) {
      const allCities = audienceData.audience_city_distribution
        .filter((d) => Math.round(Number(d.percentage) || 0) > 0)
        .map((d) => ({
          name: d.city || d.name || d.code || "—",
          value: Math.round(Number(d.percentage) || 0),
        }));
      cityData = toTopPlusOther(allCities);
    }

    return { ageData, genderData, locationData, cityData };
  }, [audienceData, platform]);

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
  const cityColorItems = useMemo(
    () => generateCustomLocationColors({ colors, locationData: cityData || [] }),
    [colors, cityData]
  );

  return {
    colors,
    ageData,
    genderData,
    locationData,
    cityData: cityData || [],
    ageColorItems,
    genderColorItems,
    locationColorItems,
    cityColorItems,
  };
};
