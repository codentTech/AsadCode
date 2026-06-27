"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import LegalDocumentPage from "@/components/legal/legal-document/legal-document.component";

export default function Page({ params }) {
  return (
    <Auth
      component={<LegalDocumentPage audience="client" doc={params.doc} />}
      type={AUTH.PUBLIC}
    />
  );
}
