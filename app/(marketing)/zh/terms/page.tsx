import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务条款 - VFitly",
  description: "查看适用于使用 VFitly SaaS 产品和服务的通用服务条款。",
};

const sections = [
  {
    title: "1. 接受条款",
    content: [
      "访问或使用 VFitly 即表示您同意受本服务条款和我们的隐私政策约束。",
      "如果您不同意本条款，请不要访问或使用本服务。",
    ],
  },
  {
    title: "2. 使用资格与账号",
    content: [
      "您必须具备签订有约束力协议的法律能力，并满足适用法律规定的最低年龄要求。",
      "您有责任妥善保管账号凭证，并对您账号下发生的所有活动负责。",
      "您同意提供准确的账号信息，并在合理范围内保持信息更新。",
    ],
  },
  {
    title: "3. 服务使用规则",
    content: [
      "您只能按照本条款、适用法律以及我们提供的使用限制或文档使用本服务。",
      "您不得干扰、破坏、反向工程、过载服务，或试图未经授权访问本服务或相关系统。",
      "您不得使用本服务创建、上传或传播违法、侵权、有害、滥用、欺骗或其他被禁止的内容。",
    ],
  },
  {
    title: "4. AI 功能与生成内容",
    content: [
      "VFitly 可能提供基于您输入生成输出的 AI 工具。您有责任在依赖、发布或使用输出内容前自行审查。",
      "AI 输出可能不准确、不完整，或不适合特定用途。本服务不能替代法律、财务、医疗或其他专业建议。",
      "您声明并保证您对提交给服务的提示词、文件、图片或其他内容拥有必要权利。",
    ],
  },
  {
    title: "5. 订阅、付款与额度",
    content: [
      "部分功能可能需要付费订阅、额度或按使用量付费。价格、限制和包含功能可能因套餐而异。",
      "付款由第三方支付服务商处理。购买套餐即表示您授权相应扣款，并在适用时同意支付服务商的条款。",
      "除非法律另有要求或结账页面另有说明，费用通常不予退还，额度或使用权益可能根据适用套餐规则到期。",
    ],
  },
  {
    title: "6. 用户内容与授权",
    content: [
      "您保留对提交至服务的内容的所有权，但不影响第三方已有权利。",
      "您授予 VFitly 一项有限许可，用于托管、处理、传输、展示和使用您的内容，以便提供、保护、支持和改进服务。",
    ],
  },
  {
    title: "7. 知识产权",
    content: [
      "VFitly 及其软件、设计、商标、标识、文档和相关材料归我们或授权方所有，并受知识产权法律保护。",
      "本条款不会向您授予本服务或我们知识产权的任何所有权。",
    ],
  },
  {
    title: "8. 第三方服务",
    content: [
      "本服务可能集成或依赖第三方服务，例如托管、分析、认证、支付或 AI 基础设施服务商。",
      "我们不对第三方服务负责，您使用第三方服务时可能需要遵守其单独条款和政策。",
    ],
  },
  {
    title: "9. 暂停与终止",
    content: [
      "如果您违反本条款、给服务或其他用户带来风险、未支付应付费用，或法律要求我们这样做，我们可能暂停或终止您对服务的访问。",
      "您可以随时停止使用本服务。某些条款将在终止后继续有效，包括付款义务、知识产权、免责声明和责任限制等。",
    ],
  },
  {
    title: "10. 免责声明",
    content: [
      "本服务按“现状”和“可用”基础提供。在法律允许的最大范围内，我们不对适销性、特定用途适用性、不侵权、不中断或无错误运行作出保证。",
    ],
  },
  {
    title: "11. 责任限制",
    content: [
      "在法律允许的最大范围内，VFitly 不对间接、附带、特殊、后果性、惩戒性损害，或利润损失、数据丢失、业务中断承担责任。",
      "与服务相关的任何索赔，我们的总责任以索赔发生前十二个月内您为相关服务向我们支付的金额为限；若您未向我们付款，则以适用法律允许的最低金额为限。",
    ],
  },
  {
    title: "12. 条款变更",
    content: [
      "我们可能会不时更新本服务条款。如发生重大变更，我们会通过服务内通知或其他合理方式告知用户。",
      "变更生效后您继续使用本服务，即表示您接受更新后的条款。",
    ],
  },
  {
    title: "13. 联系我们",
    content: [
      "如果您对本服务条款有任何疑问，请通过网站上的反馈或联系表单与我们联系。",
    ],
  },
];

export default function ZhTermsOfServicePage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0 bg-white dark:bg-black">
      <Background />
      <Container className="relative z-20 max-w-4xl py-10 md:py-40">
        <div className="mb-12 text-center">
          <Heading as="h1">服务条款</Heading>
          <Subheading className="text-center">
            本通用服务条款说明您使用 VFitly SaaS 产品和服务时适用的规则与责任。
          </Subheading>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            最后更新：2026 年 8 月 31 日
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-10 dark:border-neutral-800 dark:bg-neutral-950/80">
          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            本服务条款仅作为通用模板，您可以根据具体业务模式、目标市场、付款规则和适用法律要求进一步调整。
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
