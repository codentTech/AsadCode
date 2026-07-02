import creatorAgreement from "./creator/creator-agreement";
import creatorPrivacyPolicy from "./creator/privacy-policy";
import creatorCookiePolicy from "./creator/cookie-policy";
import creatorCommunityGuidelines from "./creator/community-guidelines";
import creatorUserVerificationPolicy from "./creator/user-verification-policy";
import creatorEscrowAndPaymentTerms from "./creator/escrow-and-payment-terms";
import creatorRefundPolicy from "./creator/refund-policy";
import creatorCopyrightDmcaPolicy from "./creator/copyright-dmca-policy";
import creatorAgeEligibilityPolicy from "./creator/age-eligibility-policy";
import creatorAccessibilityStatement from "./creator/accessibility-statement";
import creatorDataRetentionPolicy from "./creator/data-retention-policy";
import creatorSecurityPolicy from "./creator/security-policy";
import creatorNonDiscriminationStatement from "./creator/non-discrimination-statement";
import creatorUsStatePrivacyNotice from "./creator/us-state-privacy-notice";
import creatorGlobalDataProcessingAgreement from "./creator/global-data-processing-agreement";
import clientAgreement from "./client/client-agreement";
import clientTermsOfService from "./client/terms-of-service";
import clientPrivacyPolicy from "./client/privacy-policy";
import clientCookiePolicy from "./client/cookie-policy";
import clientCommunityGuidelines from "./client/community-guidelines";
import clientUserVerificationPolicy from "./client/user-verification-policy";
import clientPlatformFeesAndPricing from "./client/platform-fees-and-pricing";
import clientEscrowAndPaymentTerms from "./client/escrow-and-payment-terms";
import clientRefundPolicy from "./client/refund-policy";
import clientTermsOfSale from "./client/terms-of-sale";
import clientFeeAndPaymentAuthorizationAgreement from "./client/fee-and-payment-authorization-agreement";
import clientCopyrightDmcaPolicy from "./client/copyright-dmca-policy";
import clientProprietaryRightsInfringementReporting from "./client/proprietary-rights-infringement-reporting";
import clientUseOfCleercutMarks from "./client/use-of-cleercut-marks";
import clientAgeEligibilityPolicy from "./client/age-eligibility-policy";
import clientAccessibilityStatement from "./client/accessibility-statement";
import clientDataRetentionPolicy from "./client/data-retention-policy";
import clientSecurityPolicy from "./client/security-policy";
import clientNonDiscriminationStatement from "./client/non-discrimination-statement";
import clientUsStatePrivacyNotice from "./client/us-state-privacy-notice";
import clientGlobalDataProcessingAgreement from "./client/global-data-processing-agreement";

export const LEGAL_DOC_INDEX = {
  creator: [
    { slug: "creator-agreement", label: "Creator Agreement" },
    { slug: "privacy-policy", label: "Privacy Policy" },
    { slug: "cookie-policy", label: "Cookie Policy" },
    { slug: "community-guidelines", label: "Community Guidelines" },
    { slug: "user-verification-policy", label: "User Verification Policy" },
    { slug: "escrow-and-payment-terms", label: "Escrow and Payment Terms" },
    { slug: "refund-policy", label: "Refund Policy" },
    { slug: "copyright-dmca-policy", label: "Copyright (DMCA) Policy" },
    { slug: "age-eligibility-policy", label: "Age Eligibility Policy" },
    { slug: "accessibility-statement", label: "Accessibility Statement" },
    { slug: "data-retention-policy", label: "Data Retention Policy" },
    { slug: "security-policy", label: "Security Policy" },
    { slug: "non-discrimination-statement", label: "Non-Discrimination Statement" },
    { slug: "us-state-privacy-notice", label: "U.S. State Privacy Notice" },
    { slug: "global-data-processing-agreement", label: "Global Data Processing Agreement" },
  ],
  client: [
    { slug: "client-agreement", label: "Client Agreement" },
    { slug: "terms-of-service", label: "Terms of Service" },
    { slug: "privacy-policy", label: "Privacy Policy" },
    { slug: "cookie-policy", label: "Cookie Policy" },
    { slug: "community-guidelines", label: "Community Guidelines" },
    { slug: "user-verification-policy", label: "User Verification Policy" },
    { slug: "platform-fees-and-pricing", label: "Platform Fees and Pricing" },
    { slug: "escrow-and-payment-terms", label: "Escrow and Payment Terms" },
    { slug: "refund-policy", label: "Refund Policy" },
    { slug: "terms-of-sale", label: "Terms of Sale" },
    {
      slug: "fee-and-payment-authorization-agreement",
      label: "Fee and Payment Authorization Agreement",
    },
    { slug: "copyright-dmca-policy", label: "Copyright (DMCA) Policy" },
    {
      slug: "proprietary-rights-infringement-reporting",
      label: "Proprietary Rights Infringement Reporting",
    },
    { slug: "use-of-cleercut-marks", label: "Use of CleerCut Marks" },
    { slug: "age-eligibility-policy", label: "Age Eligibility Policy" },
    { slug: "accessibility-statement", label: "Accessibility Statement" },
    { slug: "data-retention-policy", label: "Data Retention Policy" },
    { slug: "security-policy", label: "Security Policy" },
    { slug: "non-discrimination-statement", label: "Non-Discrimination Statement" },
    { slug: "us-state-privacy-notice", label: "U.S. State Privacy Notice" },
    { slug: "global-data-processing-agreement", label: "Global Data Processing Agreement" },
  ],
};

