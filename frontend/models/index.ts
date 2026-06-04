import mongoose, { Schema } from 'mongoose';

// ── Lead ──────────────────────────────────────────────────────────────────────
const LeadSchema = new Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  company: { type: String, trim: true },
  phone:   { type: String, trim: true },
  message: { type: String, required: true },
  source:  { type: String, enum: ['contact_form', 'booking_form', 'referral', 'other'], default: 'contact_form' },
  status:  { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], default: 'new' },
  service: { type: String },
}, { timestamps: true });

// ── Booking ───────────────────────────────────────────────────────────────────
const BookingSchema = new Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, trim: true, lowercase: true },
  company:       { type: String, trim: true },
  phone:         { type: String, trim: true },
  preferredTime: { type: String },
  timezone:      { type: String },
  notes:         { type: String },
  status:        { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  whatsapp:      { type: String },
  service:       { type: String },
  reason:        { type: String },
  date:          { type: String },
  time:          { type: String },
}, { timestamps: true });

// ── Subscriber ────────────────────────────────────────────────────────────────
const SubscriberSchema = new Schema({
  email:  { type: String, required: true, unique: true, trim: true, lowercase: true },
  source: { type: String, default: 'newsletter' },
}, { timestamps: true });

// ── Testimonial ───────────────────────────────────────────────────────────────
const TestimonialSchema = new Schema({
  name:        { type: String, required: true, trim: true },
  role:        { type: String, trim: true },
  company:     { type: String, trim: true },
  quote:       { type: String, required: true },
  service:     { type: String, default: 'Other' },
  rating:      { type: Number, default: 5, min: 1, max: 5 },
  metric:      { type: String },
  metricLabel: { type: String },
  avatarImage: { type: String },
  approved:    { type: Boolean, default: false },
}, { timestamps: true });

// ── Project ───────────────────────────────────────────────────────────────────
const ProjectSchema = new Schema({
  title:    { type: String, required: true, trim: true },
  desc:     { type: String, trim: true },
  category: { type: String, enum: ['Web', '3D', 'AI', 'General'], default: 'Web' },
  image:    { type: String },
  stack:    { type: [String], default: [] },
  link:     { type: String },
  github:   { type: String, trim: true },
  year:     { type: String },
  featured: { type: Boolean, default: false },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

// ── PageContent ───────────────────────────────────────────────────────────────
const PageContentSchema = new Schema({
  pageSlug: { type: String, required: true, unique: true },
  content:  { type: Schema.Types.Mixed, default: {} },
  images:   { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// ── PasswordReset ─────────────────────────────────────────────────────────────
const PasswordResetSchema = new Schema({
  email:     { type: String, required: true, lowercase: true },
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Lead          = mongoose.models.Lead          || mongoose.model('Lead',          LeadSchema);
export const Booking       = mongoose.models.Booking       || mongoose.model('Booking',       BookingSchema);
export const Subscriber    = mongoose.models.Subscriber    || mongoose.model('Subscriber',    SubscriberSchema);
export const Testimonial   = mongoose.models.Testimonial   || mongoose.model('Testimonial',   TestimonialSchema);
export const Project       = mongoose.models.Project       || mongoose.model('Project',       ProjectSchema);
export const PageContent   = mongoose.models.PageContent   || mongoose.model('PageContent',   PageContentSchema);
export const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);