import type { LandingPageContent } from "./types";

export const tryOnShoesOnline: LandingPageContent = {
  slug: "/try-on-shoes-online",
  title: "Try On Shoes Online with AI: Preview Shoes on Your Photo | VFitly",
  description:
    "Try on shoes online with AI. Upload a full-body photo, add the pair you are considering — product image or shopping link — and preview how the shoes complete your outfit before buying.",
  h1: "Try On Shoes Online",
  breadcrumb: "Try On Shoes Online",
  answer:
    "VFitly lets you try shoes on online using a full-body photo of yourself. Upload your picture and the shoe images — a product photo, a shopping link or a saved wardrobe item — and VFitly previews the pair on you. The preview shows style and proportion; sizing still comes from the brand's chart.",
  intro:
    "Shoes are the piece most people leave to chance when shopping online. A full-body preview answers the questions listing photos cannot: do these boots overwhelm my frame, do white sneakers work with this outfit, does the heel height read the way I imagine?",
  ctaLabel: "Try on shoes",
  ctaHref: "/dashboard/try-on",
  howItWorks: [
    {
      title: "Use a full-body photo",
      description: "Shoes render at your feet, so a full-body shot that includes your feet is required. Even light and a plain floor help.",
    },
    {
      title: "Add the shoes",
      description: "Upload product images of the pair, extract them from a shopping link, or pick a pair saved in your wardrobe.",
    },
    {
      title: "Generate the preview",
      description: "Render the shoes on your photo. Generate once per pair or per colorway you are considering.",
    },
    {
      title: "Judge proportion and style",
      description: "Compare pairs on the same photo, with the outfit you plan to wear them with, and keep the best match.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Sneakers and trainers",
      description: "Casual pairs previewed with jeans, dresses or sportswear.",
    },
    {
      title: "Boots",
      description: "Ankle, Chelsea and knee-high boots, where proportion matters most.",
    },
    {
      title: "Heels and dress shoes",
      description: "Formal pairs previewed with the outfit you plan to wear them with.",
    },
    {
      title: "Flats and loafers",
      description: "Everyday pairs checked against multiple outfits from your wardrobe.",
    },
  ],
  supportedInputs: [
    "A full-body photo that includes your feet",
    "Shoe product images uploaded from your device",
    "Shopping links — product images extracted automatically",
    "Pairs saved in your VFitly wardrobe",
    "Optional styling notes about the occasion",
  ],
  tips: [
    "Photograph yourself in the trousers or dress length you plan to wear — hemlines change how shoes read.",
    "Compare two or three candidate pairs on the same photo and outfit, not on different outfits.",
    "Judge color and proportion in the preview; verify materials and sole type on the product page.",
    "For boots, try them with both shorter and longer hemlines to see the proportion difference.",
    "Save the winning pair to your wardrobe so future outfit planning starts from it.",
  ],
  canShow: [
    "How the pair's silhouette and height work with your proportions",
    "Whether the color complements the rest of the outfit",
    "A fair comparison of several pairs on one identical photo",
    "The complete head-to-toe look including the shoes",
  ],
  cannotShow: [
    "Shoe sizing — width, length and arch support always come from the brand's chart",
    "Material quality, leather finish or sole grip",
    "Exact logo and stitching detail",
    "Comfort or break-in behavior",
  ],
  privacy:
    "Your photo and saved pairs stay attached to your account, are used only to generate the previews you request, and can be deleted at any time. See the privacy policy for full details.",
  pricing:
    "Start with the free daily allowance; extracting shoes from shopping links is free. Paid plans add monthly credits for larger comparisons and video generations. See the pricing page for current allowances.",
  faqs: [
    {
      question: "Can AI show how shoes fit my feet?",
      answer:
        "No. The preview shows style and proportion on your photo. Sizing — length and width — must come from the brand's size chart and reviews.",
    },
    {
      question: "Do I need a full-body photo for trying on shoes?",
      answer:
        "Yes. Shoes render at your feet, so the photo must include them. A plain floor and even light produce the cleanest results.",
    },
    {
      question: "Can I try shoes with a specific outfit?",
      answer:
        "Yes — that is the best way. Add the outfit's pieces from your wardrobe and preview the shoes with them, or generate the full outfit including the shoes.",
    },
    {
      question: "Can I extract shoes from a shopping link?",
      answer:
        "Yes. Paste the product URL and VFitly extracts the publicly visible product images, including colorways, at no credit cost.",
    },
    {
      question: "Is trying on shoes online free?",
      answer:
        "Every account has a free daily allowance. Paid plans add monthly credits for larger batches.",
    },
  ],
  related: [
    {
      label: "Try on clothes online",
      href: "/try-on-clothes-online",
      description: "Preview the garments, then complete the look with shoes.",
    },
    {
      label: "AI outfit generator",
      href: "/ai-outfit-generator",
      description: "Generate full outfits that include the shoes.",
    },
    {
      label: "Virtual wardrobe",
      href: "/virtual-wardrobe",
      description: "Keep your favorite pairs alongside your clothes.",
    },
    {
      label: "Virtual fitting room",
      href: "/virtual-fitting-room",
      description: "What a virtual fitting room can and cannot measure.",
    },
  ],
};
