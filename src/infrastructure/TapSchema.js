import mongoose from 'mongoose';
import mongooseUUID from 'mongoose-uuid2';

mongooseUUID(mongoose);

const TapSchema = mongoose.Schema({
  id: {
    type: mongoose.Types.UUID,
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