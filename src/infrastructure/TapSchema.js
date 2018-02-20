import mongoose from 'mongoose';

const TapSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  beerId: {
    type: String,
    required: true,
  },
  kegId: {
    type: String,
    required: true,
  },
});

export default TapSchema;
