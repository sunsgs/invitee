import {
  Abril_Fatface,
  Bagel_Fat_One,
  Cormorant_Garamond,
  Dancing_Script,
  Fredoka,
  Great_Vibes,
  Libre_Baskerville,
  Montserrat,
  Pacifico,
  Playfair_Display,
  Poppins,
  Raleway,
  Righteous,
} from "next/font/google";

// Elegant Serif
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "700"],
  display: "swap",
});

export const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  weight: ["400", "700"],
  display: "swap",
});

// Modern Sans-Serif
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "700"],
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "700"],
  display: "swap",
});

// Display & Decorative
export const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  variable: "--font-abril",
  weight: ["400"],
  display: "swap",
});

export const righteous = Righteous({
  subsets: ["latin"],
  variable: "--font-righteous",
  weight: ["400"],
  display: "swap",
});

export const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "700"],
  display: "swap",
});

// Handwriting & Script
export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["400", "700"],
  display: "swap",
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: ["400"],
  display: "swap",
});

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
  display: "swap",
});

const bagel = Bagel_Fat_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bagel",
  display: "swap", // Optional: if you want to use it as a Tailwind utility via CSS variable
});

// Export all font variables for root layout
export const allFontVariables = [
  playfairDisplay.variable,
  cormorantGaramond.variable,
  libreBaskerville.variable,
  montserrat.variable,
  poppins.variable,
  raleway.variable,
  abrilFatface.variable,
  righteous.variable,
  fredoka.variable,
  dancingScript.variable,
  pacifico.variable,
  greatVibes.variable,
  bagel.variable,
].join(" ");
