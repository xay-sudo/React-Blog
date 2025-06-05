
"use client";

import { useEffect, useRef } from 'react';

interface HeadInjectorClientProps {
  htmlStrings: string[]; // Changed to accept an array of strings
}

const HeadInjectorClient: React.FC<HeadInjectorClientProps> = ({ htmlStrings }) => {
  const injectedNodes = useRef<Node[]>([]);

  useEffect(() => {
    // Clear previously injected nodes by this instance to handle changes or prevent duplication
    injectedNodes.current.forEach(node => {
      if (document.head && document.head.contains(node)) {
        document.head.removeChild(node);
      }
    });
    injectedNodes.current = [];

    if (htmlStrings && htmlStrings.length > 0 && typeof window !== 'undefined' && document.head) {
      const newNodes: Node[] = [];
      htmlStrings.forEach(htmlString => {
        if (htmlString) { // Process only non-empty strings
          const tempContainer = document.createElement('div');
          tempContainer.innerHTML = htmlString; // Parse the string into DOM nodes
          
          // Append children of tempContainer to head, not tempContainer itself
          while (tempContainer.firstChild) {
            const node = tempContainer.firstChild;
            newNodes.push(node);
            document.head.appendChild(node);
          }
        }
      });
      injectedNodes.current = newNodes;
    }

    // Cleanup function: remove injected nodes when the component unmounts
    // or when htmlStrings change causing the effect to re-run.
    return () => {
      injectedNodes.current.forEach(node => {
        if (document.head && document.head.contains(node)) {
          document.head.removeChild(node);
        }
      });
      injectedNodes.current = [];
    };
  }, [htmlStrings]); // Re-run effect if htmlStrings array changes

  return null; // This component does not render any visible DOM elements itself
};

export default HeadInjectorClient;
