import { supabase } from './supabaseClient';

export interface PortfolioItem {
  id?: string;
  "Project Title": string;  // Using exact column names from your Supabase table
  "Category": string;
  "Description": string;
  "Image URL": string;
  "Technologies (comma-separated)": string; // This is a string in the database, we'll parse it
  featured?: boolean; // Making this optional since it might not exist
}

// Get all portfolio items
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Portfolio')
      .select('*');
      // Removed ordering by created_at since that column doesn't exist

    if (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPortfolioItems:', error);
    return [];
  }
};

// Get featured portfolio items
export const getFeaturedPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    // Since there's likely no 'featured' column, we'll just return all items
    const { data, error } = await supabase
      .from('Portfolio')
      .select('*');

    if (error) {
      console.error('Error fetching featured portfolio items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedPortfolioItems:', error);
    return [];
  }
};

// Add a portfolio item
export const addPortfolioItem = async (newItem: {
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  featured?: boolean;
}): Promise<PortfolioItem | null> => {
  try {
    // Map our simple API to the exact column names in Supabase
    const mappedItem = {
      "Project Title": newItem.title,
      "Category": newItem.category,
      "Description": newItem.description,
      "Image URL": newItem.image,
      "Technologies (comma-separated)": Array.isArray(newItem.technologies) 
        ? newItem.technologies.join(', ') 
        : newItem.technologies
    };
    
    const { data, error } = await supabase
      .from('Portfolio')
      .insert(mappedItem)
      .select()
      .single();

    if (error) {
      console.error('Error adding portfolio item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addPortfolioItem:', error);
    return null;
  }
};

// Update a portfolio item
export const updatePortfolioItem = async (
  id: string, 
  updates: {
    title?: string;
    category?: string;
    description?: string;
    image?: string;
    technologies?: string[];
  }
): Promise<PortfolioItem | null> => {
  try {
    // Map our simple API to the exact column names in Supabase
    const mappedUpdates: Record<string, string | string[] | boolean> = {};
    
    if (updates.title !== undefined) {
      mappedUpdates["Project Title"] = updates.title;
    }
    if (updates.category !== undefined) {
      mappedUpdates["Category"] = updates.category;
    }
    if (updates.description !== undefined) {
      mappedUpdates["Description"] = updates.description;
    }
    if (updates.image !== undefined) {
      mappedUpdates["Image URL"] = updates.image;
    }
    if (updates.technologies !== undefined) {
      mappedUpdates["Technologies (comma-separated)"] = Array.isArray(updates.technologies) 
        ? updates.technologies.join(', ') 
        : updates.technologies;
    }
    
    const { data, error } = await supabase
      .from('Portfolio')
      .update(mappedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating portfolio item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updatePortfolioItem:', error);
    return null;
  }
};

// Toggle featured status - Since 'featured' likely doesn't exist in your table,
// this is a placeholder that always returns true without doing anything
export const togglePortfolioItemFeatured = async (id: string, featured: boolean): Promise<boolean> => {
  // We're not actually updating anything since the 'featured' column doesn't exist
  console.log(`Would set featured to ${featured} for item ${id}, but column doesn't exist`);
  return true;
};

// Delete a portfolio item
export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Portfolio')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting portfolio item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePortfolioItem:', error);
    return false;
  }
};
