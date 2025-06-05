
"use client";

import { useEffect, useRef } from 'react';

interface HeadInjectorClientProps {
  htmlString: string;
}

const HeadInjectorClient: React.FC<HeadInjectorClientProps> = ({ htmlString }) => {
  const injectedNodes = useRef<Node[]>([]);

  useEffect(() => {
    if (htmlString && typeof window !== 'undefined' && document.head) {
      // Clear previously injected nodes by this instance to handle changes or prevent duplication
      injectedNodes.current.forEach(node => {
        if (document.head.contains(node)) {
          document.head.removeChild(node);
        }
      });
      injectedNodes.current = [];

      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlString; // Parse the string into DOM nodes
      
      const nodesToInject: Node[] = [];
      // Append children of tempContainer to head, not tempContainer itself
      while (tempContainer.firstChild) {
        const node = tempContainer.firstChild;
        nodesToInject.push(node);
        document.head.appendChild(node);
      }
      injectedNodes.current = nodesToInject;
    }

    // Cleanup function: remove injected nodes when the component unmounts
    // or when htmlString changes causing the effect to re-run.
    return () => {
      injectedNodes.current.forEach(node => {
        if (document.head.contains(node)) {
          document.head.removeChild(node);
        }
      });
      injectedNodes.current = [];
    };
  }, [htmlString]); // Re-run effect if htmlString changes

  return null; // This component does not render any visible DOM elements itself
};

export default HeadInjectorClient;
