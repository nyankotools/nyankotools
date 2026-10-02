import { describe, expect, it } from 'vitest';
import {
  decodeCertificates,
  extractDerCertificates,
  validityStatus,
} from './x509-decoder';

// openssl で生成した自己署名証明書（ECDSA P-256、拡張あり）
const EC_PEM = `-----BEGIN CERTIFICATE-----
MIICPDCCAeKgAwIBAgIUZCoB8yydS/zoOvpJXLPgDqsTi/kwCgYIKoZIzj0EAwIw
OjELMAkGA1UEBhMCSlAxFDASBgNVBAoMC055YW5rbyBUZXN0MRUwEwYDVQQDDAxl
eGFtcGxlLnRlc3QwHhcNMjYxMDAyMDgyMDM0WhcNMzYwOTI5MDgyMDM0WjA6MQsw
CQYDVQQGEwJKUDEUMBIGA1UECgwLTnlhbmtvIFRlc3QxFTATBgNVBAMMDGV4YW1w
bGUudGVzdDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABK+Tu1ML8n36Uy8dj1In
v1O7VB00gY2ndhAxpMpxlGCe/C6tXiC6cw8TwXzlXjAg61ehqp3/CGwzJS4gJt+M
HfGjgcUwgcIwHQYDVR0OBBYEFJhCWqcx/NAt8KJUcZze6oiSAmi1MB8GA1UdIwQY
MBaAFJhCWqcx/NAt8KJUcZze6oiSAmi1MD0GA1UdEQQ2MDSCDGV4YW1wbGUudGVz
dIIOKi5leGFtcGxlLnRlc3SHBMCoAAGBDmFAZXhhbXBsZS50ZXN0MA4GA1UdDwEB
/wQEAwIHgDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwEgYDVR0TAQH/
BAgwBgEB/wIBAjAKBggqhkjOPQQDAgNIADBFAiBgpwNoQhijsMOcRsuusxh/LlsK
Hgbnyk18qgPA550w1QIhAObsaqPv65RNPNfLToYm70tQ2AVFOvik7yKmR1O4MXUv
-----END CERTIFICATE-----`;

