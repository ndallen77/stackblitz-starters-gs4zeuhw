import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

/**
 * PullQuoteBlock — atomic block-level node. Stores quote text and float direction.
 *
 * Attrs:
 *   text  — the quote string (independent copy, not a reference into source paragraph)
 *   float — "left" | "right" — controls which side the quote floats to
 *
 * Rendered in the editor via a React NodeView so reviewers get inline editing
 * (textarea for the text, button to toggle float, button to delete).
 *
 * On serialization, renders as <div data-type="pull-quote" data-float="..."> with
 * the text as the only child — straightforward for the published-page renderer to consume.
 */

const PullQuoteView = ({ node, updateAttributes, deleteNode }) => {
  const { text, float } = node.attrs;

  return (
    <NodeViewWrapper
      className="pq-wrapper"
      data-float={float}
      // contentEditable=false prevents ProseMirror from trying to manage the NodeView's DOM
      contentEditable={false}
    >
      <div className="pq-controls">
        <span className="pq-label">Pull Quote</span>
        <div>
          <button
            onClick={() => updateAttributes({ float: float === 'right' ? 'left' : 'right' })}
            title="Toggle float direction"
          >
            {float === 'right' ? '← float left' : 'float right →'}
          </button>
          <button onClick={deleteNode} title="Delete pull quote">×</button>
        </div>
      </div>
      <textarea
        className="pq-text"
        value={text}
        onChange={(e) => updateAttributes({ text: e.target.value })}
        placeholder="Pull quote text…"
      />
    </NodeViewWrapper>
  );
};

export const PullQuoteBlock = Node.create({
  name: 'pullQuoteBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      text: { default: '' },
      float: { default: 'right' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pull-quote"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'pull-quote',
        'data-float': node.attrs.float,
      }),
      node.attrs.text,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PullQuoteView);
  },
});
