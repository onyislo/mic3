import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket to upload to
 * @param folder The folder within the bucket
 * @returns The URL of the uploaded image or null if upload failed
 */
export const uploadImage = async (
  file: File, 
  bucket: string = 'course-images', 
  folder: string = 'courses'
): Promise<string | null> => {
  try {
    console.log("Uploading image:", file.name, "Size:", file.size, "Type:", file.type);
    
    // Create a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExt}`;
    
    console.log("Generated file name:", fileName);
    
    // Upload the file to Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    console.log("Generated public URL:", urlData.publicUrl);  
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

/**
 * Delete an image from Supabase Storage
 * @param url The URL of the image to delete
 * @param bucket The storage bucket the image is in
 * @returns True if deletion was successful, false otherwise
 */
export const deleteImage = async (
  url: string, 
  bucket: string = 'course-images'
): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};
