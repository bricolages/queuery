import { clientAccountUpdate } from '../resources';

describe('clientAccountUpdate', () => {
  let result: any;
  const params = { name: 'CLIENT_NAME' };
  const payload = { name: 'CLIENT_NAME', redshift_user: 'REDSHIFT_USER', redshift_password: 'REDSHIFT_PASSWORD' };

  describe('when 204 No Content', () => {
    beforeEach(async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 204 });
      result = await clientAccountUpdate.put(params, payload);
    });

    test('calls fetch', () => {
      expect(fetch).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "/v2/client_accounts/CLIENT_NAME",
              Object {
                "body": "{\\"name\\":\\"CLIENT_NAME\\",\\"redshift_user\\":\\"REDSHIFT_USER\\",\\"redshift_password\\":\\"REDSHIFT_PASSWORD\\"}",
                "credentials": "include",
                "headers": Object {
                  "Content-Type": "application/json",
                },
                "method": "PUT",
              },
            ],
          ],
          "results": Array [
            Object {
              "type": "return",
              "value": Promise {},
            },
          ],
        }
      `);
    });

    it('returns undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when 401 Unauthorized', () => {
    beforeEach(async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 401 });
      result = await clientAccountUpdate.put(params, payload);
    });

    test('returns undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when 500 Internal Server Error', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' });
    });

    test('raise error', async () => {
      await expect(clientAccountUpdate.put(params, payload)).rejects.toThrow('Fetch: [500]Internal Server Error');
    });
  });
});
