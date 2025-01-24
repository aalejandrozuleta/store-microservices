import mongoose from 'mongoose';
const mongoURI = process.env.MONGO_URI || '';

export const mongoConnection = mongoose.connect(mongoURI);
