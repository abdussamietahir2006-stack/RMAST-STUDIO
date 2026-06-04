import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead, Booking, Subscriber, Testimonial, Project } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';
import { seedDefaultTestimonials } from '@/app/api/testimonials/route';

export async function GET(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  await seedDefaultTestimonials();

  const [
    totalLeads, newLeads,
    totalBookings, pendingBookings,
    totalSubscribers,
    totalTestimonials, pendingTestimonials,
    totalProjects,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Subscriber.countDocuments(),
    Testimonial.countDocuments(),
    Testimonial.countDocuments({ approved: false }),
    Project.countDocuments(),
  ]);

  return ok({
    totalLeads, newLeads,
    totalBookings, pendingBookings,
    totalSubscribers,
    totalTestimonials, pendingTestimonials,
    totalProjects,
    pagesManaged: 7,
  }, 'Stats fetched.');
}