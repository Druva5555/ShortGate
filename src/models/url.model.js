import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    shortId: { type: String, required: true, unique: true, index: true },
    redirectURL: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    totalClicks: { type: Number, default: 0 },
    visitHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ip: { type: String },
        userAgent: { type: String },
      },
    ],
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate URL per user (only for non-expired URLs)
urlSchema.index({ user: 1, redirectURL: 1 }, { unique: true, partialFilterExpression: { user: { $type: 'objectId' } } });

// TTL index for expiration (documents will be removed automatically after expiresAt)
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: 'date' } } });

const Url = mongoose.model('Url', urlSchema);
export default Url;
