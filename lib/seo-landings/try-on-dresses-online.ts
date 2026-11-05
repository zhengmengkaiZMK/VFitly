import type { LandingPageContent } from "./types";

export const tryOnDressesOnline: LandingPageContent = {
  slug: "/try-on-dresses-online",
  title: "Try On Dresses Online with AI: See Dresses on Your Photo | VFitly",
  description:
    "Try on dresses online before you buy. Upload your photo and preview casual, work and evening dresses with AI — compare silhouettes, lengths and colors on your own body.",
  h1: "Try On Dresses Online",
  breadcrumb: "Try On Dresses Online",
  answer:
    "VFitly lets you try dresses on online using a photo of yourself. Upload your picture, add the dress — a product image, a shopping link or a wardrobe item — and VFitly previews it on you. Previews show silhouette and color; they do not guarantee exact size, fit or fabric.",
  intro:
    "Dresses are the hardest category to buy online: a wrong length or waist line ruins the whole look, and returns are slow. Previewing each dress on your own photo — with the same base photo for every dress — gives you a consistent visual comparison before checkout.",
  ctaLabel: "Try on dresses now",
  ctaHref: "/dashboard/try-on",
  howItWorks: [
    {
      title: "Upload your photo",
      description: "One clear full-body picture in even light. You only need to do this once per comparison session.",
    },
    {
      title: "Add each dress",
      description:
        "Upload product images, paste shopping links to extract the dress photos automatically, or reuse dresses saved in your wardrobe.",
    },
    {
      title: "Generate and compare",
      description:
        "Generate a preview per dress and compare them side by side. Mini versus midi versus maxi becomes an honest comparison on your body.",
    },
    {
      title: "Decide with confidence",
      description: "Keep the winners in your history, save the dresses to your wardrobe, and order the one that clearly worked.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Casual day dresses",
      description: "Sundresses, shirt dresses and knit dresses for everyday wear.",
    },
    {
      title: "Work-appropriate dresses",
      description: "Sheaths, shirt dresses and midi lengths that read professional.",
    },
    {
      title: "Evening and occasion dresses",
      description: "Cocktail, formal and event dresses where silhouette matters most.",
    },
    {
      title: "Seasonal lengths and colors",
      description: "Compare hemlines and colorways of the same dress on one photo.",
    },
  ],
  supportedInputs: [
    "Your full-body photo",
    "Dress product images from any online shop",
    "Shopping links — dress images extracted automatically, including colorways",
    "Dresses saved in your VFitly wardrobe",
    "Optional styling notes such as \"summer wedding guest\"",
  ],
  tips: [
    "Use the same base photo for every dress in a session — mixed photos make comparisons unreliable.",
    "Judge length and waist placement first; those are the details a preview shows most reliably.",
    "Try both colorways of a dress you like before ordering — color reads very differently on photos.",
    "For prints and lace, check the product page for true pattern detail; the AI approximates fine patterns.",
    "Pair the winning dress with shoes from your wardrobe to preview the complete look.",
  ],
  canShow: [
    "How the silhouette and hemline sit on your proportions",
    "Which colorway flatters you more, compared on one photo",
    "Whether a dress reads casual or formal with your coloring",
    "The complete look when the dress is combined with shoes or outerwear",
  ],
  cannotShow: [
    "Exact bust, waist or hip fit — check the retailer's size chart",
    "True fabric drape, stretch or lining",
    "Fine print alignment, lace pattern or sequin detail",
    "How the dress moves as you walk; the try-on video adds a motion cue but stays a visualization",
  ],
  privacy:
    "Your photos and saved dresses stay attached to your account, are used only to generate the previews you request, and can be deleted at any time from your wardrobe or history. See the privacy policy for the full details.",
  pricing:
    "Start free — every account has a daily allowance, and extracting dresses from shopping links is free. Paid plans add monthly credits for larger comparison sessions and video generations. Image and video generations are counted separately.",
  faqs: [
    {
      question: "Can I try on dresses from any online store?",
      answer:
        "Paste the product link and VFitly extracts the publicly visible dress images, or upload the product photo yourself. Most fashion e-commerce product pages work with one of these methods.",
    },
    {
      question: "Will the preview show the exact dress length on me?",
      answer:
        "The preview approximates the length relative to your proportions. It is a strong visual signal, but not a measurement — confirm against the product's size information before ordering.",
    },
    {
      question: "Can I compare several dresses at once?",
      answer:
        "Yes, and you should. Run every candidate through the same base photo, then compare the previews side by side in your history.",
    },
    {
      question: "Does it work for petite and tall sizes?",
      answer:
        "The preview adapts to your photo's proportions, so petite and tall differences in silhouette show up visually. Exact graded sizing still comes from the retailer's chart.",
    },
    {
      question: "Is trying on dresses online free?",
      answer:
        "There is a free daily allowance, and extracting dresses from shopping links costs nothing. Paid plans add credits for heavy use.",
    },
  ],
  related: [
    {
      label: "Try on wedding dresses",
      href: "/try-on-wedding-dresses",
      description: "Bridal gowns and wedding guest looks, planned at home.",
    },
    {
      label: "Try on shirts online",
      href: "/try-on-shirts-online",
      description: "Tops, blouses and shirts on your photo.",
    },
    {
      label: "Try on shoes online",
      href: "/try-on-shoes-online",
      description: "Complete the look with the right pair of shoes.",
    },
    {
      label: "Virtual fitting room",
      href: "/virtual-fitting-room",
      description: "What a virtual fitting room does and its limits.",
    },
  ],
};
