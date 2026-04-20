function resolveBrandProfile(holder) {
  if (!holder) return null;
  return holder.brand_profile || holder.brandProfile || null;
}

function brandNameFromProfile(profile) {
  if (!profile) return "";
  const raw = profile.brand_name ?? profile.brandName;
  return String(raw || "").trim();
}

export function getBrandDisplayNameForContract(campaignData) {
  if (!campaignData) return "[Brand Name]";
  const fromCreatedBy = brandNameFromProfile(resolveBrandProfile(campaignData.created_by));
  const fromBrand = brandNameFromProfile(resolveBrandProfile(campaignData.brand));
  const fromProfile = fromCreatedBy || fromBrand;
  if (fromProfile) return fromProfile;
  const fromPerson = `${campaignData?.created_by?.first_name || campaignData?.created_by?.firstName || campaignData?.brand?.first_name || campaignData?.brand?.firstName || ""} ${campaignData?.created_by?.last_name || campaignData?.created_by?.lastName || campaignData?.brand?.last_name || campaignData?.brand?.lastName || ""}`.trim();
  return fromPerson || "[Brand Name]";
}

export function getBrandDisplayNameForBrandUser(brand) {
  if (!brand) return "Brand";
  const fromProfile = brandNameFromProfile(resolveBrandProfile(brand));
  if (fromProfile) return fromProfile;
  const fromPerson = `${brand.first_name || brand.firstName || ""} ${brand.last_name || brand.lastName || ""}`.trim();
  return fromPerson || brand.first_name || brand.firstName || "Brand";
}

export function getBrandLogoUrlFromBrandUser(brand) {
  const bp = resolveBrandProfile(brand);
  if (!bp) return null;
  return bp.logo || bp.brand_logo_url || bp.brandLogoUrl || null;
}
