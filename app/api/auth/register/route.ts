import bcrypt from 'bcryptjs'
import { supabaseServer } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { name, username, email, password } = await req.json()

        if (!name || !username || !email || !password) {
            return Response.json({ error: 'All fields are required' }, { status: 400 })
        }

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10)

        // inserting user info to supabase
        const { error } = await supabaseServer
            .from('users')
            .insert({
                name,
                username,
                email,
                password_hash: hashedPassword
            })

        if (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }

        return Response.json({ message: 'User registered successfully' })
    } catch (err) {
        return Response.json({ error: (err as Error).message }, { status: 500 })
    }
}
