import type { LandingPageContent } from "./types";

export const virtualFittingRoom: LandingPageContent = {
  slug: "/virtual-fitting-room",
  title: "Virtual Fitting Room: Try Clothes On Your Photo | VFitly",
  description:
    "VFitly is a browser-based virtual fitting room. Upload your photo, try garments from images or shopping links, and compare looks side by side — no measuring tape or app required.",
  h1: "Virtual Fitting Room",
  breadcrumb: "Virtual Fitting Room",
  answer:
    "A virtual fitting room lets you see clothes on your own body before buying. VFitly does this in the browser: upload a photo, add garments from images, shopping links or your wardrobe, and generate try-on previews you can compare side by side. It visualizes style and silhouette — it does not take your measurements.",
  intro:
    "Physical fitting rooms answer two questions: \"how does it look on me?\" and \"does it fit?\". VFitly answers the first reliably and leaves the second to the retailer's size chart. That split matters: it speeds up choosing, while keeping sizing decisions grounded in real numbers.",
  ctaLabel: "Enter the fitting room",
  ctaHref: "/dashboard/try-on",
  howItWorks: [
    {
      title: "Create your base",
      description:
        "Upload one clear full-body photo. This photo becomes your fitting-room baseline and is reused for every garment you try.",
    },
    {
      title: "Bring in the garments",
      description:
        "Upload product images, paste shopping links to extract the photos automatically, or pull items you saved in your virtual wardrobe.",
    },
    {
      title: "Try on and compare",
      description:
        "Generate a preview for each garment and view them side by side in your history — the equivalent of lining up outfits in a fitting room.",
    },
    {
      title: "Keep what works",
      description: "Save garments and looks to your wardrobe, or turn a look into a short try-on video to see it in motion.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Single garments",
      description: "One top, dress, jacket or pair of shoes applied to your photo.",
    },
    {
      title: "Complete outfits",
      description: "Two to four pieces from different categories rendered together as one look.",
    },
    {
      title: "Side-by-side comparisons",
      description: "Several candidates against the same photo, judged fairly.",
    },
    {
      title: "Try-on videos",
      description: "Turn a preview into a short video to see how the look reads in motion.",
    },
  ],
  supportedInputs: [
    "A clear full-body photo of yourself",
    "Garment images uploaded from your device",
    "Shopping links from online stores",
    "Garments saved in your VFitly virtual wardrobe",
    "Optional styling notes",
  ],
  tips: [
    "Invest once in a good base photo — even light, plain background, relaxed pose. It pays off in every future session.",
    "Change one variable at a time when comparing: one garment, same photo, same pose.",
    "Use the video feature when you are torn between two finalists; motion often breaks the tie.",
    "Treat the fitting room as a shortlist builder. Confirm final sizing against the retailer's chart.",
    "Keep your wardrobe curated: the items you save today become tomorrow's outfit planning material.",
  ],
  canShow: [
    "Silhouette and color of garments on your body shape",
    "Consistent comparisons across many garments on one photo",
    "Complete outfits, not just single pieces",
    "A motion preview via generated try-on video",
  ],
  cannotShow: [
    "Body measurements — VFitly does not scan or measure you",
    "Exact graded fit or tailoring needs",
    "True fabric texture, weight and comfort",
    "A guarantee of pattern fidelity for lace, beading and prints",
  ],
  privacy:
    "Your base photo and all garments stay attached to your private account. Nothing is published. You can delete any photo, garment or generated result from your wardrobe and history at any time. The privacy policy has the complete details.",
  pricing:
    "The virtual fitting room works on the free daily allowance, and extracting garments from shopping links is free. Paid plans add monthly credits for batch try-ons and videos. Image and video generations are counted separately — see the pricing page.",
  faqs: [
    {
      question: "Does a virtual fitting room measure my body?",
      answer:
        "VFitly does not take measurements. It renders garments on your photo so you can judge style and silhouette. For sizing, always use the retailer's size chart with your real measurements.",
    },
    {
      question: "How is this different from an AR mirror or scanning app?",
      answer:
        "Scanning apps build a 3D model of your body; VFitly works from a single photo and generates 2D try-on images and videos. That makes it faster and lighter — no hardware, no scan session, works on any phone.",
    },
    {
      question: "Can I use the virtual fitting room on my phone?",
      answer:
        "Yes. VFitly runs in the mobile browser. Take or upload your photo, add garments, and generate previews without installing anything.",
    },
    {
      question: "Can I save what I tried on?",
      answer:
        "Yes. Garments and generated looks can be saved to your virtual wardrobe and revisited or reused in later sessions.",
    },
    {
      question: "Is the virtual fitting room free?",
      answer:
        "There is a free daily allowance on every account. Paid plans add monthly credits for heavier use.",
    },
  ],
  related: [
    {
      label: "Try on clothes online",
      href: "/try-on-clothes-online",
      description: "The step-by-step workflow, from photo to comparison.",
    },
    {
      label: "Virtual wardrobe",
      href: "/virtual-wardrobe",
      description: "The wardrobe that powers repeat try-ons.",
    },
    {
      label: "AI clothes changer",
      href: "/ai-clothes-changer",
      description: "Swap single garments on your photo.",
    },
    {
      label: "AI outfit generator",
      href: "/ai-outfit-generator",
      description: "Compose complete outfits in the fitting room.",
    },
  ],
};
