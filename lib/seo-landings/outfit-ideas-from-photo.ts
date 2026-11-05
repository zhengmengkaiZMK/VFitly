import type { LandingPageContent } from "./types";

export const outfitIdeasFromPhoto: LandingPageContent = {
  slug: "/outfit-ideas-from-photo",
  title: "Outfit Ideas from Your Photo: AI Styling | VFitly",
  description:
    "Get outfit ideas from a photo of yourself. Upload your picture, add garments from your wardrobe or shopping links, and let VFitly generate styled outfit ideas you can preview on you.",
  h1: "Outfit Ideas from a Photo",
  breadcrumb: "Outfit Ideas from a Photo",
  answer:
    "Upload a photo of yourself to VFitly and generate outfit ideas on you — not on a model. Combine garments from your wardrobe, shopping links or uploads, and VFitly renders styled looks you can compare and refine. Ideas are style visualizations and do not guarantee exact fit or fabric.",
  intro:
    "Most outfit inspiration is pictures of other people. Starting from your own photo flips that: the ideas are rendered on your body, your coloring and your proportions, using clothes you either own or are actually considering — which makes every idea actionable.",
  ctaLabel: "Get outfit ideas",
  ctaHref: "/dashboard/wardrobe",
  howItWorks: [
    {
      title: "Upload your photo",
      description: "One clear full-body picture. This becomes the canvas every outfit idea is rendered on.",
    },
    {
      title: "Give the AI something to work with",
      description:
        "Add garments from your wardrobe, extract pieces from shopping links, or upload new product images.",
    },
    {
      title: "Generate outfit ideas",
      description:
        "Select pieces across categories — or let styling notes steer the occasion, like \"casual Friday\" or \"autumn wedding guest\" — and generate.",
    },
    {
      title: "Refine the winners",
      description: "Swap single pieces in the looks you like and regenerate until the outfit is right.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Occasion-based ideas",
      description: "Steer generations with notes like \"office\", \"date night\" or \"weekend\".",
    },
    {
      title: "Remixing what you own",
      description: "Rediscover combinations from clothes already in your wardrobe.",
    },
    {
      title: "One new piece, many looks",
      description: "Upload one candidate purchase and see how many outfits it joins.",
    },
    {
      title: "Seasonal refreshes",
      description: "Regenerate past looks with seasonal pieces to plan a new rotation.",
    },
  ],
  supportedInputs: [
    "A clear full-body photo of yourself",
    "Garments from your VFitly virtual wardrobe",
    "Product images and shopping links for new pieces",
    "Styling notes describing the occasion or mood",
  ],
  tips: [
    "Write specific styling notes — \"smart casual dinner, dark palette\" beats \"nice outfit\".",
    "Generate three to five variants, then refine the best one instead of regenerating everything.",
    "Include one anchor piece you love and build the look around it.",
    "Reuse your base photo across sessions so ideas stay comparable over time.",
    "Save successful looks; they become references for future generations.",
  ],
  canShow: [
    "Complete styled looks rendered on your own body and coloring",
    "Multiple outfit ideas from the same set of garments",
    "How one new piece changes the outfits it can join",
    "A shortlist of looks worth keeping and repeating",
  ],
  cannotShow: [
    "Exact fit or measurements for any garment in the look",
    "Fabric quality, texture or comfort",
    "A stylist's judgment on dress codes — the notes steer style, not etiquette",
    "Guaranteed color accuracy for every physical garment",
  ],
  privacy:
    "Your photo, garments and generated looks stay attached to your private account and can be deleted at any time from your wardrobe and history. Nothing is published. See the privacy policy for the full handling details.",
  pricing:
    "Generating outfit ideas uses your allowance: free daily credits on every account, monthly credits on paid plans. Extracting garments from shopping links is free. See the pricing page for current allowances.",
  faqs: [
    {
      question: "How do I get outfit ideas from a photo?",
      answer:
        "Upload a clear photo of yourself to VFitly, add garments from your wardrobe or shopping links, optionally describe the occasion, and generate. VFitly renders complete outfit ideas on your photo.",
    },
    {
      question: "Are the ideas based on clothes I own?",
      answer:
        "They can be. The best results come from garments in your wardrobe, mixed with a new piece you are considering. You control exactly which garments the AI works with.",
    },
    {
      question: "Can I ask for outfits for a specific occasion?",
      answer:
        "Yes — add styling notes like \"business casual\" or \"beach wedding guest\". The notes steer the generated styling direction.",
    },
    {
      question: "How many outfit ideas can I generate?",
      answer:
        "Each generation produces one look and uses one credit from your allowance. Free accounts get daily credits; paid plans include monthly balances.",
    },
    {
      question: "Can I save the ideas I like?",
      answer:
        "Yes. Generated looks are kept in your history, and you can save garments and looks to your wardrobe to revisit later.",
    },
  ],
  related: [
    {
      label: "AI outfit generator",
      href: "/ai-outfit-generator",
      description: "The full outfit generation workflow explained.",
    },
    {
      label: "Virtual wardrobe",
      href: "/virtual-wardrobe",
      description: "The garment library that feeds your outfit ideas.",
    },
    {
      label: "AI clothes changer",
      href: "/ai-clothes-changer",
      description: "Test one garment at a time on your photo.",
    },
    {
      label: "Try on clothes online",
      href: "/try-on-clothes-online",
      description: "From outfit idea to ordered garment.",
    },
  ],
};
