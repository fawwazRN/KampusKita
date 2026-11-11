import { useEffect } from "react";
import { site } from "../data/site";

export default function Analytics() {
  const { ga4, metaPixel } = site.analytics;

  useEffect(() => {
    if (!ga4) return undefined;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga4, { anonymize_ip: true });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [ga4]);

  useEffect(() => {
    if (!metaPixel) return undefined;

    window.fbq =
      window.fbq ||
      function fbq() {
        window.fbq.queue.push(arguments);
      };
    window.fbq.queue = window.fbq.queue || [];
    window.fbq("init", metaPixel);
    window.fbq("track", "PageView");

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [metaPixel]);

  return null;
}
