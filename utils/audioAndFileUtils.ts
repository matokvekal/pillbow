/**
 * Audio utilities for playing notification sounds
 */

/**
 * Plays a notification sound
 * @param soundUrl - URL of the sound file to play
 */
export const playNotificationSound = async (soundUrl: string): Promise<void> => {
   try {
      const audio = new Audio(soundUrl);
      await audio.play();
   } catch (error) {
      console.debug('Audio playback failed:', error);
      // Silently fail - audio playback might be blocked by browser or user preferences
   }
};

/**
 * File utilities for handling file operations
 */

/**
 * Reads a file and converts it to base64 string
 * @param file - File to read
 * @returns Base64 encoded string without data URL prefix
 */
export const readFileAsBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
         try {
            const result = event.target?.result as string;
            const base64 = result.split(',')[1];
            if (!base64) {
               reject(new Error('Failed to extract base64 from file'));
               return;
            }
            resolve(base64);
         } catch (error) {
            reject(error);
         }
      };
      reader.onerror = () => {
         reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
   });
};
