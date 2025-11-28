import React, { useRef, useEffect, useState } from 'react';

export default function ClinicalNotes({ value = '', onChange = () => {}, placeholder = 'Escribe las notas médicas...' }) {
  const editorRef = useRef(null);
  const [html, setHtml] = useState(value || '');

  useEffect(() => {
    setHtml(value || '');
  }, [value]);

  useEffect(() => {
    // initialize content
    if (editorRef.current && html !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = html;
    }
  }, [editorRef, html]);

  const exec = (command, value = null) => {
    try {
      document.execCommand(command, false, value);
      triggerChange();
      editorRef.current.focus();
    } catch (e) {
      console.warn('execCommand failed', e);
    }
  };

  const triggerChange = () => {
    const content = editorRef.current ? editorRef.current.innerHTML : '';
    setHtml(content);
    onChange(content);
  };

  const handleInput = () => {
    triggerChange();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleAddLink = () => {
    const url = window.prompt('Insertar URL');
    if (url) exec('createLink', url);
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      triggerChange();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-2">
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('bold')} title="Negrita">B</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('italic')} title="Cursiva">I</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('underline')} title="Subrayado">U</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertUnorderedList')} title="Lista">•</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertOrderedList')} title="Lista numerada">1.</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={handleAddLink} title="Insertar link">Link</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('formatBlock', '<BLOCKQUOTE>')} title="Cita">"</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={handleClear} title="Limpiar">Limpiar</button>
      </div>

      <div
        ref={editorRef}
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[160px] border rounded p-3 bg-white text-sm focus:outline-none focus:ring"
        data-placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}
