import { IoLogoGithub } from "react-icons/io";
import { cn } from "@/lib/utils";

export const GITHUB_REPO_URL = "https://github.com/zhengmengkaiZMK/VFitly";

/** 顶部导航栏的 GitHub 图标链接，指向本开源项目仓库。 */
export function GitHubLink({ className }: { className?: string }) {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="VFitly open source project on GitHub (opens in a new tab)"
      title="VFitly on GitHub"
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
    >
      <IoLogoGithub className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
