import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "node:path";
import type { PortfolioContent } from "@/features/content/schema";
import { selectByIds } from "@/features/content/schema";
Font.register({
  family: "DejaVu",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/DejaVuSans.ttf") },
    {
      src: path.join(process.cwd(), "public/fonts/DejaVuSans-Bold.ttf"),
      fontWeight: 700,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);
const s = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "DejaVu",
    fontSize: 9,
    lineHeight: 1.5,
    color: "#162235",
  },
  name: { fontSize: 22, fontWeight: 700 },
  title: { fontSize: 11, color: "#185b83", marginTop: 5 },
  meta: { fontSize: 8, color: "#516075", marginTop: 4 },
  heading: {
    fontSize: 10,
    fontWeight: 700,
    color: "#185b83",
    borderBottomWidth: 1,
    borderBottomColor: "#dbe3eb",
    paddingBottom: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  entry: { marginBottom: 10 },
  bold: { fontWeight: 700 },
  bullet: { marginTop: 3, paddingLeft: 10 },
  link: { color: "#185b83", fontSize: 8 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7,
    color: "#516075",
    textAlign: "right",
  },
});
export async function createCvPdf(
  data: PortfolioContent,
  variant: string,
  locale: string,
) {
  const cv = data.cvs.find((c) => c.id === variant)!;
  return renderToBuffer(
    <Document
      title={`${data.profile.name} — ${cv.title}`}
      author={data.profile.name}
      language={locale}
    >
      <Page size="A4" style={s.page}>
        <View>
          <Text style={s.name}>{data.profile.name.toUpperCase()}</Text>
          <Text style={s.title}>{cv.title}</Text>
          <Text style={s.meta}>{cv.specialties}</Text>
          <Text style={s.meta}>
            {data.profile.location} · {data.profile.email} ·{" "}
            {data.profile.phone}
          </Text>
          {[data.profile.github, data.profile.linkedin]
            .filter(Boolean)
            .map((url) => (
              <Link key={url} style={s.link} src={url}>
                {url}
              </Link>
            ))}
        </View>
        <Text style={s.heading} minPresenceAhead={40}>
          {data.ui.cvSummary}
        </Text>
        <Text>{cv.summary}</Text>
        <Text style={s.heading} minPresenceAhead={40}>
          {data.ui.cvSkills}
        </Text>
        {selectByIds(data.skills, cv.skillIds).map((sk) => (
          <Text key={sk.id} style={{ marginBottom: 4 }}>
            <Text style={s.bold}>{sk.name}: </Text>
            {sk.items.join(", ")}
          </Text>
        ))}
        <Text style={s.heading} minPresenceAhead={60}>
          {data.ui.cvExperience}
        </Text>
        {selectByIds(data.experience, cv.experienceIds).map((e) => (
          <View key={e.id} style={s.entry}>
            <View wrap={false}>
              <Text style={s.bold}>
                {e.company} — {e.role}
              </Text>
              <Text style={s.meta}>
                {e.period} · {e.location}
              </Text>
              {e.highlights[0] && (
                <Text style={s.bullet}>• {e.highlights[0]}</Text>
              )}
            </View>
            {e.highlights.slice(1).map((h) => (
              <Text key={h} style={s.bullet}>
                • {h}
              </Text>
            ))}
          </View>
        ))}
        <Text style={s.heading} minPresenceAhead={60}>
          {data.ui.cvProjects}
        </Text>
        {selectByIds(data.projects, cv.projectIds).map((p) => (
          <View key={p.id} style={s.entry}>
            <View wrap={false}>
              <Text style={s.bold}>{p.title}</Text>
              <Text style={s.meta}>{p.role}</Text>
              {p.repository && (
                <Link style={s.link} src={p.repository}>
                  {p.repository}
                </Link>
              )}
              <Text style={s.meta}>{p.tech.join(" · ")}</Text>
              {p.highlights[0] && (
                <Text style={s.bullet}>• {p.highlights[0]}</Text>
              )}
            </View>
            {p.highlights.slice(1).map((h) => (
              <Text key={h} style={s.bullet}>
                • {h}
              </Text>
            ))}
          </View>
        ))}
        <Text style={s.heading} minPresenceAhead={40}>
          {data.ui.cvEducation}
        </Text>
        {data.education.map((e) => (
          <Text key={e.id}>
            {e.institution} — {e.qualification}, {e.year}
          </Text>
        ))}
        {data.languages.map((l) => (
          <Text key={l.id}>
            {l.name}: {l.proficiency}
          </Text>
        ))}
        <Text
          fixed
          style={s.footer}
          render={({ pageNumber, totalPages }) =>
            `${data.profile.name} · ${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>,
  );
}
