import Head from "next/head";

const SEO = ({ title, description, image, url }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="invoice, invoicing tool, ai invoice, fast invoice, quick invoice, create invoice faster, vibe invoice"
      />
      <meta name="author" content="Vibe Invoice" />
      <meta name="robots" content="index, follow" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Bulkmark",
            url: "https://vibeinvoice.com",
            image: image,
            description: description,
            applicationCategory: "Utility",
            operatingSystem: "Web-based",
            offers: {
              "@type": "Offer",
              price: "49.00",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    </Head>
  );
};

export default SEO;
