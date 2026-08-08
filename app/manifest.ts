import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Финансы — учёт доходов и расходов",
    short_name: "Финансы",
    description:
      "Офлайн-трекер личных финансов: доходы, расходы, графики и статистика. Данные хранятся на вашем устройстве.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a201d",
    theme_color: "#1a201d",
    lang: "ru",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
