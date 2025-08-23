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
 * Upload course content file (video, PDF, etc.) to Supabase Storage
 * @param file The file to upload
 * @param contentType The type of content (video, pdf)
 * @param courseId The ID of the course
 * @param onProgress Optional callback for upload progress
 * @returns Object containing URL of the uploaded file, fileSize, and optional duration
 */
export const uploadCourseContent = async (
  file: File,
  contentType: string = 'video',
  courseId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string | null, fileSize: number, duration?: number }> => {
  try {
    // Use course-content bucket with appropriate folder structure
    const bucket = 'course-content';
    const folder = `${courseId}/${contentType}s`; // Example: course-id/videos or course-id/pdfs
    
    // Create a unique filename to prevent collisions but preserve original filename
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${folder}/${uuidv4()}-${sanitizedFileName}`;
    
    console.log(`Starting direct upload to ${bucket}/${fileName}`);
    
    // Use direct upload instead of signed URL (more compatible with RLS)
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    console.log('Upload completed successfully');
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    // Create result object with minimal properties
    return {
      url: urlData.publicUrl,
      fileSize: file.size
    };
  } catch (error) {
    console.error('Error in uploadCourseContent:', error);
    return { url: null, fileSize: 0 };
  }
};

/**
 * Delete an image or content file from Supabase Storage
 * @param url The URL of the file to delete
 * @param bucket The storage bucket the file is in
 * @returns True if deletion was successful, false otherwise
 */
export const deleteStorageFile = async (
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
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteStorageFile:', error);
    return false;
  }
};

/**
 * Check if a file exists and is accessible in storage
 * @param url The URL of the file to check
 * @returns True if file exists and is accessible, false otherwise
 */
export const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    // Simple HEAD request to check if file exists
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking file:', error);
    return false;
  }
};

// Keep the original deleteImage function for backward compatibility
export const deleteImage = deleteStorageFile;
