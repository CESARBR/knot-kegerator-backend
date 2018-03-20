import mongoose from 'mongoose';
import mongooseUUID from 'mongoose-uuid2';

mongooseUUID(mongoose);

const KegSchema = mongoose.Schema({
  id: {
    type: mongoose.Types.UUID,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  weight: {
    type: Number,
  },
  totalVolume: {
    type: Number,
  },
});

KegSchema.set('toObject', { getters: true });

export default KegSchema;
