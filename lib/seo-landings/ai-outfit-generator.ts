import type { LandingPageContent } from "./types";

export const aiOutfitGenerator: LandingPageContent = {
  slug: "/ai-outfit-generator",
  title: "AI Outfit Generator from Your Photo | VFitly",
  description:
    "Generate complete outfits with AI. VFitly builds full looks — tops, bottoms, shoes and accessories — around your photo, from everyday and work outfits to wedding guest and travel looks.",
  h1: "AI Outfit Generator",
  breadcrumb: "AI Outfit Generator",
  answer:
    "VFitly's AI outfit generator creates complete outfits around your own photo instead of a single garment. Pick two to four pieces from different categories — tops, bottoms, shoes, outerwear — and VFitly generates a preview of the full look on you. Outfits are style visualizations and do not guarantee exact size or fit.",
  intro:
    "The difference from a plain clothes changer is scope: instead of asking \"how does this one shirt look?\" you ask \"how does this whole outfit come together?\". You can build outfits from garments saved in your wardrobe, from new product images, or from items you pull off a shopping link — then swap a single piece and regenerate without redoing the rest.",
  ctaLabel: "Generate your outfit",
  ctaHref: "/dashboard/wardrobe",
  howItWorks: [
    {
      title: "Save garments to your wardrobe",
      description:
        "Upload garment images or extract them from product links. Each item is stored in your VFitly wardrobe by category so it can be reused in any outfit.",
    },
    {
      title: "Pick two to four pieces",
      description:
        "Select items from different categories — for example a top, trousers and shoes. Mixing categories gives the generator enough to compose a full look.",
    },
    {
      title: "Generate the full look",
      description:
        "VFitly renders the selected pieces together on your photo, so you see the combined outfit rather than each item in isolation.",
    },
    {
      title: "Swap a piece and regenerate",
      description:
        "Not happy with the shoes? Replace that single item and regenerate. Everything else in the outfit stays the same, which makes fine-tuning fast.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Everyday outfits",
      description: "Casual combinations of tops, bottoms and shoes for weekends, errands and relaxed office days.",
    },
    {
      title: "Work and business looks",
      description: "Blazers, shirts and tailored pieces combined into outfits you can wear to meetings or the office.",
    },
    {
      title: "Date night and events",
      description: "Dressier combinations for dinners, parties and occasions where the whole look matters.",
    },
    {
      title: "Travel and packing",
      description: "Test how the pieces you plan to pack work together before you leave, using garments from your wardrobe.",
    },
  ],
  supportedInputs: [
    "Garment images you upload directly",
    "Items saved in your VFitly virtual wardrobe",
    "Garments extracted from a product page link",
    "A clear photo of yourself as the base for every outfit",
    "Optional styling notes describing the occasion or mood",
  ],
  tips: [
    "Build your wardrobe first — the more categorized items you have, the faster generating outfits becomes.",
    "Combine pieces from at least two different categories so the result reads as a complete outfit.",
    "Use one base photo across outfit versions to compare looks fairly.",
    "Describe the occasion in the styling notes, for example \"summer wedding guest\" or \"business casual\", to steer the result.",
    "Generate several variants and keep the wardrobe items that appear in your favorite looks.",
  ],
  canShow: [
    "A complete look: how top, bottom and shoes read together on your photo",
    "Color coordination between several garments at once",
    "The overall formality of an outfit — casual, smart or dressy",
    "Quick variants of the same outfit with one piece swapped",
  ],
  cannotShow: [
    "Exact sizing or how each garment fits your measurements",
    "Fabric quality, weight or comfort of the combined pieces",
    "A guarantee that every color matches the physical product exactly",
    "Accessories like bags and jewelry rendered reliably — focus on clothing categories for consistent results",
  ],
  privacy:
    "Garments and photos you add to your wardrobe stay attached to your account. Outfit generations are saved to your history so you can revisit them, and you can delete any garment, look or source image at any time. See the privacy policy for full details.",
  pricing:
    "You can start with the free daily allowance — enough to build a small wardrobe and generate several outfits. Paid plans add monthly credits for larger wardrobe work and batch generations. Image and video generation are counted separately; see the pricing page for current allowances.",
  faqs: [
    {
      question: "What is an AI outfit generator?",
      answer:
        "An AI outfit generator composes complete outfits rather than applying a single garment. It takes several clothing items plus a photo of you and renders the combined look, so you can evaluate the whole outfit instead of judging pieces one by one.",
    },
    {
      question: "Can VFitly generate outfits from clothes I already own?",
      answer:
        "Yes. Photograph or save the garments you own, add them to your VFitly wardrobe, then select two to four items from different categories and generate the look. This is the most common way to plan outfits from an existing closet.",
    },
    {
      question: "How many items can one outfit include?",
      answer:
        "Two to four wardrobe items from different categories works best — for example a top, trousers and shoes. More items than that reduce consistency; build a base look first, then swap pieces.",
    },
    {
      question: "Can I change just one piece of a generated outfit?",
      answer:
        "Yes. Select the piece you want to replace — the shoes, for example — choose a different garment and regenerate. The rest of the outfit stays unchanged.",
    },
    {
      question: "Does the outfit generator consider the occasion?",
      answer:
        "You can add styling notes describing the occasion, such as \"office\" or \"wedding guest\", and the generator uses them to steer the result. It is a style hint, not a strict rule.",
    },
    {
      question: "Is the AI outfit generator free to use?",
      answer:
        "Every account includes a free daily allowance. Larger volumes and video generation are covered by paid plans with monthly credits. See the pricing page for details.",
    },
  ],
  related: [
    {
      label: "Outfit ideas from a photo",
      href: "/outfit-ideas-from-photo",
      description: "Turn a single photo of yourself into outfit ideas worth testing.",
    },
    {
      label: "Virtual wardrobe",
      href: "/virtual-wardrobe",
      description: "Organize your garments by category and reuse them in every outfit.",
    },
    {
      label: "AI clothes changer",
      href: "/ai-clothes-changer",
      description: "Swap a single garment on your photo when you want to test one piece at a time.",
    },
    {
      label: "Virtual fitting room",
      href: "/virtual-fitting-room",
      description: "Understand what a virtual fitting room does — and what it cannot measure.",
    },
  ],
};
