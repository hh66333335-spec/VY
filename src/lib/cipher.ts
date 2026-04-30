/**
 * CipherService - AES-256 End-to-End Encryption
 * Implementation using Web Crypto API (SubtleCrypto)
 */

export class CipherService {
  private static ALGO = 'AES-GCM';
  private static KEY_LENGTH = 256;

  /**
   * Generates a new 256-bit AES key for symmetric encryption
   */
  static async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: this.ALGO,
        length: this.KEY_LENGTH,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Exports a key to a base64 string for storage
   */
  static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Imports a key from a base64 string
   */
  static async importKey(base64Key: string): Promise<CryptoKey> {
    const rawKey = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      this.ALGO,
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts a message using AES-GCM
   */
  static async encrypt(message: string, key: CryptoKey): Promise<{ cipher: string; iv: string }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // IV should be 12 bytes for GCM

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: this.ALGO,
        iv: iv,
      },
      key,
      data
    );

    return {
      cipher: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  }

  /**
   * Decrypts a message using AES-GCM
   */
  static async decrypt(cipher: string, iv: string, key: CryptoKey): Promise<string> {
    const cipherData = Uint8Array.from(atob(cipher), c => c.charCodeAt(0));
    const ivData = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: this.ALGO,
        iv: ivData,
      },
      key,
      cipherData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}
