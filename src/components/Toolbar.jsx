import React, { useCallback } from 'react';

export default function Toolbar({ editor }) {
  const applyGlossary = useCallback(() => {
    if (!editor) return;
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      alert('Select some text first, then apply a glossary mark.');
      return;
    }
    const selectedText = editor.state.doc.textBetween(from, to);
    const idStr = prompt(
      `Create glossary mark for "${selectedText}".\n\nEnter a term ID (integer FK to glossary_terms):`,
      '142'
    );
    if (!idStr) return;
    editor
      .chain()
      .focus()
      .setMark('glossaryMark', { termId: parseInt(idStr, 10), term: selectedText })
      .run();
  }, [editor]);

  const removeGlossary = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetMark('glossaryMark').run();
  }, [editor]);

  const insertPullQuote = useCallback(() => {
    if (!editor) return;
    const { from, to, empty } = editor.state.selection;
    const text = empty
      ? 'New pull quote — edit me.'
      : editor.state.doc.textBetween(from, to);
    editor.chain().focus().insertContent({
      type: 'pullQuoteBlock',
      attrs: { text, float: 'right' },
    }).run();
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent({
      type: 'imageBlock',
      attrs: { url: '', alt: '', caption: '' },
    }).run();
  }, [editor]);

  if (!editor) return <div className="toolbar" />;

  const Btn = ({ active, onClick, title, children }) => (
    <button
      className={`tb-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className="toolbar">
      <div className="tb-group">
        <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">B</Btn>
        <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">I</Btn>
      </div>
      <div className="tb-divider" />
      <div className="tb-group">
        <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">H2</Btn>
        <Btn active={editor.isActive('paragraph') && !editor.isActive('heading')} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraph">¶</Btn>
        <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">"</Btn>
      </div>
      <div className="tb-divider" />
      <div className="tb-group">
        <Btn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">•</Btn>
        <Btn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1.</Btn>
      </div>
      <div className="tb-divider" />
      <div className="tb-group">
        <Btn active={editor.isActive('glossaryMark')} onClick={applyGlossary} title="Apply glossary mark to selection">Gloss+</Btn>
        <Btn active={false} onClick={removeGlossary} title="Remove glossary mark">Gloss−</Btn>
      </div>
      <div className="tb-divider" />
      <div className="tb-group tb-group-custom">
        <Btn active={false} onClick={insertPullQuote} title="Insert pull quote block">❝ Pull Quote</Btn>
        <Btn active={false} onClick={insertImage} title="Insert image block">▢ Image</Btn>
      </div>
    </div>
  );
}
