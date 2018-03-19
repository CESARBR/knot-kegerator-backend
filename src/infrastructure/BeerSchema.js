import mongoose from 'mongoose';
import mongooseUUID from 'mongoose-uuid2';

mongooseUUID(mongoose);

const BeerSchema = mongoose.Schema({
  id: {
    type: mongoose.Types.UUID,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  brand: {
    type: String,
  },
  style: {
    type: String,
  },
});

BeerSchema.set('toObject', { getters: true });

export default BeerSchema;
