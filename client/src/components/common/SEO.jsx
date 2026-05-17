import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path, image, type = 'website' }) => {
  const siteName = 'ArcticFresh';
  const baseUrl = 'https://arcticfresh.in';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Professional AC Service Station`;
  const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
  const defaultDescription = 'Premium AC installation, repair, and maintenance services in Ahmedabad. Rated 4.8/5. Book your professional service now.';
  const desc = description || defaultDescription;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={fullUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
