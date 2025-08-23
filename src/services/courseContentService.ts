import { supabase } from './supabaseClient';
import { CourseContent } from '../types/CourseTypes';
import { v4 as uuidv4 } from 'uuid';

// Define interface for content section structure
export interface ContentSection {
  id: string;
  title: string;
  order: number;
  items: ContentItem[];
}

// Define interface for content items
export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  fileSize?: number;
  order?: number; // Make order optional since it doesn't exist in the database
}

// Get course content structure from Supabase
export const getCourseContent = async (courseId: string): Promise<ContentSection[]> => {
  try {
    // First, get all course content items for this course
    const { data: contentItems, error } = await supabase
      .from('course_content')
      .select('*')
      .eq('course_id', courseId);
    
    if (error) {
      console.error('Error fetching course content:', error);
      return [];
    }
    
    if (!contentItems || contentItems.length === 0) {
      return [];
    }
    
    // Group items by Module to create sections
    const sectionMap = new Map<number, ContentSection>();
    
    contentItems.forEach(item => {
      // Use section title as the unique identifier instead of module
      const sectionTitle = item["Section Title"] || "Default Section";
      
      if (!sectionMap.has(sectionTitle)) {
        sectionMap.set(sectionTitle, {
          id: `section-${sectionMap.size}`,
          title: sectionTitle,
          order: sectionMap.size,
          items: []
        });
      }
      
      // Use the previously defined sectionTitle
      const section = sectionMap.get(sectionTitle);
      if (section) {
        section.items.push({
          id: item.id,
          title: item["Title"],
          type: item["Content Type"] as 'video' | 'pdf' | 'text',
          // Removed url field as requested
          fileSize: item["File Size"],
          order: 0, // Use a constant value instead of reading from DB
          // removed isPublished as it doesn't exist in the interface or database
        });
      }
    });
    
    // Convert the map to an array
    return Array.from(sectionMap.values())
      .map(section => ({
        ...section,
        // Don't try to sort by order, just leave items in the order they came from the database
        items: section.items
      }));
    
  } catch (error) {
    console.error('Error in getCourseContent:', error);
    return [];
  }
};

// Save course content structure to Supabase
export const saveCourseContent = async (courseId: string, sections: ContentSection[]): Promise<boolean> => {
  try {
    // First, get the existing content to determine what to update, delete, or add
    const { data: existingContent } = await supabase
      .from('course_content')
      .select('id')
      .eq('course_id', courseId);
    
    const existingIds = existingContent ? existingContent.map(item => item.id) : [];
    const newContentIds: string[] = [];
    
    // Prepare batches for insert, update and delete
    const itemsToInsert: Record<string, unknown>[] = [];
    const itemsToUpdate: Record<string, unknown>[] = [];
    
    // Process all sections and items
    sections.forEach((section) => {
      section.items.forEach((item) => {
        const contentData = {
          course_id: courseId,
          // Removed module as it doesn't exist in the database
          "Section Title": section.title,
          // Use proper column names with spaces and capital letters as they are in Supabase
          "Title": item.title,
          "Content Type": item.type,
          // Removed url field as requested
          "File Size": item.fileSize
          // Remove duration and Is Published since they don't exist in the database
        };
        
        if (existingIds.includes(item.id)) {
          // This is an existing item that needs updating
          itemsToUpdate.push({
            id: item.id,
            ...contentData
          });
          newContentIds.push(item.id);
        } else {
          // This is a new item
          const newId = item.id.startsWith('temp-') ? uuidv4() : item.id;
          itemsToInsert.push({
            id: newId,
            ...contentData,
            created_at: new Date().toISOString()
          });
          newContentIds.push(newId);
        }
      });
    });
    
    // Determine which items to delete (items in existingIds but not in newContentIds)
    const itemsToDelete = existingIds.filter(id => !newContentIds.includes(id));
    
    // Execute database operations in batches
    
    // 1. Insert new items
    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('course_content')
        .insert(itemsToInsert);
      
      if (insertError) {
        console.error('Error inserting course content:', insertError);
        return false;
      }
    }
    
    // 2. Update existing items
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from('course_content')
        .update({
          "Title": item.title,
          // Removed module as it doesn't exist in the database
          "Section Title": item.section_title,
          // Use proper column names with spaces and capital letters as they are in Supabase
          "Content Type": item.content_type,
          // Removed url field as requested
          "File Size": item.file_size,
          // Remove duration and Is Published since they don't exist in the database
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);
      
      if (updateError) {
        console.error('Error updating course content:', updateError);
        return false;
      }
    }
    
    // 3. Delete removed items
    if (itemsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('course_content')
        .delete()
        .in('id', itemsToDelete);
      
      if (deleteError) {
        console.error('Error deleting course content:', deleteError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveCourseContent:', error);
    return false;
  }
};

// Add a single content item to a course
export const addContentItem = async (
  courseId: string,
  sectionTitle: string,
  item: Omit<ContentItem, 'id'>
): Promise<string | null> => {
  try {
    // We don't need to query for count or track module number anymore
    // since module column doesn't exist in the database
    
    const newItem = {
      id: uuidv4(),
      course_id: courseId,
      // Removed module as it doesn't exist in the database
      "Section Title": sectionTitle,
      // Use proper column names with spaces and capital letters
      "Title": item.title,
      "Content Type": item.type,
      // Removed url field as requested
      "File Size": item.fileSize,
      // Remove "Is Published" and duration as they don't exist in your DB schema
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('course_content')
      .insert([newItem]);
    
    if (error) {
      console.error('Error adding content item:', error);
      return null;
    }
    
    return newItem.id;
  } catch (error) {
    console.error('Error in addContentItem:', error);
    return null;
  }
};

// Delete a content item
export const deleteContentItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('course_content')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error('Error deleting content item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteContentItem:', error);
    return false;
  }
};

// Update a content item's properties
export const updateContentItem = async (itemId: string, updates: Partial<ContentItem>): Promise<boolean> => {
  try {
    // Use a Record type instead of any
    const updateData: Record<string, unknown> = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    // Removed url field as requested
    if (updates.type !== undefined) updateData["Content Type"] = updates.type;
    if (updates.fileSize !== undefined) updateData["File Size"] = updates.fileSize;
    // Remove duration and isPublished as they don't exist in the DB schema
    
    updateData.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('course_content')
      .update(updateData)
      .eq('id', itemId);
    
    if (error) {
      console.error('Error updating content item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateContentItem:', error);
    return false;
  }
};
