const UI_ARRAY_KEYS = ["countries", "niches", "platforms", "languages"];

export function ensureAppliedCreatorsUiFilters(filters = {}) {
  const ui = { ...filters };

  if (ui.state_short != null && ui.stateShort === undefined) {
    ui.stateShort = ui.state_short;
  }
  delete ui.state_short;

  UI_ARRAY_KEYS.forEach((key) => {
    if (!Array.isArray(ui[key])) {
      ui[key] = [];
    }
  });

  return ui;
}

export function normalizeAppliedCreatorsFilters(filters = {}) {
  const normalized = { ...filters };

  if (normalized.minFollowers !== undefined && normalized.min_followers === undefined) {
    normalized.min_followers = normalized.minFollowers;
  }
  if (normalized.maxFollowers !== undefined && normalized.max_followers === undefined) {
    normalized.max_followers = normalized.maxFollowers;
  }
  if (normalized.minRating !== undefined && normalized.min_rating === undefined) {
    normalized.min_rating = normalized.minRating;
  }
  if (normalized.maxRating !== undefined && normalized.max_rating === undefined) {
    normalized.max_rating = normalized.maxRating;
  }

  delete normalized.minFollowers;
  delete normalized.maxFollowers;
  delete normalized.minRating;
  delete normalized.maxRating;

  if (normalized.state_short != null && normalized.stateShort === undefined) {
    normalized.stateShort = normalized.state_short;
  }
  delete normalized.state_short;

  delete normalized.country_code;
  delete normalized.city_country_code;
  delete normalized.audienceCountryCode;
  delete normalized.audienceCityCountryCode;

  if (Array.isArray(normalized.statuses) && normalized.statuses.length > 0) {
    normalized.status = normalized.statuses.join(",");
    delete normalized.statuses;
  }

  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];
    if (value === "" || value === null || value === undefined) {
      delete normalized[key];
      return;
    }
    if (Array.isArray(value) && value.length === 0) {
      delete normalized[key];
    }
  });

  return normalized;
}
