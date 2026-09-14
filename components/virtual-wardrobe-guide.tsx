import Link from "next/link";

export function VirtualWardrobeGuide() {
  return (
    <article className="mx-auto mt-12 w-full max-w-4xl space-y-12 text-neutral-600 dark:text-neutral-300 [&_h2]:mb-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-neutral-950 dark:[&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-neutral-950 dark:[&_h3]:text-white [&_p]:mt-4 [&_p]:leading-7 [&_a]:underline [&_a]:underline-offset-4">
      <section>
        <h2>What a virtual wardrobe actually is</h2>
        <p>A virtual wardrobe is a collection of clothing images you can reuse, not a place where physical clothes are kept. Instead of re-uploading the same jacket every time you want to preview an outfit, you add it once, describe it briefly, and select it whenever you need it. VFitly stores each garment as an image plus a category, a colour and optional tags, and keeps finished results in a separate folder so source garments and generated looks never get mixed up.</p>
        <p>It is worth being precise about what this replaces. Most people currently keep outfit ideas in a camera roll, a notes app or a folder of screenshots. None of those let you filter by category or feed an item straight into a try-on. A virtual wardrobe is the layer between the shopping photos you save and the outfits you actually want to see on yourself.</p>
      </section>

      <section>
        <h2>Building your virtual wardrobe</h2>
        <h3>One garment per image</h3>
        <p>Upload a photo that shows a single item clearly: a flat-lay, a product shot on a plain background, or a clean picture of the garment on its own. Avoid collages, group shots and images where a model, a bag or a piece of furniture hides the area you care about. When an image contains several garments, the try-on has to guess which one you meant, and the result becomes harder to judge.</p>
        <p>Keep the visual style reasonably consistent across your wardrobe. If every item is photographed against a similar background and from a similar angle, comparing them later is much easier than mixing studio shots with mirror selfies taken in different lighting.</p>
        <h3>Categories, colours and tags</h3>
        <p>Give every item a category: Top, Bottom, Dress, Outerwear, Shoes, Accessory or Other. This is not decoration. Outfit building groups garments by category and expects one item per category, so a dress and a pair of shoes can be combined while two different dresses cannot. Choosing the right category the first time saves you from correcting it later.</p>
        <p>Add the colour you would genuinely use to describe the piece. &quot;Charcoal&quot; is more useful to future you than &quot;dark&quot;, and &quot;off-white&quot; is more useful than &quot;white&quot; when you are trying to match a specific outfit. If a garment has two dominant colours, record the second one as well.</p>
        <h3>Naming items so you can find them later</h3>
        <p>Names matter more than people expect. &quot;Black blazer, cropped&quot; tells you what you are selecting; &quot;IMG_2831&quot; does not. A simple pattern works well: garment type first, then the detail that distinguishes it from similar pieces in your wardrobe, such as sleeve length, length overall, or the occasion you bought it for.</p>
        <p>Use tags for anything you search by rather than read: an occasion like work or wedding, a season, a fabric, or a note about fit such as oversized or tailored. Tags are cheap to add and they are the difference between a wardrobe you browse and a wardrobe you abandon.</p>
      </section>

      <section>
        <h2>Organizing a wardrobe that stays useful</h2>
        <p>The habit that keeps a virtual wardrobe working is small and unglamorous: when you add an item, finish describing it before moving on. A wardrobe of thirty well-described garments is genuinely more useful than two hundred unnamed files, because the point of the library is retrieval, not accumulation.</p>
        <p>Start with the pieces you wear most. Everyday tops, the jeans that fit, the coat you reach for in winter and the shoes you actually walk in. Those are the items you will want to combine when testing something new, such as a jacket you are considering buying. Occasion wear can follow later, once the everyday base is in place.</p>
        <p>Prune as you go. If a garment no longer fits, has worn out or no longer represents your style, delete it. A library that reflects what you own today stays faster to scan than one that quietly accumulates years of old screenshots.</p>
      </section>

      <section>
        <h2>Reusing garment images in try-on</h2>
        <h3>Single garment try-on</h3>
        <p>Select one item and take it into the <Link href="/dashboard/try-on">try-on studio</Link> alongside your photo. Because the garment image is already stored, you skip the upload step entirely and can move straight to generating a result. If the outcome looks off, swapping in a clearer garment image from your wardrobe is usually faster than changing several settings at once.</p>
        <h3>Building an outfit from several items</h3>
        <p>You can combine two to four wardrobe items from different categories in a single preview, for example a dress with shoes, or a top with trousers and a layer over it. One item per category keeps the combination readable. Building looks from pieces you already own is what turns a wardrobe from an archive into a planning tool.</p>
        <h3>Batch try-on from a product link</h3>
        <p>If the item is still on a shopping page rather than in your wardrobe, the <Link href="/dashboard/product-try-on">product link try-on page</Link> extracts the garment images from that page and runs them as a batch. When you decide an item is worth keeping, save it here so you do not have to extract the same link again next time.</p>
      </section>

      <section>
        <h2>Keeping saved looks in one place</h2>
        <p>Generated results are stored separately from your garment library, under saved looks, so you can return to an outfit you liked without re-running the generation. Keeping the two apart also means you never accidentally use a finished result as a source garment, which is a common way for quality to degrade across a series of edits.</p>
        <p>Before running a large batch of experiments, check <Link href="/pricing">plans and generation credits</Link> so you know how many results your allowance covers. If you want to understand what happens to the photos you upload, the <Link href="/privacy">privacy policy</Link> explains how images and account data are handled.</p>
      </section>

      <section>
        <h2>What a virtual wardrobe does not do</h2>
        <p>It does not measure anything. Storing a garment photo and a category does not tell you whether the piece will fit, how much the fabric stretches, or whether a waistband will feel comfortable after a long day. Garment measurements, fabric composition and the retailer&apos;s size chart remain the sources that decide a purchase.</p>
        <p>It also does not store or ship physical clothing. This page is an image library, not a service that holds your clothes or delivers samples to your door. What it does is remove repeated work: upload once, then reuse the same garment across as many try-ons and outfit previews as you need, with the metadata that makes each item findable months later.</p>
      </section>
    </article>
  );
}
