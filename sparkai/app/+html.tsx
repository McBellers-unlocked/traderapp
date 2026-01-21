import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Primary Meta Tags */}
        <title>SparkAI - AI Education for Kids</title>
        <meta name="title" content="SparkAI - AI Education for Kids" />
        <meta name="description" content="Fun, interactive lessons that teach children ages 8-12 about artificial intelligence. No coding required." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spark-kids.ai/" />
        <meta property="og:title" content="SparkAI - AI Education for Kids" />
        <meta property="og:description" content="Fun, interactive lessons that teach children ages 8-12 about artificial intelligence. No coding required." />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://spark-kids.ai/" />
        <meta property="twitter:title" content="SparkAI - AI Education for Kids" />
        <meta property="twitter:description" content="Fun, interactive lessons that teach children ages 8-12 about artificial intelligence. No coding required." />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1201348941656566');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1201348941656566&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Disable body scrolling on web to make native scrolling work */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
