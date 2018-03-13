import mongoose from 'mongoose';
import mongooseUUID from 'mongoose-uuid2';

mongooseUUID(mongoose);

const ClientSchema = mongoose.Schema({
  id: {
    type: mongoose.Types.UUID,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
});

export default ClientSchema;
