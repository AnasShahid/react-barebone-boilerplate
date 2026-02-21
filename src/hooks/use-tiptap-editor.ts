import { useMemo } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';

export function useTiptapEditor(providedEditor?: Editor | null): Editor | null {
  const { editor: coreEditor } = useCurrentEditor();
  return useMemo(() => providedEditor ?? coreEditor, [providedEditor, coreEditor]);
}
