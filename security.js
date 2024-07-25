// security.js

import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates the incoming payload's signature against the expected signature.
 *
 * @param {string} payload - The payload received from the request.
 * @param {string} signature - The signature received from the request headers.
 * @returns {boolean} - Returns true if the signature is valid, otherwise false.
 */
export function validateSignature(payload, signature) {
    // Convert payload to string
    const payloadString = JSON.stringify(payload);
    const expectedSignature = crypto
        .createHmac('sha256', process.env.APP_SECRET)
        .update(payloadString)
        .digest('hex');
        console.log(expectedSignature);
    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}

/**
 * Middleware to ensure that the incoming requests to our webhook are valid and signed with the correct signature.
 */
export function signatureRequired(req, res, next) {
    console.log(req.headers['x-hub-signature-256']);
    const signature = req.headers['x-hub-signature-256']?.substring(7); // Removing 'sha256='
    const payload = req.body; // Raw body of the request for signature verification
    if (!validateSignature(payload, signature)) {
        console.error('Signature verification failed!');
        return res.status(403).json({ status: 'error', message: 'Invalid signature' });
    }
    next();
}