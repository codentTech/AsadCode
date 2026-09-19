"use client";

import { useParams } from "next/navigation";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import LegalDocumentPage from "@/components/legal/legal-document/legal-document.component";

export default function Page() {
  const params = useParams();

  return (
    <Auth
      component={<LegalDocumentPage audience="creator" doc={params.doc} />}
      type={AUTH.PUBLIC}
    />
  );
}
