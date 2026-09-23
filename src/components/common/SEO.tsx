import React, { useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = '/assets/Profile.jpeg',
  schema,
}) => {
  const { profile, settings } = useCMS();

  const finalTitle = title ? `${title} | ${settings.siteName}` : settings.metaTitle;
  const finalDesc = description || settings.metaDescription;

  useEffect(() => {
    document.title = finalTitle;

    // Update meta tags dynamically
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.content = content;
    };

    updateMeta('description', finalDesc);
    updateMeta('og:title', finalTitle, true);
    updateMeta('og:description', finalDesc, true);
    updateMeta('og:image', image, true);
    updateMeta('twitter:title', finalTitle);
    updateMeta('twitter:description', finalDesc);

    // Default JSON-LD Schema
    const defaultPersonSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.fullName,
      jobTitle: ['Journalist', 'Media Presenter', 'Islamic Educator', 'Public Speaker'],
      description: profile.shortBio,
      image: window.location.origin + profile.profileImage,
      knowsLanguage: ['ta', 'si', 'en', 'ar'],
      award: ['Social TV Award 2025'],
      sameAs: [
        'https://youtube.com',
        'https://facebook.com',
        'https://instagram.com'
      ]
    };

    const finalSchema = schema || defaultPersonSchema;

    let scriptTag = document.getElementById('jsonld-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(finalSchema);
  }, [finalTitle, finalDesc, image, schema, profile, settings]);

  return null;
};
