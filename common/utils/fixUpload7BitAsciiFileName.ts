
export function fixUpload7BitAsciiFileName(filename: string) {
  const from = Buffer.from(filename, "ascii");
  const fixedString = from.toString();
  return fixedString;
}
