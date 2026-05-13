import mongoose from 'mongoose';

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('MongoDB conectado');
}

export default connectMongo;
