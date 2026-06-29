const pdfParse = require("pdf-parse");

/**
 * Parses PDF file buffer to extract raw text content cleanly
 * @param {Buffer} buffer 
 * @returns {Promise<Object>}
 */
async function parsePdfBuffer(buffer) {
  if (!buffer) {
    throw new Error("PDF buffer is required for parsing");
  }
  return await pdfParse(buffer);
}

module.exports = parsePdfBuffer;