// openssl で生成した自己署名証明書（RSA 2048）
const RSA_PEM = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIUEwp5wNajnEDtdG0nJWRtOFEAqfkwDQYJKoZIhvcNAQEL
BQAwEzERMA8GA1UEAwwIcnNhLnRlc3QwHhcNMjYxMDAyMDgyMDM0WhcNMjcxMDAy
MDgyMDM0WjATMREwDwYDVQQDDAhyc2EudGVzdDCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAPS2Uh60+nZjtHJ/5+JwsXlE5wO8bgN6N3ySdjMJxgYSnfjq
MwiyhfNDwhHu0VboSL4yavbJmfluSEjrWoCi72noGlVkm27iljAoS2XC08l4LNXK
rMV2++ajTPsBsNOY2EecvC/mXbCrXlf1DS1g/Lriq8GaUR9j/75e4uHkM/YuVBNx
BsWCNnA0opP5O9Vg1AZJ5H+WPP6VyOZfeI5rNjuLkD/46cD3PMFMsUXjenn6kee4
gV1IKB4mqtPLI/Ta14NgJLymv0xdJG/eQRsv+NTKLhUrSi4MUM9pVxd4AgLS9uVh
btORXhnJcj4xA9eNML5dQvecf+w4uklFzUiYkRkCAwEAAaNTMFEwHQYDVR0OBBYE
FHe8HUbRPo1m1YKx5dKI7wVoL8GOMB8GA1UdIwQYMBaAFHe8HUbRPo1m1YKx5dKI
7wVoL8GOMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAEQ18hLb
JgVVJ1PzChl6sZ5p2ioMP1ddIR7u1o7I/TeoL2ALqLBWzJovK44A1JCeCStb4eO8
I4R4EUDO5mI4UTZ0LzkClngIeKUq+iaTD4tl/nEanBLuO50Y6FtmQ6HkqTmpjd5I
BH/IViqCrA8RZ6/bpo2LwcbHSKW236HAQzJ4lmBFQ9F+e39UEAzk3Th8ma2en+75
TKkfMImQyhHq7ocfZh/YxpHADiIo5Ho0p94wXXqMXkuFUjePNfWkjWZIaU5HQ/o+
pxE/PmiRORIQh8tkyoT9sPNs9lZjgN4nHqnZutk0R0/zwAWV7iXbwDXevN+Z+MBD
13C4JNnp12CqKzg=
-----END CERTIFICATE-----`;

async function decodeOne(pem: string) {
  const result = await decodeCertificates(pem);
  if (!result.success) throw new Error(result.error);
  return result.certificates[0];
}

describe('decodeCertificates (EC)', () => {
  it('基本項目を openssl の出力と同じ値で解析する', async () => {
    const cert = await decodeOne(EC_PEM);
    expect(cert.version).toBe(3);
    expect(cert.serialNumber).toBe('642A01F32C9D4BFCE83AFA495CB3E00EAB138BF9');
    expect(cert.signatureAlgorithm).toBe('ecdsa-with-SHA256');
    expect(cert.subject).toEqual([
      { name: 'C', value: 'JP' },
      { name: 'O', value: 'Nyanko Test' },
      { name: 'CN', value: 'example.test' },
    ]);
    expect(cert.issuer).toEqual(cert.subject);
    expect(cert.notBefore.toISOString()).toBe('2026-10-02T08:20:34.000Z');
    expect(cert.notAfter.toISOString()).toBe('2036-09-29T08:20:34.000Z');
    expect(cert.publicKeyAlgorithm).toBe('EC');
    expect(cert.publicKeyBits).toBe(256);
    expect(cert.publicKeyDetail).toBe('prime256v1 (P-256)');
  });

  it('フィンガープリントが openssl の出力と一致する', async () => {
    const cert = await decodeOne(EC_PEM);
    expect(cert.sha256Fingerprint).toBe(
      '1F:49:7C:46:13:B4:86:09:3C:F7:B1:51:D1:35:30:D8:4C:A2:D5:27:33:52:F3:F1:DA:F6:88:52:92:E7:5F:54',
    );
    expect(cert.sha1Fingerprint).toBe(
      'EC:40:35:6B:DD:CA:29:82:39:FE:8E:C6:6A:E0:B6:60:67:12:0D:35',
    );
  });

  it('拡張（SAN・鍵用途・基本制約など）を解析する', async () => {
    const cert = await decodeOne(EC_PEM);
    const byName = Object.fromEntries(cert.extensions.map((e) => [e.name, e]));
    expect(byName.subjectAltName.values).toEqual([
      'DNS:example.test',
      'DNS:*.example.test',
      'IP:192.168.0.1',
      'email:a@example.test',
    ]);
    expect(byName.keyUsage.values).toEqual(['digitalSignature']);
    expect(byName.keyUsage.critical).toBe(true);
    expect(byName.extKeyUsage.values).toEqual(['serverAuth', 'clientAuth']);
    expect(byName.basicConstraints.values).toEqual(['CA:true', 'pathlen:2']);
    expect(byName.basicConstraints.critical).toBe(true);
    expect(byName.subjectKeyIdentifier.values).toEqual([
      '98:42:5A:A7:31:FC:D0:2D:F0:A2:54:71:9C:DE:EA:88:92:02:68:B5',
    ]);
    expect(byName.authorityKeyIdentifier.values).toEqual(
      byName.subjectKeyIdentifier.values,
    );
  });
});

describe('decodeCertificates (RSA)', () => {
  it('RSAの鍵長と署名アルゴリズムを解析する', async () => {
    const cert = await decodeOne(RSA_PEM);
    expect(cert.publicKeyAlgorithm).toBe('RSA');
    expect(cert.publicKeyBits).toBe(2048);
    expect(cert.signatureAlgorithm).toBe('sha256WithRSAEncryption');
    expect(cert.subject).toEqual([{ name: 'CN', value: 'rsa.test' }]);
    expect(cert.serialNumber).toBe('130A79C0D6A39C40ED746D2725646D385100A9F9');
    expect(cert.sha256Fingerprint).toBe(
      'DF:A6:41:43:1C:7C:0C:53:F3:14:FF:5C:13:6B:A6:A4:43:DE:B6:9C:90:60:7E:E7:EC:93:99:6B:F5:87:E7:64',
    );
  });
});

describe('入力形式', () => {
  it('複数のPEMを連結して渡すと、すべて解析する', async () => {
    const result = await decodeCertificates(`${EC_PEM}\n${RSA_PEM}`);
    expect(result.success && result.certificates).toHaveLength(2);
  });

  it('ヘッダーなしのBase64でも解析できる', async () => {
    const body = EC_PEM.replace(/-----[A-Z ]+-----/g, '');
    const cert = await decodeOne(body);
    expect(cert.subject[2].value).toBe('example.test');
  });

  it('空入力は no-certificate', async () => {
    expect(await decodeCertificates('  \n')).toEqual({
      success: false,
      error: 'no-certificate',
    });
  });

  it('Base64でない文字列・壊れたDERは invalid-certificate', async () => {
    expect(await decodeCertificates('hello world!')).toEqual({
      success: false,
      error: 'invalid-certificate',
    });
    const truncated =
      EC_PEM.split('\n').slice(0, 5).join('\n') + '\n-----END CERTIFICATE-----';
    expect(await decodeCertificates(truncated)).toEqual({
      success: false,
      error: 'invalid-certificate',
    });
  });

  it('PEMのBEGIN/ENDからDERを取り出せる', () => {
    expect(extractDerCertificates(EC_PEM)).toHaveLength(1);
  });
});

describe('validityStatus', () => {
  const cert = {
    notBefore: new Date('2026-01-01T00:00:00Z'),
    notAfter: new Date('2026-12-31T00:00:00Z'),
  };

  it('期間内は valid と残り日数', () => {
    expect(validityStatus(cert, new Date('2026-12-01T00:00:00Z'))).toEqual({
      status: 'valid',
      daysLeft: 30,
    });
  });

  it('期限切れと開始前を判定する', () => {
    expect(validityStatus(cert, new Date('2027-01-10T00:00:00Z'))).toEqual({
      status: 'expired',
      daysLeft: -10,
    });
    expect(validityStatus(cert, new Date('2025-12-01T00:00:00Z')).status).toBe(
      'not-yet-valid',
    );
  });
});
