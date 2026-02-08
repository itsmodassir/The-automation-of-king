const jwt = require('jsonwebtoken');

// Get JWT secret from environment or use default
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Admin user payload (matching the structure from admin-auth.service.ts)
const payload = {
    email: 'md@modassir.info',
    sub: 'e0317ecb-dd95-40a3-ade6-fbda8fd1407a', // This should be the actual user ID from database
    role: 'super_admin',
    type: 'admin',
    id: 'e0317ecb-dd95-40a3-ade6-fbda8fd1407a'
};

// Generate token with 7 day expiration
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

console.log('\n=== Admin JWT Token ===\n');
console.log('Token:', token);
console.log('\n=== Decoded Payload ===\n');
console.log(JSON.stringify(jwt.decode(token), null, 2));
console.log('\n=== Usage ===\n');
console.log('Add this to your request headers:');
console.log(`Authorization: Bearer ${token}`);
console.log('\nOr store in localStorage:');
console.log(`localStorage.setItem('admin_token', '${token}');`);
console.log('\n');
