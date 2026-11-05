import { Helmet } from "@dr.pogodin/react-helmet";
import { ScrollRestoration } from "react-router";
import Footer from "@/layouts/parts/Footer";
import Header from "@/layouts/parts/Header";
import Website from "@/layouts/Website";
import WhatsAppButton from "@/components/WhatsAppButton";
function RootLayout({ children }) {
  return (
    /* @__PURE__ */ <Website>
      <Helmet>
        <title>DESIREFIT — Commercial EV Charging Solutions</title>
        <meta
          name="description"
          content="DESIREFIT delivers precision-engineered EV charging infrastructure for commercial fleets, parking facilities, and property developers."
        />
      </Helmet>
      <ScrollRestoration />
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
    </Website>
  );
}
export { RootLayout as default };
