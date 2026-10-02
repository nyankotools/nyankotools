import { test, expect } from './helpers/test';

// openssl で生成した自己署名証明書（ECDSA P-256、CN=example.test）
const PEM = `-----BEGIN CERTIFICATE-----
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
const SHA256 =
  '1F:49:7C:46:13:B4:86:09:3C:F7:B1:51:D1:35:30:D8:4C:A2:D5:27:33:52:F3:F1:DA:F6:88:52:92:E7:5F:54';

test.describe('X.509証明書デコーダー（日本語版）', () => {
  test('PEMを貼り付けると主要項目が表示される', async ({ page }) => {
    await page.goto('/tools/x509-decoder/');
    await expect(page.locator('main h1')).toHaveText(
      'X.509証明書（PEM）デコーダー',
    );

    await page.locator('#x509-decoder-input').fill(PEM);
    const results = page.locator('#x509-decoder-results');
    await expect(results).toContainText('C=JP, O=Nyanko Test, CN=example.test');
    await expect(results).toContainText('2036-09-29 08:20:34 UTC');
    await expect(results).toContainText('DNS:*.example.test');
    await expect(results).toContainText('IP:192.168.0.1');
    await expect(results).toContainText(SHA256);
    await expect(results).toContainText('prime256v1 (P-256)');
    await expect(page.locator('#x509-decoder-error')).toBeHidden();
  });

  test('証明書でない入力はエラーを表示し、空にすると消える', async ({
    page,
  }) => {
    await page.goto('/tools/x509-decoder/');
    await page.locator('#x509-decoder-input').fill('not a certificate');
    await expect(page.locator('#x509-decoder-error')).toBeVisible();
    await expect(page.locator('#x509-decoder-results section')).toHaveCount(0);
    await page.locator('#x509-decoder-input').fill('');
    await expect(page.locator('#x509-decoder-error')).toBeHidden();
  });

  test('複数の証明書は順にカードを表示する', async ({ page }) => {
    await page.goto('/tools/x509-decoder/');
    await page.locator('#x509-decoder-input').fill(`${PEM}\n${PEM}`);
    await expect(page.locator('#x509-decoder-results section')).toHaveCount(2);
  });
});

test.describe('X.509 Certificate Decoder (English)', () => {
  test('英語版が表示され、証明書をデコードできる', async ({ page }) => {
    await page.goto('/en/tools/x509-decoder/');
    await expect(page.locator('main h1')).toHaveText(
      'X.509 Certificate (PEM) Decoder',
    );
    await page.locator('#x509-decoder-input').fill(PEM);
    await expect(page.locator('#x509-decoder-results')).toContainText(
      'Subject',
    );
    await expect(page.locator('#x509-decoder-results')).toContainText(SHA256);
    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
