const zlib = require("zlib");

/**
 * Fallback pure JS text extractor for PDF buffers when native modules are unavailable in serverless runtimes
 * @param {Buffer} buffer 
 * @returns {string}
 */
function fallbackExtractPdfText(buffer) {
  try {
    const rawStr = buffer.toString("binary");
    let extractedText = "";
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;

    while ((match = streamRegex.exec(rawStr)) !== null) {
      const streamData = Buffer.from(match[1], "binary");
      try {
        const decompressed = zlib.inflateSync(streamData).toString("utf8");
        extractedText += " " + decompressed;
      } catch (e) {
        extractedText += " " + match[1];
      }
    }

    // Extract text inside parentheses (TJ / Tj PDF operators)
    const cleaned = extractedText
      .replace(/\\(([^)]+)\\)/g, "$1 ")
      .replace(/[^\x20-\x7E\n\r]/g, " ")
      .replace(/\s+/g, " ");

    return cleaned.trim();
  } catch (err) {
    console.error("Fallback PDF extraction error:", err);
    return "";
  }
}

/**
 * Safely parses PDF buffer without crashing serverless runtimes
 * @param {Buffer} buffer 
 * @returns {Promise<{text: string}>}
 */
async function parsePdfBuffer(buffer) {
  if (!buffer) {
    throw new Error("PDF buffer is required for parsing");
  }

  try {
    const pdfParse = require("pdf-parse");
    const result = await pdfParse(buffer);
    if (result && result.text && result.text.trim()) {
      return result;
    }
  } catch (err) {
    console.warn("Primary pdf-parse module unavailable or failed in serverless runtime, engaging fallback extractor:", err.message);
  }

  // Use pure JS fallback extractor if primary module failed
  const fallbackText = fallbackExtractPdfText(buffer);
  if (!fallbackText) {
    throw new Error("Could not extract readable text from the uploaded PDF resume.");
  }

  return { text: fallbackText };
}

module.exports = parsePdfBuffer;
