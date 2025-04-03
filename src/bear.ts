/**
 * Bear client used to interact with the Bear app via x-callback-url scheme.
 */
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Bear client class that provides methods to interact with the Bear app.
 */
export class BearClient {
  /**
   * Create a new note in Bear.
   * 
   * @param params - Parameters for creating a note
   * @param params.title - Title of the note
   * @param params.text - Text content of the note (supports Markdown)
   * @param params.tags - Tags for the note (optional)
   * @returns Promise with the result of the operation
   */
  async createNote({ title, text, tags }: { title: string; text: string; tags?: string[] }): Promise<any> {
    try {
      if (!title || !text) {
        throw new Error("Title and text are required");
      }

      // Prepare the URL parameters
      const params = new URLSearchParams();
      params.append("title", title);
      params.append("text", text);
      
      if (tags && tags.length > 0) {
        params.append("tags", tags.join(","));
      }

      // Create the x-callback-url
      const xcallbackUrl = `bear://x-callback-url/create?${params.toString()}`;
      
      // Open the URL using macOS open command
      await execPromise(`open "${xcallbackUrl}"`);
      
      return {
        success: true,
        message: "Note created successfully in Bear"
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * Open a note in Bear by its title or id.
   * 
   * @param params - Parameters for opening a note
   * @param params.title - Title of the note to open (mutually exclusive with id)
   * @param params.id - ID of the note to open (mutually exclusive with title)
   * @returns Promise with the result of the operation
   */
  async openNote({ title, id }: { title?: string; id?: string }): Promise<any> {
    try {
      if (!title && !id) {
        throw new Error("Either title or id must be provided");
      }

      // Prepare the URL parameters
      const params = new URLSearchParams();
      if (title) {
        params.append("title", title);
      } else if (id) {
        params.append("id", id);
      }

      // Create the x-callback-url
      const xcallbackUrl = `bear://x-callback-url/open-note?${params.toString()}`;
      
      // Open the URL using macOS open command
      await execPromise(`open "${xcallbackUrl}"`);
      
      return {
        success: true,
        message: "Note opened successfully in Bear"
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * Search for notes in Bear.
   * 
   * @param params - Parameters for searching notes
   * @param params.term - Search term
   * @param params.tag - Specific tag to search in (optional)
   * @returns Promise with the result of the operation
   */
  async searchNotes({ term, tag }: { term: string; tag?: string }): Promise<any> {
    try {
      if (!term) {
        throw new Error("Search term is required");
      }

      // Prepare the URL parameters
      const params = new URLSearchParams();
      params.append("term", term);
      
      if (tag) {
        params.append("tag", tag);
      }

      // Create the x-callback-url
      const xcallbackUrl = `bear://x-callback-url/search?${params.toString()}`;
      
      // Open the URL using macOS open command
      await execPromise(`open "${xcallbackUrl}"`);
      
      return {
        success: true,
        message: "Search executed successfully in Bear"
      };
    } catch (e) {
      throw e;
    }
  }
}