import { FontOption } from "@/types/fonts";

// Curated list of Google Fonts perfect for invitations
export const INVITATION_FONTS: FontOption[] = [
  // Elegant Serif
  {
    name: "Playfair Display",
    value: "playfair",
    variable: "--font-playfair",
    category: "serif",
    preview: "Elegant & Classic",
  },
  {
    name: "Cormorant Garamond",
    value: "cormorant",
    variable: "--font-cormorant",
    category: "serif",
    preview: "Sophisticated & Refined",
  },
  {
    name: "Libre Baskerville",
    value: "libre",
    variable: "--font-libre",
    category: "serif",
    preview: "Traditional & Timeless",
  },

  // Modern Sans-Serif
  {
    name: "Montserrat",
    value: "montserrat",
    variable: "--font-montserrat",
    category: "sans-serif",
    preview: "Clean & Modern",
  },
  {
    name: "Poppins",
    value: "poppins",
    variable: "--font-poppins",
    category: "sans-serif",
    preview: "Friendly & Contemporary",
  },
  {
    name: "Raleway",
    value: "raleway",
    variable: "--font-raleway",
    category: "sans-serif",
    preview: "Stylish & Minimal",
  },

  // Display & Decorative
  {
    name: "Abril Fatface",
    value: "abril",
    variable: "--font-abril",
    category: "display",
    preview: "Bold & Striking",
  },
  {
    name: "Righteous",
    value: "righteous",
    variable: "--font-righteous",
    category: "display",
    preview: "Fun & Playful",
  },
  {
    name: "Fredoka",
    value: "fredoka",
    variable: "--font-fredoka",
    category: "display",
    preview: "Rounded & Cheerful",
  },

  // Handwriting & Script
  {
    name: "Dancing Script",
    value: "dancing",
    variable: "--font-dancing",
    category: "handwriting",
    preview: "Elegant Script",
  },
  {
    name: "Pacifico",
    value: "pacifico",
    variable: "--font-pacifico",
    category: "handwriting",
    preview: "Casual & Friendly",
  },
  {
    name: "Great Vibes",
    value: "great-vibes",
    variable: "--font-great-vibes",
    category: "handwriting",
    preview: "Formal Calligraphy",
  },
];

export const FONT_CATEGORIES = [
  { value: "all", label: "Tutti i font" },
  { value: "serif", label: "Serif (Classici)" },
  { value: "sans-serif", label: "Sans-serif (Moderni)" },
  { value: "display", label: "Display (Decorativi)" },
  { value: "handwriting", label: "Handwriting (Script)" },
];
