export function formatCreatorLocation({ city, country, state, stateShort } = {}) {
  const cityPart = city ? String(city).trim() : "";
  const countryPart = country ? String(country).trim() : "";
  const statePart = state ? String(state).trim() : "";
  const shortPart = stateShort ? String(stateShort).trim() : "";
  const regionPart = shortPart || statePart;

  if (cityPart && regionPart && countryPart) {
    return `${cityPart}, ${regionPart}, ${countryPart}`;
  }
  if (cityPart && countryPart) {
    return `${cityPart}, ${countryPart}`;
  }
  if (cityPart && regionPart) {
    return `${cityPart}, ${regionPart}`;
  }
  if (regionPart && countryPart) {
    return `${regionPart}, ${countryPart}`;
  }
  return cityPart || regionPart || countryPart || "";
}
