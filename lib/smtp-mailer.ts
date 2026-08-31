/**
 * SMTP Mailer using fetch API
 * 使用原生 fetch 发送邮件（无需额外依赖）
 * 
 * 支持的免费 SMTP 服务：
 * 1. Brevo (Sendinblue) - 每天 300 封免费
 * 2. Mailgun - 每月 5000 封免费（前3个月）
 * 3. Resend - 每天 100 封免费
 * 
 * 配置说明（使用 Brevo 为例）：
 * 1. 注册 https://www.brevo.com/
 * 2. 获取 SMTP 密钥（API Keys）
 * 3. 在 .env.local 添加：
 *    BREVO_API_KEY=你的API密钥
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * 使用 Brevo (Sendinblue) API 发送邮件
 */
export async function sendEmailViaBrevo(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("❌ BREVO_API_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "accept": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "VFitly Contact Form",
          email: process.env.BREVO_FROM_EMAIL || "contact@example.com",
        },
        to: [
          {
            email: options.to,
            name: "VFitly Team",
          },
        ],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || "",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Email sent successfully:", data.messageId);
      return true;
    } else {
      const error = await response.json();
      console.error("❌ Email send failed:", JSON.stringify(error, null, 2));
      return false;
    }
  } catch (error) {
    console.error("❌ Email send error:", error);
    return false;
  }
}

/**
 * 备用方案：使用 Resend API 发送邮件
 */
export async function sendEmailViaResend(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "VFitly <noreply@vfitly.com>",
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Email sent successfully:", data.id);
      return true;
    } else {
      const error = await response.json();
      console.error("❌ Email send failed:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Email send error:", error);
    return false;
  }
}

/**
 * 主邮件发送函数（自动选择可用的服务）
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // 优先尝试 Brevo
  if (process.env.BREVO_API_KEY) {
    return await sendEmailViaBrevo(options);
  }

  // 备用：尝试 Resend
  if (process.env.RESEND_API_KEY) {
    return await sendEmailViaResend(options);
  }

  // 如果没有配置任何服务，记录到控制台
  console.warn("⚠️  No email service configured. Email content:");
  console.log("To:", options.to);
  console.log("Subject:", options.subject);
  console.log("HTML:", options.html.substring(0, 200) + "...");
  
  // 返回 true 以便开发时不影响用户体验
  return true;
}
