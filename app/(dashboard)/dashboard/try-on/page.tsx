import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { TryOnContent } from "@/components/try-on/try-on-content";
import { absoluteUrl } from "@/lib/seo";

const tryOnTitle = "AI Clothes Changer: Change Clothes in a Photo | VFitly";
const tryOnDescription =
  "Use VFitly's AI clothes changer to swap the clothes in your photo. Upload a person image and a garment, or pick wardrobe pieces, and generate a new outfit.";

export const metadata: Metadata = {
  title: { absolute: tryOnTitle },
  description: tryOnDescription,
  keywords: [
    "AI clothes changer",
    "clothes changer",
    "AI clothes changer online",
    "change clothes in a photo",
    "AI outfit changer",
    "virtual fitting room",
    "AI clothes try on",
    "VFitly",
  ],
  alternates: {
    canonical: "/dashboard/try-on",
  },
  openGraph: {
    title: tryOnTitle,
    description: tryOnDescription,
    url: absoluteUrl("/dashboard/try-on"),
    images: [{ url: absoluteUrl("/banner.png"), width: 3272, height: 1898, alt: "VFitly AI clothes changer for changing clothes in a photo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: tryOnTitle,
    description: tryOnDescription,
    images: [absoluteUrl("/banner.png")],
  },
};

const tryOnJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VFitly AI Clothes Changer",
  url: absoluteUrl("/dashboard/try-on"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description: tryOnDescription,
};

export default function DashboardTryOnPage() {
  return (
    <>
      <JsonLd data={tryOnJsonLd} />
      <TryOnContent />
      <article aria-label="AI clothes changer guide" className="prose prose-neutral mx-auto mb-16 max-w-4xl px-4 dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-blue-600 dark:prose-a:text-blue-400">
        <h2>How an AI Clothes Changer Works</h2>
        <p>
          An AI clothes changer replaces what someone is wearing in a photo with a different garment while keeping the person, their pose and the background recognisable. VFitly keeps that process on this page: you bring a photo and a piece of clothing, and the tool generates a new image of the same person in the new outfit.
        </p>
        <p>
          That is different from browsing a catalogue. Product photos show a garment on a model you have never met, under studio lighting you will never stand in. Changing the clothes in your own photo gives you a reference you can actually read: does this color work with my skin tone, does this length suit the way I dress, does this silhouette look like the idea I had in mind.
        </p>
        <h3>Upload a Person Photo</h3>
        <p>
          Choose a photo where the person is easy to separate from the background. Even lighting, a straightforward pose and a visible body outline give the model more to work with. For an outfit that includes trousers or a skirt, a full-body image is usually more useful than a tight portrait. Avoid heavy filters and anything covering the area where the new garment should sit.
        </p>
        <p>
          Use a photo of yourself, or one you have permission to use. Your saved full-body photo loads automatically when available, and you can replace it for a single session without changing what is stored. Before uploading, check the supported file types and size limit shown beside the upload control. If the first result looks inconsistent, try a clearer photo before changing several settings at once.
        </p>
        <h3>Add the Garment You Want to Wear</h3>
        <p>
          Pick a clothing image that shows the item&apos;s shape and details clearly. A front-facing product shot is a good starting point, especially when you want to compare necklines, sleeve lengths or the overall cut. Images with several overlapping garments, or large areas hidden behind accessories, make your intended choice harder to read.
        </p>
        <p>
          If you are deciding between similar pieces, keep the person photo unchanged and swap only the clothing image. That keeps the comparison fair, even though each generated result will still vary slightly. Where possible, use an image with a simple background and minimal promotional text.
        </p>
        <h3>Set the Options and Review the Result</h3>
        <p>
          Choose an aspect ratio for the image you want to create, then use the optional requirements field for a specific styling direction. Keep requests concrete: describe the garment, the combination or a visual preference. Instructions that contradict the uploaded clothing make it harder to judge whether the result still represents your original choice.
        </p>
        <p>
          After generating, look at the whole image before the small details. Check the balance of the outfit, how visible layers sit against each other, and whether the clothing still resembles what you uploaded. If something is off, change one input at a time. That makes it easier to understand which adjustment actually improved the result.
        </p>
        <h2>Change Clothes Using Your Saved Wardrobe</h2>
        <p>
          A <Link href="/dashboard/wardrobe">saved wardrobe</Link> turns the AI clothes changer into a repeatable tool rather than a one-off experiment. Instead of uploading the same files every session, pick from the pieces you already stored. Start with an anchor item — a jacket, a pair of trousers, a dress — then build around its color and shape. In the outfit tool above you can select two to four items from different categories, with one item per category.
        </p>
        <p>
          Keep the comparisons small. Ten thoughtful previews teach you more than fifty you scroll past. Save a result you like to Generated Looks so it stays alongside the garment images in your wardrobe, and revisit it later without running the generation again.
        </p>
        <h2>Getting Better Results from an AI Clothes Changer</h2>
        <p>
          Consistency is what makes a comparison readable. When you review two garments, use the same person photo, keep the pose and lighting unchanged, and view the previews side by side. If you change both the person and the clothing at once, you lose the ability to tell which of them caused the difference.
        </p>
        <p>
          Ask concrete questions: Does this jacket create the silhouette I want? Do these colors work together? Would a shorter top balance the outfit? Those questions suit a generated preview far better than asking whether a specific size will fit perfectly.
        </p>
        <p>
          Pay attention to fine patterns, lettering, logos and layered edges. An AI clothes changer can reinterpret those details rather than preserve them exactly. Before you buy, go back to the original product images and written specifications to confirm pockets, closures, fabric composition and decorative elements. Download the previews worth keeping, so you are comparing from images rather than from memory.
        </p>
        <h2>What an AI Clothes Changer Can and Cannot Do</h2>
        <p>
          It is built for visual exploration. It shows how an outfit reads, lets you compare styling directions, and communicates an idea more clearly than a pile of separate product photos. That is useful when you want a first look at a combination before deciding what to investigate further. Many people look for this kind of tool under the name virtual fitting room, and the underlying idea is the same: previewing clothes without a physical changing room.
        </p>
        <p>
          It is not a measurement. A changed photo cannot tell you how tight a waistband will feel, how much a fabric stretches, or how a garment behaves after several hours of wear. Real clothing responds to movement, material weight and construction, and none of that is captured in a still image. It also cannot confirm how a garment will fit across different body shapes.
        </p>
        <p>
          Before buying, check the retailer&apos;s size chart, garment measurements, fabric information and return policy. If accurate sizing is your main concern, compare those measurements with clothes you already own or use a physical fitting where possible. Treat the preview as one input into a decision, not the decision itself. If the item is still on a shopping page rather than in a saved file, the <Link href="/dashboard/product-try-on">product link tool</Link> extracts those garment images for you.
        </p>
        <h2>From a Changed Photo to a Video</h2>
        <p>
          A still image is the right place to start, because you can inspect it without distraction. Once you have a result you like, Generate Runway Video turns it into a moving presentation of the same look. Check the available options and credit requirements first, since image and video generation are counted separately.
        </p>
        <p>
          Review the still before making a video. If a sleeve, hand, pattern or garment edge already looks wrong, adding motion is not a dependable way to fix it. A cleaner starting image gives you a better basis for judging the next result, and completed work stays in your <Link href="/dashboard/history">generation history</Link>.
        </p>
        <p>
          Treat the video as generated styling content, not as evidence of how the real garment moves or drapes. If you share it with others, make clear that it was generated rather than filmed, whenever it could otherwise be mistaken for footage of an actual fitting.
        </p>
        <h2>Frequently Asked Questions</h2>
        <h3>What does an AI clothes changer do?</h3>
        <p>
          An AI clothes changer swaps the clothing in a photo for a different garment while keeping the person, pose and background recognisable. VFitly generates a new image from a person photo and a clothing image, so you can see how a piece looks on a real figure before buying it.
        </p>
        <h3>Can I change the clothes in my own photo?</h3>
        <p>
          Yes. Upload a clear photo of yourself as the person image, then add the garment you want to try. A full-body photo taken in even lighting usually gives the most readable result. Generation may require signing in and enough credits for the action you choose.
        </p>
        <h3>Do I need a saved wardrobe to start?</h3>
        <p>
          No. You can change clothes with a single uploaded garment image. Saved wardrobe items help when you want to reuse the same pieces across sessions, or build a full outfit from two to four items in different categories.
        </p>
        <h3>Will it show me which size to buy?</h3>
        <p>
          No. A generated image is a visual styling aid, not a sizing recommendation. Use the seller&apos;s measurements and size guide to assess fit. Comfort, stretch and precise garment dimensions cannot be confirmed from a changed photo.
        </p>
        <h3>Why does a detail look different from the original garment?</h3>
        <p>
          AI image generation can alter small features, especially text, intricate prints, accessories or partly hidden areas. Try a clearer clothing image and simpler inputs. Always refer back to the original product information when an exact detail matters.
        </p>
        <h3>Where can I read about credits and photo handling?</h3>
        <p>
          Visit the <Link href="/pricing">pricing page</Link> for plan and credit information, the <Link href="/docs">documentation</Link> for workflow guidance, and the <Link href="/privacy">privacy policy</Link> for how images are handled. If an upload or result does not work as expected, <Link href="/contact">contact support</Link> with a description of the problem.
        </p>
      </article>
    </>
  );
}
