// A test page to verify Supabase connection.
// URL is http://localhost:3000/test


"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function TestPage() {
    const [status, setStatus] = useState("Checking connection...")
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const testConnection = async () => {
        try {
        const { data, error } = await supabase.from("userinfo").select("*").limit(1)
            if (error) throw error
            setData(data)
            setStatus("Supabase connected successfully!")
        } catch (err: any) {
            setStatus(`Connection failed: ${err.message}`)
        }
        }
        testConnection()
    }, [])

    return (
        <div style={{ fontFamily: "monospace", padding: "2rem" }}>
        <h2>{status}</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}
