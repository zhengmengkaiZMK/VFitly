import { Metadata } from "next";
import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us | VFitly by LINGTRUE",
  description:
    "Learn about VFitly, an AI virtual try-on product operated by LINGTRUE, founded in 2023 and based in Siming District, Xiamen, China. Find our company details and contact information here.",
  keywords: ["VFitly", "LINGTRUE", "about VFitly", "AI virtual try-on company", "contact VFitly"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | VFitly by LINGTRUE",
    description:
      "Learn about VFitly, an AI virtual try-on product operated by LINGTRUE, founded in 2023 and based in Siming District, Xiamen, China.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const companyInfo = [
  {
    label: "Company Name",
    value: "LINGTRUE",
  },
  {
    label: "Contact Phone",
    value: "+8613850062642",
    href: "tel:+8613850062642",
  },
  {
    label: "Address",
    value: "Erli, Qianpu North Area, Siming District, Xiamen, Fujian, China",
  },
  {
    label: "Founded",
    value: "2023",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40 flex flex-col items-center">
          <Heading as="h1">About Us</Heading>
          <Subheading className="text-center">
            VFitly is an AI virtual try-on platform that helps shoppers preview
            clothes on their own photos before buying. Our product is operated
            by LINGTRUE.
          </Subheading>
        </div>

        <div className="relative z-20 w-full max-w-2xl pb-20">
          <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm divide-y divide-neutral-100 dark:divide-neutral-800">
            {companyInfo.map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-6 py-5"
              >
                <span className="w-40 shrink-0 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-base font-medium text-black dark:text-white transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-base font-medium text-black dark:text-white">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
