import { useEffect } from 'react';

/**
 * Sets document.title for the lifetime of the component and restores the
 * previous title on unmount. Used by the auxiliary route pages.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
