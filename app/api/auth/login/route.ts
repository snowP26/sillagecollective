import { supabaseServer } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {

        //identifier can be email or username
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }

        const { data: user, error } = await supabaseServer
            .from('users')
            .select('id, username, email, password_hash')
            .or(`email.eq.${identifier},username.eq.${identifier}`)
            .single();

        if (error) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        const response = NextResponse.json({ token });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
