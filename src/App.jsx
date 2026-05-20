import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { GlossaryMark } from './extensions/GlossaryMark.js';
import { PullQuoteBlock } from './extensions/PullQuoteBlock.jsx';
import { ImageBlock } from './extensions/ImageBlock.jsx';

import Toolbar from './components/Toolbar.jsx';
import { SEED_DOC } from './seedDoc.js';

const STORAGE_KEY = 'kaleidos.article_body.v1';
const AUTOSAVE_MS = 800;

/**
 * Loads the document from localStorage if present, otherwise returns the seed.
 * Wrapped in try/catch because parsing user-edited or corrupted localStorage
 * shouldn't crash the editor.
 */
function loadInitialDoc() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.warn('Failed to load saved doc, falling back to seed:', err);
  }
  return SEED_DOC;
}

export default function App() {
  const [jsonOutput, setJsonOutput] = useState('');
  const [showJson, setShowJson] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'dirty' | 'saving'
  const saveTimer = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, GlossaryMark, PullQuoteBlock, ImageBlock],
    content: loadInitialDoc(),
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setJsonOutput(JSON.stringify(json, null, 2));
      setSaveStatus('dirty');

      // Debounced autosave to localStorage
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
          setSaveStatus('saved');
        } catch (err) {
          console.error('Autosave failed:', err);
          setSaveStatus('dirty');
        }
      }, AUTOSAVE_MS);
    },
  });

  // Initial JSON snapshot once the editor exists
  useEffect(() => {
    if (editor) setJsonOutput(JSON.stringify(editor.getJSON(), null, 2));
  }, [editor]);

  const exportJson = () => {
    if (!editor) return;
    const blob = new Blob([JSON.stringify(editor.getJSON(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `article-body-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToSeed = () => {
    if (!editor) return;
    if (!confirm('Reset to seed document? Your saved work will be replaced.')) return;
    editor.commands.setContent(SEED_DOC);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DOC));
      setSaveStatus('saved');
    } catch (err) {
      console.error('Reset save failed:', err);
    }
  };

  const clearStorage = () => {
    if (!confirm('Clear all saved drafts from localStorage?')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      alert('Cleared. Reload the page to reset to the seed document.');
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  return (
    <>
      <header className="kal-header">
        <div>
          <h1 className="kal-title">Kaleidos Editor — TipTap Sandbox</h1>
          <div className="kal-subtitle">
            v0.3 · Real TipTap · React NodeViews · localStorage persistence
          </div>
        </div>
        <div className="kal-header-actions">
          <span className={`save-status ${saveStatus}`}>
            {saveStatus === 'saved' ? '● saved' : '● unsaved'}
          </span>
          <button className="header-btn" onClick={exportJson} title="Download JSON">
            Export JSON
          </button>
          <button className="header-btn" onClick={resetToSeed} title="Reset to seed document">
            Reset
          </button>
          <button className="header-btn danger" onClick={clearStorage} title="Clear localStorage">
            Clear Storage
          </button>
        </div>
      </header>

      <div className="kal-layout">
        <div className="editor-pane">
          <div className="editor-label">Article Body — TipTap</div>
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>

        <aside className="json-pane">
          <div className="json-header">
            <span className="json-label">article_body JSON</span>
            <button className="json-toggle" onClick={() => setShowJson(!showJson)}>
              {showJson ? 'hide' : 'show'}
            </button>
          </div>
          {showJson && <pre className="json-body">{jsonOutput}</pre>}
          <div className="legend">
            <div><strong>Persistence:</strong> Your work autosaves to localStorage every {AUTOSAVE_MS}ms after you stop typing.</div>
            <div style={{ marginTop: 6 }}><strong>Try:</strong> Edit a pull quote inline, refresh the page, see your changes survive.</div>
            <div style={{ marginTop: 6 }}><strong>Try:</strong> Select "Sleeper" and click <em>Gloss+</em>. Watch the JSON.</div>
            <div style={{ marginTop: 6 }}><strong>Try:</strong> Type inside the glossary-marked "Sleeper" — the mark survives.</div>
            <div style={{ marginTop: 6 }}><strong>Try:</strong> Click into the image block, paste any image URL, see live preview.</div>
          </div>
        </aside>
      </div>
    </>
  );
}
