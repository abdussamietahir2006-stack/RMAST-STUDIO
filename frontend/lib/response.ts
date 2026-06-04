import { NextResponse } from 'next/server';

export const ok  = <T>(data: T, msg = 'Success', status = 200) =>
  NextResponse.json({ success: true,  message: msg,  data }, { status });

export const err = (msg: string, status = 400) =>
  NextResponse.json({ success: false, message: msg, data: null }, { status });