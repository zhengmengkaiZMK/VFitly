import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - VFitly",
  description: "Learn how VFitly collects, uses, protects, and manages personal information for its SaaS products and services.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "Account information, such as your name, email address, password-related authentication data, and profile details you choose to provide.",
      "Usage information, such as pages visited, features used, product interactions, device information, browser type, IP address, and log data.",
      "Content you submit or generate through the service, including uploaded files, prompts, feedback, support requests, and generated outputs.",
      "Billing information processed by our payment providers, such as plan type, transaction status, billing email, and payment metadata. We do not store full card details on our servers.",
    ],
  },
  {
    title: "2. How We Use Information",
    content: [
      "To provide, maintain, personalize, and improve our SaaS products and services.",
      "To authenticate users, manage accounts, process subscriptions, and prevent unauthorized access.",
      "To respond to feedback, support requests, questions, and service-related communications.",
      "To monitor service performance, troubleshoot issues, detect abuse, prevent fraud, and improve security.",
      "To send important notices, such as changes to our services, policies, billing, or security updates.",
    ],
  },
  {
    title: "3. Cookies and Similar Technologies",
    content: [
      "We may use cookies, local storage, analytics tools, and similar technologies to keep you signed in, remember preferences, understand product usage, and improve user experience.",
      "You can control cookies through your browser settings, but disabling certain cookies may affect core service functionality.",
    ],
  },
  {
    title: "4. AI Features and User Content",
    content: [
      "When you use AI-powered features, the content you provide may be processed to generate requested outputs, maintain usage history, enforce quotas, improve reliability, and ensure safety of the service.",
      "You are responsible for ensuring that any content you upload or submit complies with applicable laws and does not infringe third-party rights.",
    ],
  },
  {
    title: "5. Sharing and Disclosure",
    content: [
      "We do not sell your personal information. We may share limited information with service providers who help us operate the service, such as hosting, analytics, authentication, email, customer support, payment, and AI infrastructure providers.",
      "We may disclose information when required by law, to protect our rights and users, to prevent fraud or security threats, or in connection with a merger, acquisition, financing, or sale of assets.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain personal information for as long as necessary to provide the service, comply with legal obligations, resolve disputes, enforce agreements, and maintain security.",
      "You may request deletion of your account or certain personal information, subject to legal, security, and operational requirements.",
    ],
  },
  {
    title: "7. Security",
    content: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "8. Your Rights and Choices",
    content: [
      "Depending on your location, you may have rights to access, correct, delete, export, restrict, or object to certain processing of your personal information.",
      "You may also unsubscribe from non-essential communications where an unsubscribe option is provided.",
    ],
  },
  {
    title: "9. International Data Transfers",
    content: [
      "Our service providers and infrastructure may process information in different countries or regions. Where required, we use appropriate safeguards for cross-border data transfers.",
    ],
  },
  {
    title: "10. Children’s Privacy",
    content: [
      "Our services are not intended for children under the age required by applicable law. We do not knowingly collect personal information from children without appropriate consent.",
    ],
  },
  {
    title: "11. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. If changes are material, we will take reasonable steps to notify users through the service or other appropriate means.",
    ],
  },
  {
    title: "12. Contact Us",
    content: [
      "If you have questions about this Privacy Policy or our privacy practices, please contact us through the feedback or contact form available on our website.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0 bg-white dark:bg-black">
      <Background />
      <Container className="relative z-20 max-w-4xl py-10 md:py-40">
        <div className="mb-12 text-center">
          <Heading as="h1">Privacy Policy</Heading>
          <Subheading className="text-center">
            This general Privacy Policy explains how VFitly handles personal information when you use our SaaS products and services.
          </Subheading>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Last updated: August 31, 2026
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-10 dark:border-neutral-800 dark:bg-neutral-950/80">
          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            This Privacy Policy is provided for general informational purposes and may need to be adapted to your specific business, jurisdiction, and legal requirements.
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
