import assert from "node:assert/strict";
import { test } from "node:test";
import initial from "../src/data/initial-content.json";
import { contentSchema, projectSchema } from "../src/features/content/schema";
import {
  coverImage,
  imageUploadSchema,
  MAX_IMAGE_BYTES,
} from "../src/features/content/project-assets";
import { cvMarkup } from "../src/features/cv/markup";

const project = contentSchema.parse(initial).projects[0];
const image = {
  id: "screen-1",
  url: "https://example.com/screenshot.webp",
  alt: "Project dashboard",
  caption: "Dashboard overview",
};

test("Legacy project URLs become links without resurrecting deliberately removed links", () => {
  const { links: _, images: __, coverImageId: ___, ...legacy } = project;
  const migrated = projectSchema.parse({
    ...legacy,
    repository: "https://github.com/example/project",
    demo: "https://example.com",
  });
  assert.equal(migrated.links[0].showInCv, true);
  assert.equal(migrated.links[1].type, "website");
  assert.deepEqual(migrated.images, []);
  assert.equal("repository" in migrated, false);
  assert.deepEqual(
    projectSchema.parse({
      ...legacy,
      repository: "https://github.com/example/project",
      links: [],
    }).links,
    [],
  );
});

test("Project assets reject unsafe URLs, duplicate identities, missing alt text and dangling covers", () => {
  const badLink = {
    id: "link",
    type: "website",
    url: "javascript:alert(1)",
    showInCv: false,
  };
  assert.equal(
    projectSchema.safeParse({ ...project, links: [badLink] }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({
      ...project,
      links: [
        { ...badLink, type: "custom", url: "https://example.com", label: "" },
      ],
    }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({ ...project, images: [image, image] }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({ ...project, images: [{ ...image, alt: "" }] })
      .success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({
      ...project,
      images: [{ ...image, url: "data:image/png;base64,x" }],
    }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({
      ...project,
      images: [image],
      coverImageId: "missing",
    }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({
      ...project,
      images: Array.from({ length: 21 }, (_, i) => ({
        ...image,
        id: `image-${i}`,
      })),
    }).success,
    false,
  );
  assert.equal(coverImage({ images: [image], coverImageId: "" })?.id, image.id);
});

test("Only allowed raster uploads within the byte limit get an upload ticket", () => {
  const input = {
    projectId: "my-project",
    size: MAX_IMAGE_BYTES,
    type: "image/webp",
  };
  assert.equal(imageUploadSchema.safeParse(input).success, true);
  for (const patch of [
    { size: 0 },
    { size: MAX_IMAGE_BYTES + 1 },
    { type: "image/svg+xml" },
    { projectId: "../other" },
  ]) {
    assert.equal(
      imageUploadSchema.safeParse({ ...input, ...patch }).success,
      false,
    );
  }
});

test("CV includes only opted-in, escaped links and remains completely independent of project images", () => {
  const data = contentSchema.parse(initial);
  const selected = data.projects.find(
    (item) => item.id === data.cvs[0].projectIds[0],
  )!;
  selected.links = [
    {
      id: "public",
      type: "website",
      url: "https://example.com/?a=1&b=2",
      label: '<Visit "site">',
      showInCv: true,
    },
    {
      id: "beta",
      type: "testflight",
      url: "https://testflight.apple.com/join/private-beta",
      label: "",
      showInCv: false,
    },
  ];
  const before = cvMarkup(data, data.cvs[0].id);
  selected.images = [image];
  selected.coverImageId = image.id;
  assert.equal(cvMarkup(data, data.cvs[0].id), before);
  assert.ok(before.includes("https://example.com/?a=1&amp;b=2"));
  assert.ok(before.includes("&lt;Visit &quot;site&quot;&gt;"));
  assert.ok(!before.includes("private-beta"));
  assert.ok(!before.includes(image.url));
  assert.ok(!before.includes("<img"));
});
