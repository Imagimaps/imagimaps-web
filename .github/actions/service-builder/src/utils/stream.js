/**
 * Converts a readable stream to a string.
 * @param {ReadableStream} stream - The readable stream to convert.
 * @param {number} [timeout_ms=0] - The timeout in milliseconds for reading the stream.
 * @returns {Promise<string>} - A promise that resolves with the string representation of the stream.
 */
const readStreamToString = async (stream, timeout_ms = 0) => {
  return new Promise((resolve, reject) => {
    let chuncks = [];

    stream.on('data', chunk => {
      chuncks.push(Buffer.from(chunk));
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chuncks).toString('utf8'));
    });

    stream.on('error', error => {
      reject(error);
    });

    if (timeout_ms > 0) {
      setTimeout(() => {
        reject(new Error('Stream read timeout'));
      }, timeout_ms);
    }
  });
};

export { readStreamToString };
