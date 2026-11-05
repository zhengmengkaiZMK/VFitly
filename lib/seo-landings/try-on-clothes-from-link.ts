import type { LandingPageContent } from "./types";

export const tryOnClothesFromLink: LandingPageContent = {
  slug: "/try-on-clothes-from-link",
  title: "Try On Clothes from a Product Link: Paste a URL | VFitly",
  description:
    "Paste an online shopping link and try the clothes on your own photo. VFitly extracts the product images — including colorways — and generates AI try-on previews before you order.",
  h1: "Try On Clothes from a Product Link",
  breadcrumb: "Try On Clothes from a Link",
  answer:
    "Paste any online shopping link into VFitly and the product's garment images are extracted automatically — including the colorways the shop shows. Pick a garment, upload your photo, and generate an AI try-on preview before you order. Extracting images from a link is free.",
  intro:
    "This is the fastest path from \"I found something I like\" to \"I know how it looks on me\": no screenshots, no downloads. The link tool pulls the same product photos the shop displays, so what you preview is what the product page promises.",
  ctaLabel: "Try a product link",
  ctaHref: "/dashboard/product-try-on",
  howItWorks: [
    {
      title: "Copy the product URL",
      description: "Open the product page of any clothing item you are considering and copy its address.",
    },
    {
      title: "Paste it into VFitly",
      description:
        "VFitly visits the page and extracts the publicly visible garment images, including the different colorways the shop lists.",
    },
    {
      title: "Review the extracted images",
      description:
        "Delete the images you do not need and keep the garments — or colorways — you actually want to try.",
    },
    {
      title: "Generate the try-on preview",
      description:
        "With your base photo in place, generate a preview for each extracted garment. Extraction costs nothing; only the preview uses a credit.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Single products",
      description: "One link, one garment, one preview — the quick check before adding to cart.",
    },
    {
      title: "Colorway comparisons",
      description: "Try every color the shop offers and pick the shade that suits you.",
    },
    {
      title: "Cart candidates",
      description: "Paste links for everything in your cart and preview them on one photo before paying.",
    },
    {
      title: "Wishlist items",
      description: "Extract and save garments from wishlist links to try them later against new outfits.",
    },
  ],
  supportedInputs: [
    "Product page URLs from online clothing stores",
    "Your base photo (uploaded once, reused for every link)",
    "Manually uploaded product images as a fallback when a page blocks extraction",
    "Wardrobe items for combining with link-extracted garments",
  ],
  tips: [
    "Paste the direct product page URL, not a category or search results page.",
    "If extraction returns few images, screenshot the product photo and upload it manually instead.",
    "Try all colorways in one session — the marginal cost is one preview per color, and the comparison is decisive.",
    "Extract first, preview second: curating the extracted images keeps your credits for the garments you actually care about.",
    "Save extracted garments to your wardrobe if you plan to compare them with future purchases.",
  ],
  canShow: [
    "How the exact product photos read on your body",
    "Differences between colorways on an identical photo",
    "Whether a cart candidate is worth the order",
    "How a link-extracted garment combines with items you already own",
  ],
  cannotShow: [
    "Guaranteed sizing — keep using the shop's size chart",
    "Fabric texture or quality beyond what the product photos show",
    "Extraction from pages that require login or block image scraping",
    "Real-time stock or price information",
  ],
  privacy:
    "Extracted images and your base photo stay attached to your account and are used only to generate the previews you request. You can delete them from your wardrobe and history at any time. See the privacy policy for full details.",
  pricing:
    "Extracting garment images from product links is free and does not use generation credits. Generating try-on previews uses your allowance: free daily credits on every account, monthly credits on paid plans. See the pricing page for current numbers.",
  faqs: [
    {
      question: "Which shopping sites work with the link tool?",
      answer:
        "Most online stores whose product pages show garment images publicly. Pages behind a login, with heavy bot protection or without direct product images may fail — in that case, screenshot the product and upload the image manually.",
    },
    {
      question: "Does pasting a link cost credits?",
      answer:
        "No. Extracting the garment images from a link is free. Only generating the try-on preview uses a credit.",
    },
    {
      question: "Can I try every color of a product?",
      answer:
        "Yes. When a shop lists multiple colorways, the extraction picks them up, and you can generate a preview for each one on the same photo.",
    },
    {
      question: "The link extraction failed. What now?",
      answer:
        "Take a screenshot of the product image on the shop's page and upload it directly. The try-on quality is the same; only the convenience of automatic extraction is lost.",
    },
    {
      question: "Can I combine link-extracted clothes with my own wardrobe items?",
      answer:
        "Yes. Save the extracted garment to your wardrobe, then select it together with your own pieces to generate a complete outfit.",
    },
  ],
  related: [
    {
      label: "Try on clothes online",
      href: "/try-on-clothes-online",
      description: "The general workflow, including uploading your own images.",
    },
    {
      label: "Virtual wardrobe",
      href: "/virtual-wardrobe",
      description: "Save link-extracted garments for reuse.",
    },
    {
      label: "AI clothes changer",
      href: "/ai-clothes-changer",
      description: "Swap garments on your photo one at a time.",
    },
    {
      label: "Virtual fitting room",
      href: "/virtual-fitting-room",
      description: "The complete fitting-room workflow explained.",
    },
  ],
};
