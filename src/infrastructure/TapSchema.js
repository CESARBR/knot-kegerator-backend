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
  waitingSetup: {
    type: Boolean,
    required: true,
  },
  setup: {
    type: Object,
    required: true,
  },
  volume: {
    type: Number,
  },
});

export default TapSchema;
