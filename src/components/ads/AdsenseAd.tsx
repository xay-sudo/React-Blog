
// src/components/ads/AdsenseAd.tsx
"use client";

import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils'; // Added cn import

interface AdsenseAdProps {
  adClient: string; // Your AdSense publisher ID, e.g., "ca-pub-XXXXXXXXXXXXXXXX"
  adSlot: string;   // Your AdSense ad slot ID, e.g., "YYYYYYYYYY"
  adFormat?: string; // "auto", "rectangle", "vertical", "horizontal", etc.
  fullWidthResponsive?: boolean;
  className?: string;
  style?: CSSProperties;
  adLayoutKey?: string; // For in-feed ads or other special layouts
}

const AdsenseAd: React.FC<AdsenseAdProps> = ({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className,
  style = { display: 'block', textAlign: 'center' }, // Default style for the <ins> tag
  adLayoutKey,
}) => {
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdsenseAd: Error pushing ad to adsbygoogle queue", err);
      }
    }
  }, [adSlot]); // Re-run if adSlot changes (though typically fixed for a placement)

  // AdSense script might not be loaded yet or on initial server render
  if (typeof window === 'undefined' || !(window as any).adsbygoogle) {
    // This is the placeholder rendered on the server or if AdSense script fails to load/initialize
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-[100px] w-full bg-muted text-muted-foreground rounded-md p-4 my-4 border border-dashed",
          className // User-provided classes are merged here
        )}
        style={style} // User-provided styles are applied here
        aria-label="Advertisement loading or placeholder"
      >
        <p className="text-sm">Ad unit placeholder</p>
      </div>
    );
  }

  // This is the main ad container
  return (
    <div className={cn("my-4 overflow-hidden", className)} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }} // AdSense often requires display:block, specific ad styles are handled by AdSense
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-ad-layout-key={adLayoutKey}
        aria-label="Advertisement"
      ></ins>
    </div>
  );
};

export default AdsenseAd;
