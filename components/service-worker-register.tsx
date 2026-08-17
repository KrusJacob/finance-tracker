"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    console.log("[SW] useEffect started");

    if (typeof window === "undefined") {
      console.log("[SW] no window");
      return;
    }

    if (!("serviceWorker" in navigator)) {
      console.log("[SW] no serviceWorker in navigator");
      return;
    }

    console.log("[SW] trying to register /sw.js");

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[SW] registered:", reg.scope);
      })
      .catch((err) => {
        console.error("[SW] registration error:", err);
      });
  }, []);

  return null;
}
