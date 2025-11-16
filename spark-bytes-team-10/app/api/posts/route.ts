import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const startTime = formData.get('start_time') as string | null
    const endTime = formData.get('end_time') as string
    const imageFile = formData.get('image') as File | null

    if (!title || !location || !description || !quantity || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let imagePath: string | null = null

    // If an image is provided, upload it to storage
    if (imageFile && imageFile.size > 0) {
      try {
        const ext = imageFile.name.split('.').pop() || 'jpg'
        const fileName = `${crypto.randomUUID()}.${ext}`
        const path = fileName

        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError } = await supabase.storage
          .from('food_pictures')
          .upload(path, buffer, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          console.error('Image upload error:', uploadError)
          throw new Error(`Storage upload failed: ${uploadError.message}`)
        }
        imagePath = path
      } catch (upErr) {
        const errMsg = upErr instanceof Error ? upErr.message : 'Unknown error'
        console.error('Image upload error:', errMsg)
        return NextResponse.json(
          { error: `Failed to upload image: ${errMsg}` },
          { status: 500 }
        )
      }
    }

    // Insert the post with image_path
    const { data: post, error: insertError } = await supabase
      .from('posts')
      .insert({
        title: title.trim(),
        start_time: startTime ? startTime : null,
        end_time: endTime,
        location: location.trim() || null,
        description: description.trim() || null,
        quantity: quantity || 1,
        quantity_left: quantity || 1,
        total_quantity: quantity || 1,
        image_path: imagePath,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      // If insert fails but image was uploaded, you could optionally delete the image here
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        post,
        message: 'Post created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
