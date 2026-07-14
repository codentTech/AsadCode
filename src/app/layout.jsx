import "@/common/styles/dashboard/dashboard.style.css";
import "@/common/styles/globals.style.css";
import "@/common/styles/home.style.scss";
import { SITE_NAME } from "@/common/constants/site.constant";
import AppProviders from "./providers";

export const metadata = {
  metadataBase: new URL("https://cleercut.com"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "CleerCut is an all-in-one influencer marketing platform for brands and creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
