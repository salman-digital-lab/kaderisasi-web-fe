import { SESSION_COOKIE_NAME, NAME_COOKIE_NAME, PROFILE_PICTURE_COOKIE_NAME } from '@/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(NAME_COOKIE_NAME);
    cookieStore.delete(PROFILE_PICTURE_COOKIE_NAME);

    redirect('/login')
} 