import type { LandingPageContent } from "./types";

export const virtualWardrobe: LandingPageContent = {
  slug: "/virtual-wardrobe",
  title: "Virtual Wardrobe: Organize Clothes & Plan Outfits with AI | VFitly",
  description:
    "VFitly's virtual wardrobe stores the clothes you preview — uploads, shopping-link extracts and your own garments — organized by category, ready to reuse in AI try-ons and outfit planning.",
  h1: "Virtual Wardrobe",
  breadcrumb: "Virtual Wardrobe",
  answer:
    "VFitly's virtual wardrobe is where every garment you try on lives: uploads, clothes extracted from shopping links and your own pieces, organized by category. Select two to four items from different categories and generate a complete outfit on your photo. The wardrobe is private to your account.",
  intro:
    "A one-off try-on answers one question. A wardrobe compounds: every garment you save makes the next comparison faster and every outfit generation smarter, because the clothes you actually care about are one click away — no re-uploading, no re-pasting links.",
  ctaLabel: "Open your wardrobe",
  ctaHref: "/dashboard/wardrobe",
  howItWorks: [
    {
      title: "Add garments",
      description:
        "Upload clothing images, extract them from shopping links, or photograph pieces you already own. Each item lands in your wardrobe.",
    },
    {
      title: "Organize by category",
      description:
        "Tops, bottoms, dresses, shoes and outerwear are kept apart so outfit building picks sensible combinations.",
    },
    {
      title: "Generate looks from your wardrobe",
      description:
        "Select two to four items from different categories and generate the outfit on your photo, with the option to swap any single piece and regenerate.",
    },
    {
      title: "Keep or clean up",
      description: "Save the looks you like to your history, and delete garments you no longer consider — your wardrobe stays yours to manage.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Closet digitization",
      description: "Photograph the clothes you own and build a digital version of your closet.",
    },
    {
      title: "Wishlist tracking",
      description: "Extract garments from shopping links and keep candidates in one place before buying.",
    },
    {
      title: "Capsule planning",
      description: "Check how a small set of pieces combines into many outfits before buying more.",
    },
    {
      title: "Travel packing",
      description: "Preview combinations from the pieces you plan to pack and cut what does not pair well.",
    },
  ],
  supportedInputs: [
    "Garment images uploaded from your device",
    "Clothes extracted automatically from product links",
    "Photos of garments you already own",
    "Generated looks saved from previous try-on sessions",
  ],
  tips: [
    "Add categories as you go — outfits generate best when pieces come from different categories.",
    "Photograph owned garments flat on a plain surface; consistency in your own photos improves results.",
    "Save the wardrobe items that appear in your favorite generated looks — they are your proven pieces.",
    "Prune the wardrobe regularly; a tight, relevant wardrobe makes outfit generation faster and better.",
    "Reuse the same base photo across seasons so old and new garments stay comparable.",
  ],
  canShow: [
    "How your own clothes combine into new outfits",
    "Whether a candidate purchase pairs with what you already own",
    "A growing, reusable library of garments and proven looks",
    "Outfits assembled across categories without re-uploading anything",
  ],
  cannotShow: [
    "Real inventory or sizing data from shops — the wardrobe holds images, not stock",
    "Physical storage or care information for your clothes",
    "A guarantee that owned-garment photos render as sharply as shop product photos",
    "Sharing or social features — the wardrobe is private to your account",
  ],
  privacy:
    "Your wardrobe is private. Garments, photos and saved looks stay attached to your account, are used only to generate previews you request, and can be deleted at any time, individually or in bulk. The privacy policy has full details.",
  pricing:
    "Building a wardrobe is free — adding garments and extracting them from links costs nothing. Generating outfits uses your allowance: free daily credits on every account, monthly credits on paid plans. See the pricing page for details.",
  faqs: [
    {
      question: "What is a virtual wardrobe?",
      answer:
        "A digital collection of clothing images — your own pieces, uploads and items extracted from shopping links — organized so you can reuse them in try-ons and outfit generations instead of uploading the same images repeatedly.",
    },
    {
      question: "Can I add the clothes I already own?",
      answer:
        "Yes. Photograph your garments flat on a plain background and upload them. They become outfit-planning material just like shop products.",
    },
    {
      question: "How many items can my wardrobe hold?",
      answer:
        "There is no hard cap tied to your plan; storage follows fair use. You can delete garments at any time to keep the wardrobe focused.",
    },
    {
      question: "Can I generate an outfit from wardrobe items only?",
      answer:
        "Yes — that is the main workflow. Select two to four items from different categories and generate the complete look on your photo.",
    },
    {
      question: "Is my wardrobe visible to anyone else?",
      answer:
        "No. The wardrobe is private to your account, and you can delete any item or saved look at any time.",
    },
  ],
  related: [
    {
      label: "AI outfit generator",
      href: "/ai-outfit-generator",
      description: "Turn wardrobe items into complete generated outfits.",
    },
    {
      label: "Outfit ideas from a photo",
      href: "/outfit-ideas-from-photo",
      description: "Start from your photo and work backwards to outfit ideas.",
    },
    {
      label: "Try on clothes from a link",
      href: "/try-on-clothes-from-link",
      description: "Extract garments from shopping links straight into your wardrobe.",
    },
    {
      label: "Virtual fitting room",
      href: "/virtual-fitting-room",
      description: "The full fitting-room workflow around your wardrobe.",
    },
  ],
};
