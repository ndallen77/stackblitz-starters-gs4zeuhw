import { Mark, mergeAttributes } from '@tiptap/core';

/**
 * GlossaryMark — inline mark for annotating text with a glossary term.
 *
 * Attrs:
 *   termId — integer FK to glossary_terms.term_id
 *   term   — surface form of the marked text (denormalized for query convenience)
 *
 * Renders as <span data-type="glossary" data-term-id="..." data-term="..." class="glossary-mark">.
 * The dotted-underline visual style is in styles.css.
 */
export const GlossaryMark = Mark.create({
  name: 'glossaryMark',

  addAttributes() {
    return {
      termId: {
        default: null,
        parseHTML: (el) => {
          const v = el.getAttribute('data-term-id');
          return v ? parseInt(v, 10) : null;
        },
        renderHTML: (attrs) =>
          attrs.termId != null ? { 'data-term-id': attrs.termId } : {},
      },
      term: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-term') || '',
        renderHTML: (attrs) =>
          attrs.term ? { 'data-term': attrs.term } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="glossary"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'glossary',
        class: 'glossary-mark',
      }),
      0,
    ];
  },
});
