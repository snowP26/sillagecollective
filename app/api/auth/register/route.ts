//
//  route.js
//  
//
//  Created by Stevens Anthony Fabriga on 2/27/26.
//
import bcrypt from 'bcrypt'
import { supabase } from '../../../../lib/supabase.js'

export async function POST(req) {
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
        return Response.json({ error: err.message }, { status: 500 })
    }
}
