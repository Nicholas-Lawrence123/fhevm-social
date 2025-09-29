// 测试文本加密解密逻辑
function textToNumber(text) {
  const textToEncrypt = text.length > 32 ? text.substring(0, 32) : text;
  let contentValue = BigInt(0);

  // Convert string to a large number using character codes
  for (let i = 0; i < textToEncrypt.length; i++) {
    contentValue = contentValue * BigInt(256) + BigInt(textToEncrypt.charCodeAt(i));
  }

  // Pad with content length info (last 8 bits)
  contentValue = (contentValue << BigInt(8)) | BigInt(text.length);

  return contentValue;
}

function numberToText(number) {
  const decryptedValue = BigInt(number);

  // Extract content length (last 8 bits)
  const contentLength = Number(decryptedValue & BigInt(0xFF));

  // Extract text content (remaining bits)
  let textValue = decryptedValue >> BigInt(8);
  let decryptedText = '';

  // Convert number back to string
  while (textValue > BigInt(0)) {
    const charCode = Number(textValue % BigInt(256));
    decryptedText = String.fromCharCode(charCode) + decryptedText;
    textValue = textValue / BigInt(256);
  }

  // If the decrypted text is shorter than the original length,
  // it means we truncated it during encryption
  const finalText = decryptedText.length >= contentLength
    ? decryptedText
    : decryptedText + `... (truncated, original length: ${contentLength})`;

  return finalText;
}

// 测试
const testTexts = [
  "Hello World!",
  "This is a test message.",
  "FHEVM加密测试中文内容",
  "Very long text that exceeds 32 characters and should be truncated during encryption but preserve full length information."
];

console.log("Testing text encryption/decryption:");
console.log("=====================================");

testTexts.forEach((text, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log(`Original: "${text}"`);
  console.log(`Length: ${text.length}`);

  const encrypted = textToNumber(text);
  console.log(`Encrypted: ${encrypted}`);

  const decrypted = numberToText(encrypted);
  console.log(`Decrypted: "${decrypted}"`);

  const success = text === decrypted || decrypted.includes("... (truncated");
  console.log(`Result: ${success ? "✅ PASS" : "❌ FAIL"}`);
});
