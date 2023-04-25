import { EDITOR_MODE } from './constants'

/**
 * Provides annotation object ID (`data-sb-object-id`) for the document based on
 * context
 *
 * @param id Unique value representing the object in the content source
 * @returns Props to be spread on the element based on context
 */
export function objectId(id: string) {
  if (!EDITOR_MODE) return {}
  return { 'data-sb-object-id': id }
}

/**
 * Provides annotation field path object (`data-sb-field-path`) for the document
 * based on context
 *
 * @param fieldPath Path to use for the field
 * @returns Props to be spread on the element based on context
 */
export function fieldPath(fieldPath: string) {
  if (!EDITOR_MODE) return {}
  return { 'data-sb-field-path': fieldPath }
}
