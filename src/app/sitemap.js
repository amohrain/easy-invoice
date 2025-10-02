const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap() {
  const staticPages = [
    "/",
    "/about-us",
    "/contact-us",
    "/cookie-policy",
    "/docs",
    "/playground",
    "/privacy-policy",
    "/refund-policy",
    "/terms",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    // lastModified: "2024-12-31",
    changeFrequency: "monthly",
    priority: 1,
  }));

  //   const allTags = await getAllTags();

  //   const searchLandingPages = allTags
  //     .map((tag) =>
  //       locations.map((location) => ({
  //         url: `${baseUrl}/${location}/${tag}`,
  //         lastModified: new Date(),
  //         changeFrequency: "weekly",
  //         priority: 1,
  //       }))
  //     )
  //     .flat();

  return [
    // Insert your hardcoded pages:
    {
      url: `${baseUrl}/hardcoded`,
      lastModified: "2024-12-31",
      changeFrequency: "yearly",
      priority: 0.8,
    },
    ...staticPages,
    // Our pSEO pages:
    // ...searchLandingPages,
  ];
}
