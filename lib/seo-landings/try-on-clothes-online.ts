import type { LandingPageContent } from "./types";

export const tryOnClothesOnline: LandingPageContent = {
  slug: "/try-on-clothes-online",
  title: "Try On Clothes Online Free: AI Preview on Your Photo | VFitly",
  description:
    "Try on clothes online with AI. Upload a photo of yourself, add any garment image or shopping link, and preview how tops, dresses, jackets and shoes look on you before you buy.",
  h1: "Try On Clothes Online",
  breadcrumb: "Try On Clothes Online",
  answer:
    "You can try on clothes online with VFitly by uploading a photo of yourself and the garment you are considering — a product image, a shopping link or an item from your wardrobe. VFitly generates a visual preview of the clothing on your photo. The result is a style preview, not a guarantee of size, fit or fabric.",
  intro:
    "Online shopping removes the fitting room. VFitly puts a version of it back: you see the garment on your own body shape, compare several options side by side, and only then decide what to order. Everything runs in the browser — there is no app to install and no measuring tape required.",
  ctaLabel: "Start trying on clothes",
  ctaHref: "/dashboard/try-on",
  howItWorks: [
    {
      title: "Upload your photo",
      description:
        "One clear full-body picture taken in even light is enough. The better the photo, the better every subsequent try-on looks.",
    },
    {
      title: "Choose how to add the clothes",
      description:
        "Upload a garment image directly, paste a shopping link and let VFitly extract the product photos, or pick something you saved in your wardrobe earlier.",
    },
    {
      title: "Generate the preview",
      description:
        "VFitly combines your photo and the garment into a try-on image. Extracting garments from a link costs nothing; generating the preview uses a credit.",
    },
    {
      title: "Compare, keep or discard",
      description:
        "Run several garments through the same photo, compare the results side by side, and keep the looks you like in your history.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Clothes from any store",
      description: "Paste a product link from an online shop and try its garments on your photo before ordering.",
    },
    {
      title: "Clothes you already own",
      description: "Save your own garments to your wardrobe and use them to plan new combinations.",
    },
    {
      title: "Different colorways",
      description: "When a product page shows several colors, try each one and pick the shade that suits you.",
    },
    {
      title: "Full outfits",
      description: "Combine a top, bottoms and shoes into one look with the outfit generator.",
    },
  ],
  supportedInputs: [
    "A clear photo of yourself (full body, even light, plain background)",
    "Product images uploaded from your device",
    "Online shopping links — garment images are extracted automatically",
    "Garments previously saved in your VFitly wardrobe",
    "Optional notes to steer styling",
  ],
  tips: [
    "Retake your base photo once, properly: even light, plain wall, relaxed pose. Every try-on you ever do reuses it.",
    "Compare garments on the same photo — switching photos mid-comparison makes the results hard to judge.",
    "Use the shopping-link tool for colorways: try every color of one product in a single session.",
    "Treat results as a style signal. If two garments look similar in preview, check the size charts to break the tie.",
    "Save promising garments to your wardrobe so you can re-test them against future purchases.",
  ],
  canShow: [
    "How a garment's silhouette works with your body shape",
    "Whether a color flatters you compared with alternatives",
    "A side-by-side comparison of several garments on identical photos",
    "Complete outfits assembled from multiple pieces",
  ],
  cannotShow: [
    "Guaranteed size or fit — always cross-check the retailer's size chart",
    "Exact fabric texture, weight or transparency",
    "Perfect reproduction of fine patterns, lace or logos",
    "Comfort or movement; the try-on video adds motion cues but is still a visualization",
  ],
  privacy:
    "Photos and garments you upload remain attached to your account and are used only to generate the previews you request. You can delete any image, garment or result from your wardrobe and history at any time. Full details are in the privacy policy.",
  pricing:
    "Trying on clothes online with VFitly starts free: every account receives a daily allowance of generations, and extracting garments from product links is free. Paid plans add monthly credits for heavy use. Image and video generations are counted separately.",
  faqs: [
    {
      question: "Can I really try on clothes online without visiting a store?",
      answer:
        "Yes — in the visual sense. You upload your photo and the garments you are considering, and VFitly renders each garment on your photo. It replaces the \"how would this look on me?\" part of shopping, though not the physical fitting.",
    },
    {
      question: "Is it free to try on clothes online with VFitly?",
      answer:
        "There is a free daily allowance on every account, and extracting garments from shopping links costs nothing. Paid plans add monthly credits for larger batches. See the pricing page for the current numbers.",
    },
    {
      question: "Do I need to install an app?",
      answer:
        "No. VFitly runs in the browser on desktop and mobile. Sign in, upload your photo, and start generating previews.",
    },
    {
      question: "Can I try on clothes from any online shop?",
      answer:
        "The shopping-link tool extracts publicly visible garment images from product pages. Most shops work; pages that block image scraping or require interaction may need you to upload the product image manually instead.",
    },
    {
      question: "How accurate is the preview compared with real life?",
      answer:
        "Silhouettes and color impressions are usually reliable. Fine patterns, fabric behavior and exact fit are approximations. Use the preview to shortlist, and the retailer's product details to confirm.",
    },
    {
      question: "What kind of photo of myself should I use?",
      answer:
        "A full-body photo in even light with a simple background and a relaxed standing pose. Avoid photos where your arms cover the area the garment will occupy, and avoid harsh shadows that blur your outline.",
    },
  ],
  related: [
    {
      label: "AI clothes changer",
      href: "/ai-clothes-changer",
      description: "Swap outfits on your photo one garment at a time.",
    },
    {
      label: "Try on clothes from a link",
      href: "/try-on-clothes-from-link",
      description: "Paste a shopping URL and try the product on your photo.",
    },
    {
      label: "Virtual fitting room",
      href: "/virtual-fitting-room",
      description: "How the fitting-room workflow compares and what it cannot measure.",
    },
    {
      label: "Try on dresses online",
      href: "/try-on-dresses-online",
      description: "Focus on dresses: casual, evening and occasion wear.",
    },
  ],
};
