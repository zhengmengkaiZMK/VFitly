import Link from "next/link";

export function ProductLinkTryOnGuide() {
  return (
    <article className="mx-auto mt-12 w-full max-w-4xl space-y-12 text-neutral-600 dark:text-neutral-300 [&_h2]:mb-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-neutral-950 dark:[&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-neutral-950 dark:[&_h3]:text-white [&_p]:mt-4 [&_p]:leading-7 [&_a]:underline [&_a]:underline-offset-4">
      <section>
        <h2>How product link try on works</h2>
        <p>Product link try on starts a virtual try-on from a shopping page rather than a file on your device. You paste the address of a product listing, the tool reads the garment photography published on that page, and each image becomes an independent try-on against one photo of a person.</p>
        <p>The advantage is scale. A single product page often shows the same piece in five colors, or photographs it from several angles. Instead of downloading, renaming and uploading those images one by one, you extract them all at once and compare them against a single photo, so the differences you see come from the clothing rather than from a change of pose or lighting.</p>
        <h3>1. Extract the garment images</h3>
        <p>Paste the URL of a public product page and start the extraction. The reader works best when a storefront exposes its product photography in the page HTML or in structured product metadata, which most modern shops do. A page that hides everything behind a login, blocks automated requests or loads each image only after heavy scripting will return fewer results, sometimes none.</p>
        <h3>2. Review what was found</h3>
        <p>Product pages mix useful garment shots with images you do not need: size charts, fabric close-ups, packaging, lifestyle scenes, store logos and promotional banners. Delete those before generating. As a rule of thumb, keep one clear image per garment variant you genuinely want to see on a person, because every image you keep becomes a separate generated result.</p>
        <h3>3. Change the clothes in your photo</h3>
        <p>Upload the person photo that should receive the clothing, then start the batch. Each remaining garment is applied to that photo independently, so one item failing does not cancel the rest of the run. When the batch finishes you can compare the results side by side, download the ones you like and open the original product page to check details.</p>
      </section>

      <section>
        <h2>Choosing a product link that extracts well</h2>
        <p>Start with the retailer&apos;s standard desktop product page. Mobile variants, app-only links, shortened affiliate redirects and search result pages are more likely to come back incomplete. If a link returns nothing useful, open the specific garment photo you want in a new tab and copy its direct image address instead.</p>
        <p>It also helps to think about what you are allowed to use. Extracting a retailer&apos;s product photo for your own private styling preview is a different matter from republishing that image, so keep personal use personal. Save the original product link alongside your results; you will need it later to confirm measurements, materials and availability, and it is the honest place to send anyone who asks where a garment came from.</p>
      </section>

      <section>
        <h2>Preparing the person photo</h2>
        <p>Use a full-body photo taken in even light, with a simple background and a relaxed, straightforward pose. Your outline should be easy to separate from what is behind you, and your arms should not cover the area where the new garment will sit. Heavy filters, motion blur, cropped torsos and crowded backgrounds all make the result harder to judge, because you cannot tell whether an oddity came from the garment or from the source photo.</p>
        <p>Reuse the same person photo for an entire batch. When only the clothing changes between results, the comparison stays honest. If you swap both the person and the garment, you lose the ability to attribute a difference to one of them.</p>
        <p>Only upload photos you own or have explicit permission to use. A generated image still shows a real, identifiable person wearing clothing they may never have chosen, so treat someone else&apos;s photo exactly as you would want yours to be treated.</p>
      </section>

      <section>
        <h2>Comparing variants in one batch</h2>
        <p>The real advantage of batch generation is consistency. Because every result shares one person photo, colorways and cuts can be compared directly instead of being judged from separate product shots taken under different lighting. Ask concrete questions as you review: does this neckline suit my proportions, is this shade warmer than the colors I already wear, does this length work with the shoes and layers I own.</p>
        <p>Keep the batch to a size you can actually assess. Ten results that you review carefully are more useful than forty that you scroll past. Narrow the list first with the images you have, then generate only the variants that survived that filter. If you would rather work with one image at a time, the <Link href="/dashboard/try-on">single image try-on page</Link> is the simpler route.</p>
      </section>

      <section>
        <h2>Product link try on versus a single-image try-on</h2>
        <p>Both routes use the same try-on engine, but they start in different places. A single-image workflow begins with a garment picture you already have on your device. Product link try on begins further back, at the shopping page: it collects the garment images for you, then runs the try-on across the whole set.</p>
        <p>That difference matters when you are choosing between items. If you already saved one clean garment photo and simply want to see it on yourself, the single-image workflow is quicker. If you are working from a store page with several colors, or a shortlist to narrow down, extracting the images first saves a lot of repetitive file handling.</p>
        <p>People sometimes describe that single-image route as an <Link href="/dashboard/try-on">AI clothes changer</Link>, because it replaces what someone is wearing in one photo. If that is the task in front of you, start there instead. Both routes end in the same kind of generated result and share the same limits described below.</p>
      </section>

      <section>
        <h2>What a product link try-on can and cannot show</h2>
        <p>A generated preview is good at broad visual questions. It can show an overall silhouette, how two colors sit next to each other, whether a longer skirt changes the balance of an outfit, and whether a combination is worth investigating further. It gives you something concrete to look at instead of guessing from a product photo shot on someone else.</p>
        <p>It cannot answer fit questions. Nothing in a generated image tells you whether a waistband will feel tight after a meal, how much a fabric stretches, whether a bodice gives enough support, or how a garment behaves when you sit down or raise your arms. Lace, beading, transparent layers, fine prints and logos may be reinterpreted rather than reproduced, because those details are exactly where image generation tends to improvise.</p>
        <p>So use the results to narrow your choices, then confirm the details that decide a purchase: measurements, fabric composition, care instructions and return conditions. If comfort or support is the deciding factor, a physical fitting still tells you more than any image, generated or otherwise.</p>
      </section>

      <section>
        <h2>Keeping extracted garments and results organised</h2>
        <p>Extracted garments can be saved to your <Link href="/dashboard/wardrobe">wardrobe</Link>, which is useful when you want to reuse the same piece in later sessions without extracting the same link again. Finished try-on images can be downloaded, and generated results stay on this page so you can return to them after comparing alternatives.</p>
        <p>A small amount of note-taking pays off. Alongside each saved result, keep the product link and one line about why it survived the cut, such as &quot;preferred this sleeve length&quot; or &quot;color works with the coat I already own&quot;. A ranked list of twenty means nothing two weeks later; five annotated favourites give you something you can act on. Before running a large batch, check <Link href="/pricing">plans and generation credits</Link>, and read the <Link href="/privacy">privacy policy</Link> if you want to know how uploaded photos are handled.</p>
      </section>
    </article>
  );
}
