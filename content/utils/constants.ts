// When in editor mode, draft content is shown and validations are displayed on
// the screen. Otherwise, we don't show draft content and validation failures
// throw errors.
export const EDITOR_MODE = process.env.EDITOR_MODE === 'true'
