import Link from "next/link";

export function BridalGuide() {
  return (
    <article className="relative z-10 mx-auto w-full max-w-4xl space-y-12 px-4 py-16 text-neutral-600 dark:text-neutral-300 [&_h2]:mb-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-neutral-950 dark:[&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-neutral-950 dark:[&_h3]:text-white [&_p]:mt-4 [&_p]:leading-7 [&_a]:underline [&_a]:underline-offset-4">
      <section>
        <h2>How to Try On Wedding Dresses at Home with AI</h2>
        <p>Begin with a question you want the preview to help answer: which silhouette interests you, whether you prefer sleeves, or how a particular neckline changes the overall look. You do not need to have chosen your final gown. The tool above lets you start with one dress image and use the result as a reference for your next comparison.</p>
        <h3>Choose a Clear Photo</h3>
        <p>Start with a full-body photo taken in even lighting. Choose an image where your outline is visible and your arms do not cover the area where the dress will appear. A straightforward pose and an uncluttered background make the preview easier to interpret. If you want to compare several gowns, reuse the same photo so changes in pose or lighting do not distract from the differences between dresses.</p>
        <h3>Upload a Dress Image</h3>
        <p>Choose an image that clearly shows one gown, including its neckline, waist, skirt, and any visible sleeves. A front-facing product photo is a useful starting point. Avoid collages or images where a bouquet, furniture, or another person hides important parts of the dress. Use photos you have permission to upload, and keep the original product page available so you can check details against the generated result.</p>
        <h3>Compare Your Preview</h3>
        <p>Generate a preview and review the overall silhouette first. Then look at the neckline, proportions, and visible details. If something looks inconsistent, try a clearer input before changing several settings at once. Keep useful results alongside the original dress images. The comparison should help you decide what to investigate next, rather than replace measurements, product descriptions, or a fitting appointment.</p>
      </section>
      <section>
        <h2>Compare Silhouettes, Necklines, and Bridal Details</h2>
        <p>Start with a specific styling question rather than trying every dress you find. You might compare an A-line skirt with a fuller ball gown, or explore how different necklines change the balance of a look. Keep your person photo unchanged and compare a small number of gowns at a time. This makes it easier to identify which features attract you.</p>
        <p>Consider the setting as well as the dress. A garden ceremony, a formal indoor venue, and a small city celebration may suggest different styling directions, but there is no single correct choice for any setting. Use the previews to notice your preferences, not to follow a rigid rule about what someone with your body shape should wear.</p>
        <p>Save the product links for your strongest options. Before arranging an appointment or ordering, confirm availability, size information, fabric details, and alteration options with the retailer. Small visual differences in a generated result should not outweigh confirmed information about the actual garment.</p>
      </section>
      <section>
        <h2>AI Previews, Home Samples, and Bridal Appointments</h2>
        <p>There are different ways to explore wedding dresses without starting in a bridal salon. An AI preview creates a generated image from your inputs. A home sample service sends a physical gown for you to try, subject to the retailer’s availability, fees, and return conditions. A bridal appointment lets you examine available dresses in person and discuss adjustments with a consultant.</p>
        <p>VFitly provides the image-based option. It does not send sample dresses or confirm how a particular gown will fit. Use it early in your search to explore visual preferences and prepare questions for a retailer.</p>
        <p>If your main concern is fabric feel, comfort, support, or freedom of movement, a physical try-on is more informative. If you are still deciding which silhouettes or styling directions interest you, an AI preview can help organize that first stage of exploration.</p>
      </section>
      <section>
        <h2>What Your Preview Can—and Cannot—Show</h2>
        <p>A generated preview can help you explore the appearance of a bridal look, including its broad silhouette and color relationships. It can also make an idea easier to discuss with someone helping you choose a dress.</p>
        <p>It cannot confirm your size, the comfort of a bodice, the weight of a train, or how a fabric feels against your skin. Lace, beading, transparent layers, and small decorative details may be altered in the generated image. Always check those features against the original product information.</p>
        <p>Treat a video preview in the same way: it is generated styling content, not evidence of the real gown’s movement or drape. Inspect the still image before making a video; motion is not a dependable way to correct an inaccurate sleeve or pattern. Before purchasing, review measurements and return conditions, and arrange a physical fitting where possible.</p>
      </section>
      <section>
        <h2>Keep a Useful Bridal Shortlist</h2>
        <p>For each favorite, save the original dress image, the generated preview, the product link, and a short note explaining what you like. Specific notes—such as “prefer this neckline” or “want to compare a less full skirt”—are more useful than a simple ranking. Your <Link href="/dashboard/wardrobe">saved wardrobe</Link> can help you revisit pieces you expect to use again.</p>
        <p>Keep the shortlist manageable. Bring your strongest options and questions to a bridal appointment, or use them when asking a retailer about samples and sizing. Revisit the list as you learn more about comfort, availability, alterations, and budget. A useful preview helps you make the next decision; it does not need to settle every part of the purchase.</p>
        <p>Before starting another session, check <Link href="/pricing">plans and generation credits</Link>. Read our <Link href="/privacy">privacy policy</Link> before uploading personal photos, or <Link href="/contact">contact support</Link> if you need help with an upload or result.</p>
      </section>
    </article>
  );
}
