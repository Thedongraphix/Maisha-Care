/**
 * Clear the stored consultation ID from localStorage
 * Used when starting a new session or when a consultation ID is invalid
 */
export function clearConsultationId(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('maisha_consultation_id');
    console.log('Cleared consultation ID from localStorage');
  }
}

/**
 * Get the current consultation ID from localStorage
 * @returns The consultation ID or null if not found
 */
export function getConsultationId(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('maisha_consultation_id');
  }
  return null;
}

/**
 * Save a consultation ID to localStorage
 * @param id The consultation ID to save
 */
export function saveConsultationId(id: string): void {
  if (typeof window !== 'undefined' && window.localStorage && id) {
    localStorage.setItem('maisha_consultation_id', id);
    console.log('Saved consultation ID to localStorage:', id);
  }
}

/**
 * Reset the chat state - clear consultation ID and prepare for a new chat
 * Call this when starting a completely new conversation
 */
export function resetChatState(): void {
  clearConsultationId();
  // Additional reset logic can be added here if needed
} 