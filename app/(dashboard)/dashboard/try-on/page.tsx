import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { TryOnContent } from "@/components/try-on/try-on-content";
import { absoluteUrl } from "@/lib/seo";

const tryOnTitle = "Virtual Fitting Room – AI Clothes Try-On | VFitly";
const tryOnDescription =
  "Use VFitly's virtual fitting room for AI virtual try-on. Upload a photo, preview clothes, build outfits from a wardrobe, and create try-on images or videos.";

export const metadata: Metadata = {
  title: { absolute: tryOnTitle },
  description: tryOnDescription,
  keywords: [
    "AI virtual try-on",
    "virtual fitting room",
    "AI virtual fitting room",
    "online virtual fitting room",
    "virtual fitting room for clothes",
    "AI clothes try on",
    "virtual outfit try on",
    "VFitly",
  ],
  alternates: {
    canonical: "/dashboard/try-on",
  },
  openGraph: {
    title: tryOnTitle,
    description: tryOnDescription,
    url: absoluteUrl("/dashboard/try-on"),
    images: [{ url: absoluteUrl("/banner.png"), width: 3272, height: 1898, alt: "VFitly virtual fitting room for AI clothes try-on" }],
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
  name: "VFitly AI Virtual Fitting Room",
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
      <article aria-label="Virtual fitting room guide" className="prose prose-neutral mx-auto mb-16 max-w-4xl px-4 dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-blue-600 dark:prose-a:text-blue-400">
        <h2>How to Use the Virtual Fitting Room</h2>
        <p>
          A virtual fitting room helps you explore how clothing might look on a person before committing to an outfit idea. Instead of trying to imagine a garment from a product photo alone, you can bring a person image and a clothing image together in one visual preview. VFitly keeps that process on this page, so you can move from uploading your pictures to reviewing a generated result without switching between separate tools.
        </p>
        <p>
          Start with one garment and a clear photo. Once you understand how the preview responds to your inputs, experiment with other pieces, saved wardrobe items, or a different styling direction. Treat each result as a starting point for comparison rather than a final verdict about what you should wear.
        </p>
        <h3>Start with a Clear Person Photo</h3>
        <p>
          Choose a photo where the person is easy to distinguish from the background. Even lighting, a straightforward pose, and a visible body outline give the system more useful visual information. For an outfit that includes trousers or a skirt, a full-body image is usually more helpful than a tightly cropped portrait. Avoid heavy filters or objects that cover the area where the new garment should appear.
        </p>
        <p>
          Use a photo of yourself or someone who has agreed to its use. Before uploading, check the supported file types and size limit shown beside the upload control. If the first result looks inconsistent, try a clearer source photo before changing several other settings at once. When available, your saved full-body photo is loaded automatically; click its preview if you want to replace it for this session.
        </p>
        <h3>Choose a Useful Clothing Image</h3>
        <p>
          Select a clothing image that makes the garment&apos;s shape and main details easy to see. A clear front view is a useful starting point, especially when you want to compare necklines, sleeve lengths, or the overall silhouette. Images with multiple overlapping garments or large areas hidden behind accessories can make your intended choice less clear.
        </p>
        <p>
          Where possible, use an image with a simple background and minimal promotional text. If you are choosing between similar items, keep the person photo unchanged and replace only the clothing image. This gives you a more consistent basis for comparing the generated previews, even though individual outputs may still vary.
        </p>
        <h3>Set Your Preferences and Review the Result</h3>
        <p>
          Choose an aspect ratio for the image you want to create. Use the optional requirements field to explain the styling direction you want to explore. Keep requests concrete: focus on the garment, the outfit combination, or a specific visual preference. Avoid instructions that contradict the uploaded clothing, since they can make it harder to judge whether the preview represents your original choice.
        </p>
        <p>
          After generation, inspect the whole image before focusing on smaller details. Look at the outfit&apos;s balance, how visible layers relate to each other, and whether the clothing still resembles your source image. If something is wrong, change one input at a time. That makes it easier to understand which adjustment improved the result.
        </p>
        <h2>Explore Outfits with Your Saved Wardrobe</h2>
        <p>
          A <Link href="/dashboard/wardrobe">saved wardrobe</Link> makes repeat styling experiments easier. Rather than uploading the same clothing images for every session, you can select available pieces and explore how they work together. Start with an anchor item, such as a jacket or a pair of trousers, then build a combination around its color, shape, and intended occasion. In the outfit tool above, select two to four items from different categories, with one item per category.
        </p>
        <p>
          For an everyday outfit, compare a small number of realistic alternatives instead of changing the entire look each time. You might keep the same trousers while trying different tops, or retain a dress while exploring an additional layer. This approach makes the comparison more useful because the differences between previews are easier to identify.
        </p>
        <p>
          The goal is not to generate the greatest number of images. It is to narrow down your options and notice combinations you might otherwise overlook. If your wardrobe is empty, begin with the photo upload workflow, then organize pieces you expect to use again. Save a successful result to Generated Looks when you want to keep it in your wardrobe.
        </p>
        <h2>Get More Useful Clothing Previews</h2>
        <p>
          Good comparisons depend on consistent inputs. When reviewing two garments, use the same person photo wherever possible. Keep the crop, pose, and lighting unchanged so that you are not comparing both a clothing change and a photography change at the same time. Consider the previews side by side and focus on the styling question that matters to you.
        </p>
        <p>
          Ask specific questions: Does this jacket create the silhouette I want? Do these colors work together? Would a shorter top make the outfit feel more balanced? Those questions are better suited to an AI clothing preview than asking whether a particular size will fit perfectly.
        </p>
        <p>
          Pay extra attention to fine patterns, lettering, logos, and layered edges. Generated images can reinterpret these details rather than preserve them exactly. For a purchase decision, return to the original product images and written specifications to confirm features such as pockets, closures, fabric composition, or decorative elements. Download useful previews so you can compare your styling ideas without relying on memory.
        </p>
        <h2>What a Virtual Fitting Room Can and Cannot Tell You</h2>
        <p>
          VFitly&apos;s virtual fitting room is designed for visual exploration. It can help you consider an outfit&apos;s appearance, compare styling directions, and communicate an idea more clearly than a collection of separate product photos. This is useful when you want inspiration or need a first look at a combination before deciding what to investigate further.
        </p>
        <p>
          However, an AI virtual try-on image is not a physical measurement or a guarantee of fit. It cannot reliably tell you how tight a waistband will feel, whether a fabric will stretch enough, or how comfortable a garment will be after several hours. Real clothing also responds to movement, material weight, construction, and the proportions of the wearer.
        </p>
        <p>
          Before buying, check the retailer&apos;s size chart, garment measurements, fabric information, and return policy. If accurate sizing is your main concern, compare those measurements with clothing you already own or use a physical fitting where possible. Think of the preview as one part of your decision, not a replacement for product information or personal judgment.
        </p>
        <h2>From a Try-On Image to a Video</h2>
        <p>
          A still image is a useful place to begin because it lets you inspect the outfit without distraction. Once you have a result you like, use Generate Runway Video to explore a moving presentation of that look. Check the relevant options and credit requirements before starting, since image and video generation may have different usage costs.
        </p>
        <p>
          Review the source image carefully before creating a video. If a sleeve, hand, pattern, or garment edge already looks incorrect, generating motion is not a dependable way to fix it. A cleaner starting image gives you a better basis for judging the next result. You can also revisit completed work in your <Link href="/dashboard/history">generation history</Link>.
        </p>
        <p>
          Treat the video as generated styling content, not as proof of how the real garment moves or drapes. If you share it with others, make its AI-generated nature clear whenever it could otherwise be mistaken for footage of an actual fitting.
        </p>
        <h2>Frequently Asked Questions</h2>
        <h3>Can I try on clothes online using my own photo?</h3>
        <p>
          Yes. Start by uploading your person photo and a clothing image in the tool above. A clear photo with the relevant body area visible is a useful starting point. Review the upload requirements before selecting a file. Generation may require signing in and sufficient credits for the selected action.
        </p>
        <h3>Do I need saved wardrobe items to get started?</h3>
        <p>
          No. You can begin with a clothing image directly. Saved wardrobe items are helpful when you want to reuse pieces or explore combinations without selecting the same files again. Use whichever workflow matches your current styling task.
        </p>
        <h3>Will the preview tell me which clothing size to buy?</h3>
        <p>
          No. The generated preview is a visual styling aid, not a sizing recommendation. Use the seller&apos;s measurements and size guide to assess fit. Comfort, stretch, and precise garment dimensions cannot be confirmed from a generated image alone.
        </p>
        <h3>Why does a detail look different from the original garment?</h3>
        <p>
          AI image generation can alter small features, especially text, intricate prints, accessories, or partly hidden areas. Try a clearer clothing image and simpler inputs. Always refer back to the original product information when an exact detail matters.
        </p>
        <h3>Where can I learn about credits and photo handling?</h3>
        <p>
          Visit the <Link href="/pricing">pricing page</Link> for plan and credit information, the <Link href="/docs">documentation</Link> for workflow guidance, and the <Link href="/privacy">privacy policy</Link> for information about data handling. If a result or upload does not work as expected, <Link href="/contact">contact support</Link> with a description of the problem.
        </p>
      </article>
    </>
  );
}
