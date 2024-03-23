const Redis = require('ioredis');
const crypto = require('crypto');
const redisClient = new Redis();

const createVerificationKey = async (key) => {
    await redisClient.set(key, true, 'EX', 300); // Set expiry to 5 minutes (300 seconds)
    return key;
};

const matchVerificationKey = async (key) => {
    const exists = await redisClient.exists(key);
    return exists === 1;
};

const retrieveVerificationKey = async (key) => {
    const value = await redisClient.get(key);
    return value === 'true' ? key : null; // Return the key if found, otherwise null
};

const deleteVerificationKey = async (key) => {
    await redisClient.del(key);
};

module.exports = {
    deleteVerificationKey,
    matchVerificationKey,
    createVerificationKey,
    retrieveVerificationKey,
}