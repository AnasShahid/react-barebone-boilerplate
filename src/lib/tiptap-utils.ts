import type { Editor } from '@tiptap/react';
import type { Node, Mark } from '@tiptap/pm/model';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Checks if a mark exists in the editor schema
 */
export const isMarkInSchema = (markName: string, editor: Editor | null): boolean => {
  if (!editor?.schema) return false;
  return editor.schema.spec.marks.get(markName) !== undefined;
};

/**
 * Checks if a node exists in the editor schema
 */
export const isNodeInSchema = (nodeName: string, editor: Editor | null): boolean => {
  if (!editor?.schema) return false;
  return editor.schema.spec.nodes.get(nodeName) !== undefined;
};

/**
 * Gets the active attributes of a specific mark in the current editor selection.
 */
export function getActiveMarkAttrs(
  editor: Editor | null,
  markName: string
): Record<string, unknown> | null {
  if (!editor) return null;
  const { state } = editor;
  const marks: readonly Mark[] = state.storedMarks ?? state.selection.$from.marks();
  const mark = marks.find((m) => m.type.name === markName);
  return mark?.attrs ?? null;
}

/**
 * Checks if a node is empty
 */
export function isEmptyNode(node: Node | null | undefined): boolean {
  return !!node && node.content.size === 0;
}

interface FindNodePositionProps {
  editor: Editor | null;
  node?: Node | null;
  nodePos?: number | null;
}

interface NodePosition {
  pos: number;
  node: Node;
}

/**
 * Finds the position and instance of a node in the document
 */
export function findNodePosition(props: FindNodePositionProps): NodePosition | null {
  const { editor, node, nodePos } = props;

  if (!editor || !editor.state?.doc) return null;

  const hasValidNode = node !== undefined && node !== null;
  const hasValidPos = nodePos !== undefined && nodePos !== null;

  if (!hasValidNode && !hasValidPos) return null;

  if (hasValidPos && nodePos !== null && nodePos !== undefined) {
    try {
      const nodeAtPos = editor.state.doc.nodeAt(nodePos);
      if (nodeAtPos) {
        return { pos: nodePos, node: nodeAtPos };
      }
    } catch (error) {
      console.error('Error checking node at position:', error);
      return null;
    }
  }

  let foundPos = -1;
  let foundNode: Node | null = null;

  editor.state.doc.descendants((currentNode, pos) => {
    if (currentNode === node) {
      foundPos = pos;
      foundNode = currentNode;
      return false;
    }
    return true;
  });

  return foundPos !== -1 && foundNode !== null ? { pos: foundPos, node: foundNode } : null;
}

interface UploadProgress {
  progress: number;
}

/**
 * Handles image upload with progress tracking and abort capability
 */
export const handleImageUpload = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  if (!file) throw new Error('No file provided');

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
  }

  for (let progress = 0; progress <= 100; progress += 10) {
    if (abortSignal?.aborted) throw new Error('Upload cancelled');
    await new Promise((resolve) => setTimeout(resolve, 500));
    onProgress?.({ progress });
  }

  return '/images/placeholder-image.png';
};

/**
 * Converts a File to base64 string
 */
export const convertFileToBase64 = (file: File, abortSignal?: AbortSignal): Promise<string> => {
  if (!file) return Promise.reject(new Error('No file provided'));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const abortHandler = () => {
      reader.abort();
      reject(new Error('Upload cancelled'));
    };

    if (abortSignal) {
      abortSignal.addEventListener('abort', abortHandler);
    }

    reader.onloadend = () => {
      if (abortSignal) {
        abortSignal.removeEventListener('abort', abortHandler);
      }
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert File to base64'));
      }
    };

    reader.onerror = (error) => reject(new Error(`File reading error: ${String(error)}`));
    reader.readAsDataURL(file);
  });
};
