import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 - VFitly",
  description: "了解 VFitly 如何在 SaaS 产品和服务中收集、使用、保护和管理个人信息。",
};

const sections = [
  {
    title: "1. 我们收集的信息",
    content: [
      "账号信息，例如您的姓名、电子邮箱、与密码相关的认证信息，以及您主动提供的个人资料。",
      "使用信息，例如访问页面、使用功能、产品交互、设备信息、浏览器类型、IP 地址和日志数据。",
      "您提交或通过服务生成的内容，包括上传文件、提示词、反馈、支持请求和生成结果。",
      "由支付服务商处理的账单信息，例如套餐类型、交易状态、账单邮箱和支付相关元数据。我们不会在自己的服务器上存储完整银行卡信息。",
    ],
  },
  {
    title: "2. 我们如何使用信息",
    content: [
      "用于提供、维护、个性化和改进我们的 SaaS 产品与服务。",
      "用于用户认证、账号管理、订阅处理，并防止未经授权的访问。",
      "用于回复反馈、支持请求、问题咨询和服务相关沟通。",
      "用于监控服务性能、排查问题、识别滥用、防范欺诈并提升安全性。",
      "用于发送重要通知，例如服务、政策、账单或安全更新。",
    ],
  },
  {
    title: "3. Cookie 和类似技术",
    content: [
      "我们可能使用 Cookie、本地存储、分析工具和类似技术，以保持登录状态、记住偏好、理解产品使用情况并改进用户体验。",
      "您可以通过浏览器设置管理 Cookie，但禁用某些 Cookie 可能会影响核心服务功能。",
    ],
  },
  {
    title: "4. AI 功能与用户内容",
    content: [
      "当您使用 AI 功能时，您提供的内容可能会被处理，用于生成您请求的结果、维护使用历史、执行配额限制、提升稳定性并保障服务安全。",
      "您需要确保上传或提交的内容符合适用法律法规，且不侵犯任何第三方权利。",
    ],
  },
  {
    title: "5. 信息共享与披露",
    content: [
      "我们不会出售您的个人信息。我们可能会与帮助我们运营服务的服务提供商共享必要信息，例如托管、分析、认证、邮件、客户支持、支付和 AI 基础设施服务商。",
      "在法律要求、保护我们和用户权益、防范欺诈或安全威胁，或涉及合并、收购、融资、资产出售等情形下，我们可能会披露相关信息。",
    ],
  },
  {
    title: "6. 数据保留",
    content: [
      "我们会在提供服务、履行法律义务、解决争议、执行协议和维护安全所需的期限内保留个人信息。",
      "您可以请求删除账号或部分个人信息，但可能受到法律、安全和运营要求的限制。",
    ],
  },
  {
    title: "7. 安全措施",
    content: [
      "我们采用合理的管理、技术和组织措施来保护个人信息。但任何传输或存储方式都无法保证绝对安全。",
    ],
  },
  {
    title: "8. 您的权利与选择",
    content: [
      "根据您所在地区的适用法律，您可能有权访问、更正、删除、导出、限制或反对我们处理您的部分个人信息。",
      "对于非必要通信，若邮件或消息中提供退订方式，您可以选择取消订阅。",
    ],
  },
  {
    title: "9. 跨境数据传输",
    content: [
      "我们的服务提供商和基础设施可能会在不同国家或地区处理信息。在法律要求的情况下，我们会采取适当保护措施处理跨境数据传输。",
    ],
  },
  {
    title: "10. 儿童隐私",
    content: [
      "我们的服务不面向低于适用法律规定年龄的儿童。未经适当同意，我们不会故意收集儿童的个人信息。",
    ],
  },
  {
    title: "11. 政策变更",
    content: [
      "我们可能会不时更新本隐私政策。如发生重大变更，我们会通过服务内通知或其他合理方式告知用户。",
    ],
  },
  {
    title: "12. 联系我们",
    content: [
      "如果您对本隐私政策或我们的隐私实践有任何疑问，请通过网站上的反馈或联系表单与我们联系。",
    ],
  },
];

export default function ZhPrivacyPolicyPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0 bg-white dark:bg-black">
      <Background />
      <Container className="relative z-20 max-w-4xl py-10 md:py-40">
        <div className="mb-12 text-center">
          <Heading as="h1">隐私政策</Heading>
          <Subheading className="text-center">
            本通用隐私政策说明 VFitly 在您使用我们的 SaaS 产品和服务时如何处理个人信息。
          </Subheading>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            最后更新：2026 年 8 月 31 日
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-10 dark:border-neutral-800 dark:bg-neutral-950/80">
          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            本隐私政策仅作为通用信息说明，您可以根据具体业务、目标市场和适用法律要求进一步调整。
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
