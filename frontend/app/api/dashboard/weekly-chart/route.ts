import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead, Booking, Subscriber, Testimonial } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      date: d,
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    };
  });

  const startDate = days[0].date;
  const endDate   = new Date(today);
  endDate.setHours(23, 59, 59, 999);

  const [leads, bookings, subscribers, testimonials] = await Promise.all([
    Lead.find({ createdAt: { $gte: startDate, $lte: endDate } }).select('createdAt').lean(),
    Booking.find({ createdAt: { $gte: startDate, $lte: endDate } }).select('createdAt').lean(),
    Subscriber.find({ createdAt: { $gte: startDate, $lte: endDate } }).select('createdAt').lean(),
    Testimonial.find({ createdAt: { $gte: startDate, $lte: endDate } }).select('createdAt').lean(),
  ]);

  const countByDay = (records: { createdAt: Date }[], day: Date) => {
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    return records.filter(r => {
      const d = new Date(r.createdAt);
      return d >= day && d < next;
    }).length;
  };

  const chartData = days.map(({ date, label }) => ({
    label,
    leads:        countByDay(leads        as { createdAt: Date }[], date),
    bookings:     countByDay(bookings     as { createdAt: Date }[], date),
    subscribers:  countByDay(subscribers  as { createdAt: Date }[], date),
    testimonials: countByDay(testimonials as { createdAt: Date }[], date),
    isToday: date.getTime() === today.getTime(),
  }));

  return ok(chartData, 'Weekly chart fetched.');
}