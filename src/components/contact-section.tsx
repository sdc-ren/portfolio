import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
import { ActionAnchor } from "./action-link";
import { Button } from "./ui/button";
import styles from "./contact-section.module.scss";

export function ContactSection({
  profile,
  labels,
}: {
  profile: PortfolioContent["profile"];
  labels: PortfolioContent["ui"];
}) {
  const channels = [
    { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: profile.github, label: "GitHub", Icon: Github },
    {
      href: profile.phone.trim()
        ? `tel:${profile.phone.replace(/[^+\d]/g, "")}`
        : "",
      label: profile.phone,
      Icon: Phone,
    },
  ].filter((channel) => channel.href);
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={styles.section}
    >
      <div className={styles.card}>
        <div className={styles.intro}>
          <h2 id="contact-heading">{labels.contactHeading}</h2>
          <p className={styles.description}>{labels.contactDescription}</p>
          <p className={styles.location}>
            <MapPin size={15} aria-hidden="true" />
            {profile.location}
          </p>
        </div>
        <div className={styles.channels}>
          <p className={styles.emailLabel}>{labels.emailLabel}</p>
          <p className={styles.email}>{profile.email}</p>
          <Button asChild className="w-full sm:w-auto">
            <a href={`mailto:${profile.email}`}>
              <Mail size={16} aria-hidden="true" />
              {labels.contactButton}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </Button>
          {channels.length > 0 && (
            <div className={styles.links}>
              {channels.map(({ href, label, Icon }) => (
                <ActionAnchor key={href} href={href} className={styles.link}>
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </ActionAnchor>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
