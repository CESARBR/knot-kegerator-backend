import mongoose from 'mongoose';

const TapSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  setup: {
    type: Object,
    required: true,
  },
});

export default TapSchema;
