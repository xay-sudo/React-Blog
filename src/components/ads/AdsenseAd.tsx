// src/components/ads/AdsenseAd.tsx
"use client";

import type { CSSProperties } from 'react';
import { useEffect } from 'react';

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
  style = { display: 'block', textAlign: 'center' },
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
     // You could return a placeholder or null
    return (
      <div 
        className={className} 
        style={{ ...style, minHeight: '50px', backgroundColor: 'hsl(var(--muted))' }} // Placeholder style
        aria-label="Advertisement placeholder"
      >
        {/* Placeholder content can be added here if desired */}
      </div>
    );
  }
  
  return (
    <div className={cn("my-4 overflow-hidden", className)} style={{ ...style, minHeight: '50px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }} // AdSense often requires display:block
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-ad-layout-key={adLayoutKey}
      ></ins>
    </div>
  );
};

export default AdsenseAd;
