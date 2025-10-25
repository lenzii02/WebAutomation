const https = require('https');
const { expect } = require('chai');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const BASE_URL = 'reqres.in';
const BASE_PATH = '/api';


// Fungsi Ini untuk request ke API GET POST PATCH DELETE
const makeRequest = (options, body = null) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data ? JSON.parse(data) : null,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};


describe('API Automation Tests - Reqres', () => {
  // MEMBUAT TEST CASE UNTUK API GET
  describe('GET - Retrieve Users', () => {
    it('should successfully retrieve list of users', async () => {
      try {
        const options = {
          hostname: BASE_URL,
          path: `${BASE_PATH}/users?page=1`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': 'reqres-free-v1'
          }
        };
        const { status, data } = await makeRequest(options);

        // Assertions // Menguji Apakah API Status Code 200
        expect(status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data.data.length).to.be.greaterThan(0);

        // JSON Schema // Apakah Format Data Bisa Di Validasi
        const userListSchema = {
          type: 'object',
          properties: {
            page: { type: 'number' },
            per_page: { type: 'number' },
            total: { type: 'number' },
            total_pages: { type: 'number' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  email: { type: 'string' },
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  avatar: { type: 'string' }
                },
                required: ['id', 'email', 'first_name', 'last_name', 'avatar']
              }
            },
            support: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                text: { type: 'string' }
              },
              required: ['url', 'text']
            }
          },
          required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support']
        };

        // JSON Schema Validation
        const validate = ajv.compile(userListSchema);
        const isValid = validate(data);
        if (!isValid) {
          console.error('Schema validation errors:', validate.errors);
        }
        expect(isValid, JSON.stringify(validate.errors, null, 2)).to.be.true;

        console.log(`✓ GET users successful - Retrieved ${data.data.length} users`);
      } catch (error) {
        console.error('GET /users error:', error.message);
        throw error;
      }
    });
  });

  // MEMBUAT TEST CASE UNTUK API POST
  describe('POST - Create User', () => {
    it('should successfully create a new user', async () => {
      try {
        const payload = { name: 'API Tester', job: 'QA' };
        const options = {
          hostname: BASE_URL,
          path: `${BASE_PATH}/users`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
            'x-api-key': 'reqres-free-v1'
          }
        };
        const { status, data, headers } = await makeRequest(options, payload);

        // Debug log // Mencetak Data Response Jika Status Code Tidak 200 atau 201
        if (status !== 200 && status !== 201) {
          console.log('Response status:', status);
          console.log('Response data:', JSON.stringify(data, null, 2));
          console.log('Response headers:', headers);
        }

        // Assertions
        expect(status).to.equal(201);
        expect(data.name).to.equal(payload.name);

        // JSON Schema
        const createUserSchema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            job: { type: 'string' },
            id: { type: 'string' },
            createdAt: { type: 'string' }
          },
          required: ['name', 'job', 'id', 'createdAt']
        };

        // JSON Schema
        const validate = ajv.compile(createUserSchema);
        const isValid = validate(data);
        if (!isValid) {
          console.error('Schema validation errors:', validate.errors);
        }
        expect(isValid, JSON.stringify(validate.errors, null, 2)).to.be.true;

        console.log(`✓ POST user successful - Created user ID: ${data.id}`);
      } catch (error) {
        console.error('POST /users error:', error.message);
        throw error;
      }
    });
  });

  // 3. PATCH Request - Update User
  describe('PATCH', () => {
    it('should successfully update a user partially', async () => {
      try {
        const userId = 2;
        const updateData = { name: 'Updated Name' };
        const options = {
          hostname: BASE_URL,
          path: `${BASE_PATH}/users/${userId}`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(updateData)),
            'x-api-key': 'reqres-free-v1'
          }
        };
        const { status, data } = await makeRequest(options, updateData);

        // Assertions
        expect(status).to.equal(200);
        expect(data.name).to.equal(updateData.name);

        // JSON Schema
        const updateUserSchema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            updatedAt: { type: 'string' }
          },
          required: ['name', 'updatedAt']
        };

        // JSON Schema 
        const validate = ajv.compile(updateUserSchema);
        const isValid = validate(data);
        if (!isValid) {
          console.error('Schema validation errors:', validate.errors);
        }
        expect(isValid, JSON.stringify(validate.errors, null, 2)).to.be.true;

        console.log(`✓ PATCH user successful - Updated user ID: ${userId}`);
      } catch (error) {
        console.error(`PATCH /users/2 error:`, error.message);
        throw error;
      }
    });
  });

  // 4. DELETE Request - Delete User
  describe('DELETE', () => {
    it('should successfully delete a user', async () => {
      try {
        const userId = 2;
        const options = {
          hostname: BASE_URL,
          path: `${BASE_PATH}/users/${userId}`,
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': 'reqres-free-v1'
          }
        };
        const { status } = await makeRequest(options);

        // Assertions
        expect(status).to.equal(204);

        console.log(`✓ DELETE user successful - Deleted user ID: ${userId}`);
      } catch (error) {
        console.error(`DELETE /users/2 error:`, error.message);
        throw error;
      }
    });
  });
});
