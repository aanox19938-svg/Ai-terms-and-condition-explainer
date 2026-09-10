import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

export const parserService = {
  /**
   * Extract plain text from uploaded file buffer or path
   */
  extractFromFile: async (file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    let text = '';

    if (ext === 'pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text || '';
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value || '';
    } else if (ext === 'txt') {
      text = fs.readFileSync(file.path, 'utf-8');
    } else {
      throw new Error(`Unsupported file type: .${ext}. Please upload a PDF or DOCX file.`);
    }

    // Clean up temporary uploaded file
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (e) {
      console.warn('Could not delete temp file:', e.message);
    }

    return parserService.cleanText(text);
  },

  /**
   * Clean and normalize legal text
   */
  cleanText: (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
};
