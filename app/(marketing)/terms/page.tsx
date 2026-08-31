import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - VFitly",
  description: "Review the general terms that govern your use of VFitly SaaS products and services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using VFitly, you agree to be bound by these Terms of Service and our Privacy Policy.",
      "If you do not agree to these terms, you may not access or use the service.",
    ],
  },
  {
    title: "2. Eligibility and Accounts",
    content: [
      "You must be legally able to enter into a binding agreement and meet the minimum age required by applicable law.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You agree to provide accurate account information and keep it reasonably up to date.",
    ],
  },
  {
    title: "3. Use of the Service",
    content: [
      "You may use the service only in accordance with these terms, applicable laws, and any usage limits or documentation we provide.",
      "You may not interfere with, disrupt, reverse engineer, overload, or attempt to gain unauthorized access to the service or related systems.",
      "You may not use the service to create, upload, or distribute unlawful, infringing, harmful, abusive, deceptive, or otherwise prohibited content.",
    ],
  },
  {
    title: "4. AI Features and Generated Content",
    content: [
      "VFitly may provide AI-powered tools that generate outputs based on your inputs. You are responsible for reviewing outputs before relying on, publishing, or using them.",
      "AI outputs may be inaccurate, incomplete, or unsuitable for certain uses. The service is not a substitute for professional legal, financial, medical, or other expert advice.",
      "You represent that you have the necessary rights to submit any prompts, files, images, or other content you provide to the service.",
    ],
  },
  {
    title: "5. Subscriptions, Payments, and Credits",
    content: [
      "Certain features may require a paid subscription, credits, or usage-based payment. Prices, limits, and included features may vary by plan.",
      "Payments are processed by third-party payment providers. By purchasing a plan, you authorize the applicable charges and agree to the provider’s terms where applicable.",
      "Unless otherwise required by law or stated at checkout, fees are non-refundable and credits or usage allowances may expire according to the applicable plan rules.",
    ],
  },
  {
    title: "6. User Content and License",
    content: [
      "You retain ownership of content you submit to the service, subject to any rights held by third parties.",
      "You grant VFitly a limited license to host, process, transmit, display, and use your content as necessary to provide, secure, support, and improve the service.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "VFitly and its software, designs, trademarks, logos, documentation, and related materials are owned by us or our licensors and are protected by intellectual property laws.",
      "These terms do not grant you any ownership rights in the service or our intellectual property.",
    ],
  },
  {
    title: "8. Third-Party Services",
    content: [
      "The service may integrate with or depend on third-party services, such as hosting, analytics, authentication, payment, or AI infrastructure providers.",
      "We are not responsible for third-party services, and your use of them may be subject to separate terms and policies.",
    ],
  },
  {
    title: "9. Suspension and Termination",
    content: [
      "We may suspend or terminate access to the service if you violate these terms, create risk for the service or other users, fail to pay required fees, or if we are required to do so by law.",
      "You may stop using the service at any time. Certain provisions will survive termination where reasonably necessary, including payment obligations, intellectual property rights, disclaimers, and liability limitations.",
    ],
  },
  {
    title: "10. Disclaimers",
    content: [
      "The service is provided on an ‘as is’ and ‘as available’ basis. To the maximum extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, VFitly will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, or business interruption.",
      "Our total liability for any claim related to the service will be limited to the amount you paid to us for the service during the twelve months before the claim arose, or a minimal amount permitted by applicable law if you have not paid us.",
    ],
  },
  {
    title: "12. Changes to These Terms",
    content: [
      "We may update these Terms of Service from time to time. If changes are material, we will take reasonable steps to notify users through the service or other appropriate means.",
      "Your continued use of the service after changes become effective means you accept the updated terms.",
    ],
  },
  {
    title: "13. Contact Us",
    content: [
      "If you have questions about these Terms of Service, please contact us through the feedback or contact form available on our website.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0 bg-white dark:bg-black">
      <Background />
      <Container className="relative z-20 max-w-4xl py-10 md:py-40">
        <div className="mb-12 text-center">
          <Heading as="h1">Terms of Service</Heading>
          <Subheading className="text-center">
            These general Terms of Service explain the rules and responsibilities that apply when you use VFitly SaaS products and services.
          </Subheading>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Last updated: August 31, 2026
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-10 dark:border-neutral-800 dark:bg-neutral-950/80">
          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            These Terms of Service are provided as a general template and may need to be adapted to your specific business model, jurisdiction, payment terms, and legal requirements.
          </p>
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {section.title}
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                {section.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
