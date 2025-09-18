// Storage utility functions
export const storage = {
  // Get data from storage
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? null;
    } catch (error) {
      console.error("Error reading from storage:", error);
      return null;
    }
  },

  // Save data to storage
  async set(key: string, value: any): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error("Error writing to storage:", error);
    }
  },

  // Remove data from storage
  async remove(key: string): Promise<void> {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.error("Error removing from storage:", error);
    }
  },

  // Clear all storage
  async clear(): Promise<void> {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
