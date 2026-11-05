import type { LandingPageContent } from "./types";

export const tryOnShirtsOnline: LandingPageContent = {
  slug: "/try-on-shirts-online",
  title: "Try On Shirts & Tops Online with AI | VFitly",
  description:
    "Try on shirts, t-shirts, blouses and tops online with AI. Upload your photo, add the garment image or shopping link, and preview how each top looks on you before buying.",
  h1: "Try On Shirts Online",
  breadcrumb: "Try On Shirts Online",
  answer:
    "VFitly lets you try shirts and tops on online with a photo of yourself. Upload your picture plus the garment image — or paste a shopping link — and VFitly previews the shirt on you. The preview shows cut, color and overall look; it does not confirm exact measurements or fit.",
  intro:
    "Tops are where most online order mistakes happen: the shoulder seam sits wrong, the sleeve length is off, or the color looks nothing like the listing. Trying each shirt on your own photo — one after another on the same picture — surfaces those mismatches before you pay.",
  ctaLabel: "Try on shirts",
  ctaHref: "/dashboard/try-on",
  howItWorks: [
    {
      title: "Upload a clear photo",
      description:
        "A photo of your upper and full body in even light. Keep your arms relaxed and away from your torso so the garment has room to render.",
    },
    {
      title: "Add the shirts",
      description:
        "Upload product images, extract them from a shopping link, or reuse tops already saved in your wardrobe.",
    },
    {
      title: "Generate the previews",
      description:
        "Render each shirt on your photo. Extracting from a link is free; each preview uses one generation credit.",
    },
    {
      title: "Compare and order",
      description: "Compare the previews, keep the best matches in your history, and order the one that clearly worked.",
    },
  ],
  whatYouCanTry: [
    {
      title: "T-shirts and polos",
      description: "Casual staples where fit and color make the difference.",
    },
    {
      title: "Shirts and blouses",
      description: "Button-downs, oxfords and blouses for work or smart-casual looks.",
    },
    {
      title: "Sweaters and knitwear",
      description: "Chunky and fine knits, previewed with the rest of your outfit.",
    },
    {
      title: "Colorways of one product",
      description: "Extract every color a shop offers and preview them all on your photo.",
    },
  ],
  supportedInputs: [
    "A clear photo of yourself (upper body or full body)",
    "Shirt product images uploaded from your device",
    "Shopping links — product images extracted automatically",
    "Tops saved in your VFitly wardrobe",
    "Optional styling notes",
  ],
  tips: [
    "Keep arms relaxed and slightly away from the body in your base photo; crossed arms hide where the shirt goes.",
    "Compare the same shirt in several colors on one photo rather than trusting the listing images.",
    "Check collar and shoulder placement in the preview — those are the most reliably rendered details on tops.",
    "For striped or checked shirts, expect approximate pattern alignment; verify on the product page.",
    "Combine the winning shirt with trousers and shoes from your wardrobe to preview the full outfit.",
  ],
  canShow: [
    "How a shirt's cut and length sit on your torso",
    "Whether a color suits you compared with other colorways",
    "How formal the shirt reads with your complexion and style",
    "The complete look when combined with other wardrobe pieces",
  ],
  cannotShow: [
    "Exact chest, shoulder or sleeve measurements — use the size chart",
    "Fabric thickness, stretch or wrinkle behavior",
    "Precise stripe or check alignment",
    "Comfort; a preview cannot tell you how a collar feels after an hour",
  ],
  privacy:
    "Uploaded photos and shirts stay attached to your account, are used only for the previews you request, and can be deleted at any time from your wardrobe and history. Full details are in the privacy policy.",
  pricing:
    "Every account includes a free daily allowance, and extracting shirts from shopping links is free. Paid plans add monthly credits for larger batches. Image and video generations are counted separately — see the pricing page.",
  faqs: [
    {
      question: "Can I try a shirt on from a shopping link?",
      answer:
        "Yes. Paste the product URL and VFitly extracts the publicly visible garment images, including colorways. Review the extracted images, then generate a preview for each.",
    },
    {
      question: "Does the preview show the correct sleeve length?",
      answer:
        "It approximates the sleeve relative to your arms. It is a good visual check for gross mismatches, but not a substitute for the listed measurements.",
    },
    {
      question: "Can I preview the same shirt in different colors?",
      answer:
        "Yes — that is one of the best uses of the tool. Extract all colorways from the product page and generate a preview for each on the same photo.",
    },
    {
      question: "Is it free to try on shirts online?",
      answer:
        "There is a free daily allowance on every account, and link extraction costs nothing. Paid plans cover larger batches.",
    },
    {
      question: "Can I try the shirt as part of a full outfit?",
      answer:
        "Yes. Save the shirt to your wardrobe, select it with trousers and shoes from different categories, and generate the combined outfit.",
    },
  ],
  related: [
    {
      label: "Try on clothes online",
      href: "/try-on-clothes-online",
      description: "The full workflow for trying any garment on your photo.",
    },
    {
      label: "Try on dresses online",
      href: "/try-on-dresses-online",
      description: "Dresses: casual, work and occasion.",
    },
    {
      label: "AI outfit generator",
      href: "/ai-outfit-generator",
      description: "Combine the shirt into a complete generated outfit.",
    },
    {
      label: "Virtual wardrobe",
      href: "/virtual-wardrobe",
      description: "Save and reuse every top you preview.",
    },
  ],
};
