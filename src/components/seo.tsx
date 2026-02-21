import { useEnv } from '@/hooks/use-env';

interface SEOProps {
  title?: string;
  description?: string;
}

export const SEO = ({ title, description }: SEOProps) => {
  try {
    const env = useEnv();
    const appTitle = env?.APP_TITLE || 'React-boilerplate';
    const appName = env?.APP_NAME || 'React-boilerplate';

    return (
      <>
        <title>{title ? `${title} | ${appTitle}` : appTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:noindex" content="true" />
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={title || appName} />
        <meta property="og:description" content={description || 'Private Dashboard'} />
      </>
    );
  } catch (error) {
    console.error('[SEO] Error loading environment variables:', error);
    return (
      <>
        <title>{title ? `${title} | React-boilerplate` : 'React-boilerplate'}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:noindex" content="true" />
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={title || 'React-boilerplate'} />
        <meta property="og:description" content={description || 'Private Dashboard'} />
      </>
    );
  }
};
