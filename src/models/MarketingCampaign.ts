import { Schema, model, models } from 'mongoose'

const marketingCampaignSchema = new Schema(
  {
    subject: { type: String, required: true, trim: true },
    preheader: { type: String, default: '' },
    template: { type: String, default: 'custom' },
    icon: { type: String, default: 'mail' },
    theme: { type: String, default: 'green' },
    heading: { type: String, default: '' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imageKey: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },
    infoBoxTitle: { type: String, default: '' },
    infoBoxContent: { type: String, default: '' },
    status: { type: String, enum: ['synced', 'draft'], default: 'synced', index: true },
    syncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const MarketingCampaign = models.MarketingCampaign ?? model('MarketingCampaign', marketingCampaignSchema)
