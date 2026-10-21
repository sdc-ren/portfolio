"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Eye, Languages, Loader2, Save, Upload } from "lucide-react";
import {
  contentSchema,
  type PortfolioContent,
} from "@/features/content/schema";
import { normalizeContentInput } from "@/features/content/normalize";
import { saveContent, createLocale } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CvDocument } from "@/features/cv/document";
import { ContentContext, Field, type Json } from "./editor-fields";
import { AdminSidebar } from "./admin-sidebar";
import { CollectionManager } from "./collection-manager";
import { isCollection } from "./collections";
import { navigation, type Section } from "./navigation";
import { Overview } from "./overview";
import styles from "./studio.module.scss";

export function Editor({
  initial,
  locale,
  locales,
  revision: initialRevision,
  publishedAt: initialPublishedAt,
  defaultSidebarOpen = true,
}: {
  initial: PortfolioContent;
  locale: string;
  locales: string[];
  revision: number;
  publishedAt: string | null;
  defaultSidebarOpen?: boolean;
}) {
  const [data, setData] = useState(initial);
  const [revision, setRevision] = useState(initialRevision);
  const [tab, setTab] = useState<Section>("overview");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  const [preview, setPreview] = useState(false);
  const [previewCv, setPreviewCv] = useState(initial.cvs[0].id);
  const [newLocale, setNewLocale] = useState("");
  const [publishedAt, setPublishedAt] = useState(initialPublishedAt);
  const [pending, start] = useTransition();
  const router = useRouter();
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const update = (section: keyof PortfolioContent, value: Json) => {
    setData((previous) => ({ ...previous, [section]: value }));
    setDirty(true);
    setStatus(null);
  };
  const select = (section: Section) => {
    setPreview(false);
    setTab(section);
  };
  const switchLocale = (value: string) => {
    if (!dirty || window.confirm("Discard unsaved workspace changes?"))
      router.push(`/admin?locale=${value}`);
  };
  const save = (publish: boolean) =>
    start(async () => {
      setStatus(null);
      const checked = contentSchema.safeParse(normalizeContentInput(data));
      if (!checked.success) {
        setStatus({
          error: true,
          message: checked.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; "),
        });
        return;
      }
      try {
        const result = await saveContent({
          locale,
          revision,
          publish,
          data: checked.data,
        });
        if (result.ok && result.revision !== undefined) {
          setData(checked.data);
          setRevision(result.revision);
          setDirty(false);
          if (publish) setPublishedAt(new Date().toISOString());
          setStatus({
            error: false,
            message: publish
              ? "Published. The website and PDF now use this version."
              : "Draft saved. The public website is unchanged.",
          });
        } else
          setStatus({
            error: true,
            message: result.error ?? "Could not save content.",
          });
      } catch {
        setStatus({
          error: true,
          message:
            "Save failed. Your edits are still here. Check your session and try again.",
        });
      }
    });
  const addLanguage = () =>
    start(async () => {
      try {
        const result = await createLocale({
          locale: newLocale.trim(),
          source: locale,
        });
        if (result.ok) router.push(`/admin?locale=${newLocale.trim()}`);
        else
          setStatus({
            error: true,
            message: result.error ?? "Could not create language.",
          });
      } catch {
        setStatus({
          error: true,
          message:
            "Use a locale such as vi, en or ja. Check your session and try again.",
        });
      }
    });
  const current = navigation.find((item) => item.key === tab)!;
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen} className={styles.shell}>
      <AdminSidebar
        active={tab}
        data={data}
        locale={locale}
        disabled={pending}
        hasChanges={dirty}
        onSelect={select}
      />
      <SidebarInset id="main" tabIndex={-1} className="min-w-0 bg-background">
        <header className={styles.header}>
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger aria-label="Toggle navigation" />
            <Separator orientation="vertical" className="h-5" />
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Portfolio
            </span>
            <span className="text-muted-foreground" aria-hidden="true">
              /
            </span>
            <span className="truncate text-sm font-medium">
              {preview ? "CV preview" : current.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={dirty ? "outline" : "secondary"}>
              {dirty ? "Unsaved changes" : "Saved"}
            </Badge>
            <Label className="sr-only" htmlFor="editing-locale">
              Editing language
            </Label>
            <Select
              value={locale}
              disabled={pending}
              onValueChange={switchLocale}
            >
              <SelectTrigger
                id="editing-locale"
                tooltip="Editing language"
                className="w-24 bg-card"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locales.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>
        <div className={styles.content}>
          <div className={styles.pageHeading}>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
                Content management · {locale.toUpperCase()}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                {preview ? "Preview draft CV" : current.label}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {preview
                  ? "Preview current workspace content before publishing."
                  : current.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => setPreview(!preview)}
              >
                <Eye size={15} />
                {preview ? "Back to content" : "Preview CV"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pending || !dirty}
                onClick={() => save(false)}
              >
                <Save size={15} />
                Save draft
              </Button>
              <Button size="sm" disabled={pending} onClick={() => save(true)}>
                {pending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                {pending ? "Saving…" : "Publish"}
              </Button>
            </div>
          </div>
          {status && (
            <p
              role={status.error ? "alert" : "status"}
              className={`${styles.notice} ${status.error ? styles.error : ""}`}
            >
              {status.message}
            </p>
          )}
          <ContentContext.Provider value={data}>
            {preview ? (
              <div className="space-y-5">
                <Select
                  value={
                    data.cvs.some((cv) => cv.id === previewCv)
                      ? previewCv
                      : data.cvs[0].id
                  }
                  onValueChange={setPreviewCv}
                >
                  <SelectTrigger
                    className="w-full bg-card sm:w-80"
                    aria-label="Preview CV"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {data.cvs.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className={styles.preview}>
                  <CvDocument
                    data={data}
                    variant={
                      data.cvs.some((cv) => cv.id === previewCv)
                        ? previewCv
                        : data.cvs[0].id
                    }
                  />
                </div>
              </div>
            ) : tab === "overview" ? (
              <Overview
                data={data}
                locales={locales}
                onSelect={select}
                publishedAt={publishedAt}
              />
            ) : tab === "translations" ? (
              <div className={styles.overviewGrid}>
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Content languages</CardTitle>
                    <CardDescription>
                      Each language has its own draft and published version.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {locales.map((value) => (
                      <div
                        key={value}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <span className="flex items-center gap-3">
                          <Languages size={17} className="text-primary" />
                          <strong className="text-sm">
                            {value.toUpperCase()}
                          </strong>
                        </span>
                        {value === locale ? (
                          <Badge variant="secondary">Editing</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={pending}
                            onClick={() => switchLocale(value)}
                          >
                            Open
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Add a translation</CardTitle>
                    <CardDescription>
                      Copy this language’s saved draft, then translate it before
                      publishing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-locale">Locale code</Label>
                      <Input
                        id="new-locale"
                        placeholder="vi"
                        value={newLocale}
                        disabled={pending}
                        onChange={(event) => setNewLocale(event.target.value)}
                      />
                    </div>
                    <Button
                      disabled={pending || dirty || !newLocale.trim()}
                      onClick={addLanguage}
                    >
                      Create draft language
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {dirty
                        ? "Save your workspace changes before creating a translation."
                        : "Examples: en, vi, ja. Existing languages cannot be overwritten."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : isCollection(tab) ? (
              <CollectionManager
                key={tab}
                section={tab}
                data={data}
                disabled={pending}
                onChange={(value) => update(tab, value)}
              />
            ) : (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{current.label}</CardTitle>
                  <CardDescription>
                    Changes apply to the current language. Save a draft or
                    publish when ready.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Field
                    name={tab}
                    value={data[tab] as Json}
                    disabled={pending}
                    onChange={(value) => update(tab, value)}
                  />
                </CardContent>
              </Card>
            )}
          </ContentContext.Provider>
          <footer className="mt-8 flex flex-wrap justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>
              Revision {revision} · {locale.toUpperCase()}
            </span>
            <span>Public pages and PDFs use published content only.</span>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
