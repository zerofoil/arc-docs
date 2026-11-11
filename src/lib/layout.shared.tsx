import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appIcon, appName, appWebsite, gitConfig } from "./shared";

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img
            src={appIcon}
            alt=""
            width={24}
            height={24}
            className="rounded"
          />
          {appName}
        </>
      ),
    },
    links: [
      {
        text: "Discord Server",
        url: `${appWebsite}/invite`,
        external: true,
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
