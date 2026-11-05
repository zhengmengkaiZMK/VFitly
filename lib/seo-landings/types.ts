// SEO 落地页的内容配置类型。
// 所有落地页共用 components/seo/landing-page.tsx 模板，页面之间只替换内容，
// 保证每页都有：唯一 Title/H1、直接答案块、How It Works、限制说明、FAQ、相关页内链。

export type LandingStep = {
  title: string;
  description: string;
};

export type LandingCard = {
  title: string;
  description: string;
};

export type LandingFaq = {
  question: string;
  answer: string;
};

export type LandingLink = {
  label: string;
  href: string;
  description: string;
};

export type LandingPageContent = {
  /** 路由路径，如 "/ai-clothes-changer" */
  slug: string;
  /** <title> 标签 */
  title: string;
  /** meta description */
  description: string;
  /** 页面唯一 H1 */
  h1: string;
  /** 面包屑文字 */
  breadcrumb: string;
  /** 40~80 词的直接答案（GEO 可引用块） */
  answer: string;
  /** 答案之后的引导段落 */
  intro: string;
  /** 主 CTA 按钮文字 */
  ctaLabel: string;
  /** 主 CTA 跳转地址 */
  ctaHref: string;
  howItWorks: LandingStep[];
  whatYouCanTry: LandingCard[];
  supportedInputs: string[];
  tips: string[];
  /** 结果能展示什么（事实型，不夸大） */
  canShow: string[];
  /** 结果不能做什么（诚实限制说明） */
  cannotShow: string[];
  /** 隐私与图片处理说明 */
  privacy: string;
  /** 免费额度与付费说明 */
  pricing: string;
  faqs: LandingFaq[];
  related: LandingLink[];
};
