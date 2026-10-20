import type { ReactNode } from "react";
import type { PortfolioContent } from "@/features/content/schema";
import { cvMarkup } from "./markup";
import styles from "./cv.module.scss";

export function CvDocument({
  data,
  variant,
  actions,
}: {
  data: PortfolioContent;
  variant: string;
  actions?: ReactNode;
}) {
  return (
    <article className="cv-sheet">
      {actions && <div className={styles.actions}>{actions}</div>}
      <div dangerouslySetInnerHTML={{ __html: cvMarkup(data, variant) }} />
    </article>
  );
}
