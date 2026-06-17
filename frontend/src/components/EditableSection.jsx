import { useState, useEffect } from 'react';

/**
 * Editable Content Block Component
 * Use this component to make any section editable from the admin panel
 *
 * @param {string} page - Page identifier (e.g., 'homepage', 'construction')
 * @param {string} section - Section identifier (e.g., 'hero', 'architecture')
 * @param {React.ReactNode} children - Content to render
 * @param {object} defaultContent - Default content structure
 *
 * @example
 * <EditableSection page="homepage" section="hero" defaultContent={{title: 'Hello'}}>
 *   <h1>{content.title}</h1>
 * </EditableSection>
 */
export function EditableSection({ page, section, children, defaultContent }) {
  const [content, setContent] = useState(defaultContent);
  const [isVisible, setIsVisible] = useState(defaultContent?.visible !== false);

  useEffect(() => {
    const loadContent = () => {
      const { loadPageContent } = require('../data/storage');
      const pageContent = loadPageContent();
      const sectionContent = pageContent?.[page]?.[section];
      if (sectionContent) {
        setContent(sectionContent);
        setIsVisible(sectionContent.visible !== false);
      }
    };

    loadContent();
    window.addEventListener('content-updated', loadContent);
    return () => window.removeEventListener('content-updated', loadContent);
  }, [page, section]);

  if (!isVisible) return null;

  return (
    <div data-cms-page={page} data-cms-section={section}>
      {typeof children === 'function' ? children(content) : children}
    </div>
  );
}

export default EditableSection;
