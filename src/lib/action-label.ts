import { Children, isValidElement, type ReactNode } from "react";

/** Find action text without leaking decorative icons into tooltips. */
export function actionLabel(children: ReactNode): string {
  return Children.toArray(children)
    .map((child): string => {
      if (typeof child === "string" || typeof child === "number")
        return String(child);
      if (
        !isValidElement<{
          children?: ReactNode;
          "aria-label"?: string;
          "aria-hidden"?: boolean | "true" | "false";
          title?: string;
        }>(child)
      )
        return "";
      const props = child.props;
      if (props["aria-hidden"] === true || props["aria-hidden"] === "true")
        return "";
      return props["aria-label"] ?? props.title ?? actionLabel(props.children);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