export const LEGAL_DOC_GROUPS = {
  creator: [
    {
      title: "Core agreement",
      description: "Terms governing your use of CleerCut as a creator.",
      slugs: ["creator-agreement"],
    },
    {
      title: "Privacy & data",
      description: "How we collect, use, and protect your information.",
      slugs: [
        "privacy-policy",
        "cookie-policy",
        "data-retention-policy",
        "us-state-privacy-notice",
        "global-data-processing-agreement",
      ],
    },
    {
      title: "Payments & escrow",
      description: "Funding, release, disputes, and refunds.",
      slugs: ["escrow-and-payment-terms", "refund-policy"],
    },
    {
      title: "Platform policies",
      description: "Community standards, verification, eligibility, and security.",
      slugs: [
        "community-guidelines",
        "user-verification-policy",
        "age-eligibility-policy",
        "security-policy",
        "non-discrimination-statement",
        "accessibility-statement",
      ],
    },
    {
      title: "Intellectual property",
      description: "Copyright and content-related policies.",
      slugs: ["copyright-dmca-policy"],
    },
  ],
  client: [
    {
      title: "Agreements & terms",
      description: "Contracts and platform terms for brands and agencies.",
      slugs: [
        "client-agreement",
        "terms-of-service",
        "terms-of-sale",
        "fee-and-payment-authorization-agreement",
      ],
    },
    {
      title: "Privacy & data",
      description: "Privacy, cookies, retention, and data processing.",
      slugs: [
        "privacy-policy",
        "cookie-policy",
        "data-retention-policy",
        "us-state-privacy-notice",
        "global-data-processing-agreement",
      ],
    },
    {
      title: "Payments & pricing",
      description: "Fees, escrow, billing, and refund rules.",
      slugs: ["platform-fees-and-pricing", "escrow-and-payment-terms", "refund-policy"],
    },
    {
      title: "Platform policies",
      description: "Community, verification, eligibility, and conduct.",
      slugs: [
        "community-guidelines",
        "user-verification-policy",
        "age-eligibility-policy",
        "non-discrimination-statement",
        "accessibility-statement",
        "security-policy",
      ],
    },
    {
      title: "Intellectual property",
      description: "Copyright, trademarks, and brand usage.",
      slugs: [
        "copyright-dmca-policy",
        "proprietary-rights-infringement-reporting",
        "use-of-cleercut-marks",
      ],
    },
  ],
};

export function getLegalDocGroups(audience) {
  const indexBySlug = Object.fromEntries(
    (LEGAL_DOC_INDEX[audience] ?? []).map((item) => [item.slug, item])
  );

  return (LEGAL_DOC_GROUPS[audience] ?? [])
    .map((group) => ({
      title: group.title,
      description: group.description,
      documents: group.slugs
        .map((slug) => indexBySlug[slug])
        .filter(Boolean),
    }))
    .filter((group) => group.documents.length > 0);
}

export const LEGAL_DOCS = {
  creator: {
    "creator-agreement": creatorAgreement,
    "privacy-policy": creatorPrivacyPolicy,
    "cookie-policy": creatorCookiePolicy,
    "community-guidelines": creatorCommunityGuidelines,
    "user-verification-policy": creatorUserVerificationPolicy,
    "escrow-and-payment-terms": creatorEscrowAndPaymentTerms,
    "refund-policy": creatorRefundPolicy,
    "copyright-dmca-policy": creatorCopyrightDmcaPolicy,
    "age-eligibility-policy": creatorAgeEligibilityPolicy,
    "accessibility-statement": creatorAccessibilityStatement,
    "data-retention-policy": creatorDataRetentionPolicy,
    "security-policy": creatorSecurityPolicy,
    "non-discrimination-statement": creatorNonDiscriminationStatement,
    "us-state-privacy-notice": creatorUsStatePrivacyNotice,
    "global-data-processing-agreement": creatorGlobalDataProcessingAgreement,
  },
  client: {
    "client-agreement": clientAgreement,
    "terms-of-service": clientTermsOfService,
    "privacy-policy": clientPrivacyPolicy,
    "cookie-policy": clientCookiePolicy,
    "community-guidelines": clientCommunityGuidelines,
    "user-verification-policy": clientUserVerificationPolicy,
    "platform-fees-and-pricing": clientPlatformFeesAndPricing,
    "escrow-and-payment-terms": clientEscrowAndPaymentTerms,
    "refund-policy": clientRefundPolicy,
    "terms-of-sale": clientTermsOfSale,
    "fee-and-payment-authorization-agreement": clientFeeAndPaymentAuthorizationAgreement,
    "copyright-dmca-policy": clientCopyrightDmcaPolicy,
    "proprietary-rights-infringement-reporting": clientProprietaryRightsInfringementReporting,
    "use-of-cleercut-marks": clientUseOfCleercutMarks,
    "age-eligibility-policy": clientAgeEligibilityPolicy,
    "accessibility-statement": clientAccessibilityStatement,
    "data-retention-policy": clientDataRetentionPolicy,
    "security-policy": clientSecurityPolicy,
    "non-discrimination-statement": clientNonDiscriminationStatement,
    "us-state-privacy-notice": clientUsStatePrivacyNotice,
    "global-data-processing-agreement": clientGlobalDataProcessingAgreement,
  },
};

export function getLegalDocument(audience, slug) {
  return LEGAL_DOCS[audience]?.[slug] ?? null;
}
