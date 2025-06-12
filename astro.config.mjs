import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://code.pujianto.dev",
  integrations: [
    starlight({
      title: "Pujianto's Code",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/pujiantodev",
        },
      ],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Introduction",
          link: "/intro",
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Tips & Tricks",
          autogenerate: { directory: "tips" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
