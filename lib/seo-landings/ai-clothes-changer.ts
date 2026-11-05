import type { LandingPageContent } from "./types";

export const aiClothesChanger: LandingPageContent = {
  slug: "/ai-clothes-changer",
  title: "AI Clothes Changer: Change Outfits in Your Photo | VFitly",
  description:
    "VFitly is an AI clothes changer that swaps outfits on your own photo. Upload a picture of yourself and a garment image to preview tops, dresses, jackets and shoes before you buy.",
  h1: "AI Clothes Changer",
  breadcrumb: "AI Clothes Changer",
  answer:
    "VFitly is an AI clothes changer that lets you change outfits in your own photo. Upload a clear photo of yourself and an image of a garment, and VFitly generates a visual preview of how that clothing looks on you. The preview shows style and silhouette; it does not guarantee exact size, fit, color, or fabric appearance.",
  intro:
    "Instead of guessing how a top, dress, jacket or pair of shoes will look, you apply the garment to a photo of yourself and see the combined result in seconds. You can repeat the process across several garments with the same photo, which makes side-by-side comparison straightforward before you buy or plan an outfit.",
  ctaLabel: "Change clothes on your photo",
  ctaHref: "/dashboard/try-on",
  howItWorks: [
    {
      title: "Upload a photo of yourself",
      description:
        "Use a full-body photo taken in even light with a simple background. The clearer your outline is, the more convincing the try-on result will be.",
    },
    {
      title: "Add the garment you want to try",
      description:
        "Upload a product image or flat-lay of the clothing. You can also paste a shopping link and let VFitly extract the garment images from that page.",
    },
    {
      title: "Generate the AI preview",
      description:
        "Choose an aspect ratio and optional styling notes, then generate. VFitly combines your photo and the garment into a try-on preview you can compare and keep.",
    },
    {
      title: "Compare and repeat",
      description:
        "Reuse the same source photo across different garments so the differences you notice come from the clothes, not the photography. Save garments to your wardrobe to try again later.",
    },
  ],
  whatYouCanTry: [
    {
      title: "Tops and shirts",
      description: "T-shirts, blouses, sweaters and shirts of different cuts and colors, applied to the same photo for comparison.",
    },
    {
      title: "Dresses and skirts",
      description: "Casual dresses, evening dresses and skirts, including longer garments where silhouette matters most.",
    },
    {
      title: "Jackets and outerwear",
      description: "Coats, blazers and jackets layered over your look to check how outerwear reads with your outfit.",
    },
    {
      title: "Shoes",
      description: "Try pairs of shoes on your photo and preview how they match the rest of the outfit.",
    },
  ],
  supportedInputs: [
    "A clear photo of yourself (full body works best)",
    "A garment image: product photo, flat-lay or screenshot",
    "A product page link — VFitly extracts the garment images for you",
    "Garments saved earlier in your VFitly wardrobe",
    "Styling notes you add to steer the result",
  ],
  tips: [
    "Shoot your photo in even, natural light against a plain background so your outline is easy to separate.",
    "Stand in a relaxed, upright pose and keep your arms away from the area where the garment will appear.",
    "Use the same photo for every garment you compare so the only variable is the clothing.",
    "For busy patterns, lace or logos, expect the AI to reinterpret fine detail — check the product page for the true pattern.",
    "If a result looks off, regenerate with a cleaner garment image before changing anything else.",
  ],
  canShow: [
    "The overall silhouette of the garment on your body shape",
    "How the color of the clothing reads next to your skin tone",
    "A visual comparison of several garments on the identical photo",
    "How a full outfit comes together when you combine pieces",
  ],
  cannotShow: [
    "Exact measurements, size or fit — it is a style visualization, not a fitting",
    "True fabric weight, stretch, texture or comfort",
    "A guarantee that printed patterns, beading or logos match the real product",
    "How the garment behaves in motion; for that, use the try-on video feature as an additional visual aid",
  ],
  privacy:
    "Your uploaded photos are used to generate the try-on results you request and stay attached to your own account. You can delete any garment, saved look or source image from your wardrobe at any time. See the privacy policy for the complete details on how images and account data are handled.",
  pricing:
    "VFitly includes a free daily allowance, so you can try the clothes changer before paying. Paid plans add a monthly credit balance for larger batches, and image and video generation are counted separately. Extracting garment images from a product link does not use generation credits.",
  faqs: [
    {
      question: "How does an AI clothes changer work?",
      answer:
        "You provide a photo of a person and an image of a garment. The AI model separates the person from the background, understands the garment's shape and color, and renders the clothing onto the person to produce a try-on preview. VFitly runs this in the browser, so no app installation is needed.",
    },
    {
      question: "Is the result a realistic preview of how clothes fit me?",
      answer:
        "It is a realistic style visualization, not a fitting. The preview shows the silhouette and colors on your photo, but it cannot confirm measurements, fabric behavior or comfort. Use it to narrow down choices, then rely on the retailer's size chart before buying.",
    },
    {
      question: "Can I change clothes using a shopping link instead of an image?",
      answer:
        "Yes. Paste a product URL into the product link tool and VFitly extracts the garment images published on that page, including different colorways. Review the extracted images, delete the ones you do not need, then generate a preview for each garment.",
    },
    {
      question: "Does the AI clothes changer work with shoes and accessories?",
      answer:
        "VFitly supports shoes as a garment category. Results depend on the quality of both photos. Small accessories such as jewelry are not the focus of the tool and may not render reliably.",
    },
    {
      question: "How long does one generation take?",
      answer:
        "Most previews generate in well under a minute. Longer batches and video generation take more time, and generation happens server-side, so you can close the tab and check results later in your history.",
    },
    {
      question: "Is VFitly's clothes changer free?",
      answer:
        "There is a free daily allowance on every account. Paid plans add monthly credits for larger volumes. Check the pricing page for the current allowance before running a long comparison.",
    },
    {
      question: "Are my photos stored or shared?",
      answer:
        "Photos stay attached to your account and are used to generate the results you ask for. You can delete source images and results from your wardrobe at any time. VFitly does not publish your images anywhere.",
    },
  ],
  related: [
    {
      label: "Try on clothes online",
      href: "/try-on-clothes-online",
      description: "The complete workflow for trying clothes on your photo, from upload to comparison.",
    },
    {
      label: "AI outfit generator",
      href: "/ai-outfit-generator",
      description: "Generate complete outfits — tops, bottoms, shoes and accessories — from your photo.",
    },
    {
      label: "Virtual fitting room",
      href: "/virtual-fitting-room",
      description: "How VFitly's fitting-room workflow works and what it can and cannot measure.",
    },
    {
      label: "Try on wedding dresses",
      href: "/try-on-wedding-dresses",
      description: "Preview bridal gowns on your own photo before booking salon appointments.",
    },
  ],
};
