import styles from "./section-heading.module.scss";
export function SectionHeading({
  subtitle,
  title,
  className = "",
}: {
  subtitle: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`${styles.heading} ${className}`}>
      <p className={styles.subtitle}>{subtitle}</p>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
