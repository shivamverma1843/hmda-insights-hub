// Streaming CSV parser for large HMDA LAR files.
// Handles quoted fields, embedded delimiters/newlines, and chunk boundaries.
// Reads the file in chunks so memory stays flat (only aggregated state is kept).

export async function streamCsv(file, { onRow, onProgress, chunkSize = 8 * 1024 * 1024 } = {}) {
  // Auto-detect delimiter from the first line.
  const peekText = await file.slice(0, 65536).text();
  const firstLine = (peekText.split("\n")[0] || "").trim();
  const commas = (firstLine.match(/,/g) || []).length;
  const pipes = (firstLine.match(/\|/g) || []).length;
  const delimiter = pipes > commas ? "|" : ",";

  const decoder = new TextDecoder();
  const total = file.size;
  let offset = 0;
  let buffer = "";
  let header = null;
  let rowIndex = 0;

  let field = "";
  let inQuotes = false;
  let row = [];

  const emitRow = () => {
    row.push(field);
    field = "";
    const r = row;
    row = [];
    if (!header) {
      header = r;
    } else {
      rowIndex++;
      onRow(header, r, rowIndex);
    }
  };

  while (offset < total) {
    const slice = file.slice(offset, offset + chunkSize);
    const buf = await slice.arrayBuffer();
    offset += buf.byteLength;
    buffer += decoder.decode(buf, { stream: true });

    let i = 0;
    const len = buffer.length;
    while (i < len) {
      const ch = buffer[i];
      if (inQuotes) {
        if (ch === '"') {
          if (buffer[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          inQuotes = false;
          i++;
          continue;
        }
        field += ch;
        i++;
      } else {
        if (ch === '"') {
          inQuotes = true;
          i++;
          continue;
        }
        if (ch === delimiter) {
          row.push(field);
          field = "";
          i++;
          continue;
        }
        if (ch === "\r") {
          i++;
          continue;
        }
        if (ch === "\n") {
          emitRow();
          i++;
          continue;
        }
        field += ch;
        i++;
      }
    }
    buffer = "";

    if (onProgress) onProgress(offset / total);
    // Yield to the UI thread so it stays responsive.
    await new Promise((r) => setTimeout(r, 0));
  }

  // Flush any trailing partial row.
  if (field !== "" || row.length > 0) {
    emitRow();
  }
}