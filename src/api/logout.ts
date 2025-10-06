import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect('/');
  response.cookies.set('auth-token', '', { maxAge: 0 }); // borra cookie
  return response;
}