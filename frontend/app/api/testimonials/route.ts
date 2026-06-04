import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  await connectDB();

  // Auto-seed if collection is empty
  const count = await Testimonial.countDocuments();
  if (count === 0) {
    await Testimonial.insertMany([
      {
        name: 'Sarah Ahmed',
        role: 'CEO',
        company: 'TechFlow',
        quote: 'Working with RMAST was a game changer. The level of detail and execution is unmatched. Our platform is now lightning-fast and absolutely beautiful. Every feature we asked for was delivered beyond our expectations.',
        avatarImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
        rating: 5,
        service: 'Web Development',
        metric: '+240%',
        metricLabel: 'user engagement',
        approved: true,
        showOnWebsite: true,
      },
      {
        name: 'James Okafor',
        role: 'Founder',
        company: 'LuxeStore',
        quote: 'The 3D animations he built increased our conversion rate by 40%. This is creative excellence meeting technical perfection. I have worked with many developers — RMAST operates on a completely different level.',
        avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
        rating: 5,
        service: '3D & UI/UX',
        metric: '+40%',
        metricLabel: 'conversion rate',
        approved: true,
        showOnWebsite: true,
      },
      {
        name: 'Layla Hassan',
        role: 'Operations Lead',
        company: 'StartupX',
        quote: 'Saved us 20+ hours per week with AI automation. Not only is he talented but he deeply understands business problems. A true partner who thinks about your growth, not just the task list.',
        avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face',
        rating: 5,
        service: 'AI Automations',
        metric: '20hr',
        metricLabel: 'saved per week',
        approved: true,
        showOnWebsite: true,
      },
      {
        name: 'Omar Khalid',
        role: 'Director',
        company: 'Nexora Agency',
        quote: 'From wireframe to live product in 3 weeks. The admin dashboard alone was worth every penny — full CMS, booking system, leads management. We run our entire business through it now.',
        avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
        rating: 5,
        service: 'Full Stack',
        metric: '3wk',
        metricLabel: 'zero to live',
        approved: true,
        showOnWebsite: true,
      }
    ]);
  }

  const { searchParams } = new URL(req.url);
  const approvedParam = searchParams.get('approved');

  const filter: Record<string, unknown> = {};
  // Public fetch: ?approved=true returns only approved
  // Admin fetch (authenticated): returns all
  const admin = authenticate(req);
  if (!admin) {
    filter.approved = true;
    filter.showOnWebsite = { $ne: false };
  } else if (approvedParam === 'true') {
    filter.approved = true;
  } else if (approvedParam === 'false') {
    filter.approved = false;
  }

  const total        = await Testimonial.countDocuments(filter);
  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 }).lean();
  return ok({ testimonials, total }, 'Testimonials fetched.');
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.quote) return err('Name and quote are required.');
    if (body.quote.length < 20) return err('Quote must be at least 20 characters.');
    const testimonial = await Testimonial.create({ ...body, approved: false });
    return ok(testimonial, 'Review submitted. It will appear after approval.', 201);
  } catch { return err('Server error.', 500); }
}