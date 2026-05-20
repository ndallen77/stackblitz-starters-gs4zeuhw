import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

/**
 * ImageBlock — atomic block-level node for screenshots and illustrations.
 *
 * Attrs:
 *   url     — CDN URL of the image (file upload will replace this in production)
 *   alt     — alt text (required for accessibility, not enforced at schema level)
 *   caption — caption string, rendered below the image
 *
 * NodeView shows the live preview, plus three editable fields. In production the URL
 * field would be a file upload dropzone; for the sandbox, paste any image URL.
 */

const ImageBlockView = ({ node, updateAttributes, deleteNode }) => {
  const { url, alt, caption } = node.attrs;

  return (
    <NodeViewWrapper className="img-wrapper" contentEditable={false}>
      <div className="img-controls">
        <span className="img-label">Image Block</span>
        <button onClick={deleteNode} title="Delete image">×</button>
      </div>
      {url ? (
        <img src={url} alt={alt} className="img-preview" />
      ) : (
        <div className="img-placeholder">No image URL set</div>
      )}
      <input
        className="img-input"
        type="text"
        value={url}
        onChange={(e) => updateAttributes({ url: e.target.value })}
        placeholder="Image URL…"
      />
      <input
        className="img-input"
        type="text"
        value={alt}
        onChange={(e) => updateAttributes({ alt: e.target.value })}
        placeholder="Alt text (required)…"
      />
      <input
        className="img-input img-caption"
        type="text"
        value={caption}
        onChange={(e) => updateAttributes({ caption: e.target.value })}
        placeholder="Caption…"
      />
    </NodeViewWrapper>
  );
};

export const ImageBlock = Node.create({
  name: 'imageBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: '' },
      alt: { default: '' },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-type="image-block"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const children = [];
    if (node.attrs.url) {
      children.push(['img', { src: node.attrs.url, alt: node.attrs.alt }]);
    }
    if (node.attrs.caption) {
      children.push(['figcaption', node.attrs.caption]);
    }
    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-type': 'image-block' }),
      ...children,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView);
  },
});
