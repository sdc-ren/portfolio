import { access } from "node:fs/promises";
import path from "node:path";

/** Serverless Chromium is Linux-only. Local development uses installed Chrome. */
export async function localChromePath(
  platform = process.platform,
  env: Record<string, string | undefined> = process.env,
  exists: (file: string) => Promise<boolean> = async (file) => {
    try {
      await access(file);
      return true;
    } catch {
      return false;
    }
  },
): Promise<string | undefined> {
  if (env.CHROMIUM_EXECUTABLE_PATH) return env.CHROMIUM_EXECUTABLE_PATH;
  const candidates =
    platform === "darwin"
      ? [
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ]
      : platform === "win32"
        ? [env.PROGRAMFILES, env["PROGRAMFILES(X86)"], env.LOCALAPPDATA]
            .filter((root): root is string => Boolean(root))
            .map((root) =>
              path.win32.join(
                root,
                "Google",
                "Chrome",
                "Application",
                "chrome.exe",
              ),
            )
        : [];
  for (const candidate of candidates)
    if (await exists(candidate)) return candidate;
  if (platform !== "linux")
    throw new Error(
      "Chrome was not found. Install Google Chrome or set CHROMIUM_EXECUTABLE_PATH to its executable path.",
    );
  return undefined;
}
