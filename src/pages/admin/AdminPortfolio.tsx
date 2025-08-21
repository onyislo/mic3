import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import { 
  getPortfolioItems, 
  addPortfolioItem, 
  deletePortfolioItem, 
  togglePortfolioItemFeatured, 
  PortfolioItem 
} from '../../services/portfolioService';

// Extended type that includes proper display properties 
// to ensure we have proper type safety
interface ExtendedPortfolioItem extends PortfolioItem {
  // Make id required instead of optional for this component
  id: string;
  // Add display date field
  displayDate: string;
}

export const AdminPortfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<ExtendedPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch portfolio items on component mount
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        const items = await getPortfolioItems();
        // Convert to ExtendedPortfolioItem with required fields
        const formattedItems: ExtendedPortfolioItem[] = items
          .filter(item => item.id !== undefined) // Filter out items without IDs
          .map(item => ({
            ...item,
            id: item.id as string, // Type assertion since we filtered undefined
            // Use current date if created_at doesn't exist
            displayDate: new Date().toISOString().split('T')[0]
          }));
        setPortfolioItems(formattedItems);
        setError('');
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
        setError('Failed to load portfolio items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    technologies: '',
  });

  const categories = ['Grant Writing', 'Proofreading & Editing', 'Service Automation', 'Web Development'];

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPortfolioItem = {
        title: newItem.title,
        category: newItem.category,
        description: newItem.description,
        image: newItem.image,
        technologies: newItem.technologies.split(',').map(tech => tech.trim()),
        featured: false,
      };
      
        const addedItem = await addPortfolioItem(newPortfolioItem);
      
      if (addedItem && addedItem.id) {
        // Add the new item to the state with proper formatting
        const newExtendedItem: ExtendedPortfolioItem = {
          ...addedItem,
          id: addedItem.id,
          displayDate: new Date().toISOString().split('T')[0]
        };        setPortfolioItems([newExtendedItem, ...portfolioItems]);
        
        // Reset the form
        setNewItem({ title: '', category: '', description: '', image: '', technologies: '' });
        setShowAddForm(false);
      } else {
        throw new Error('Failed to add portfolio item - missing ID');
      }
    } catch (err) {
      console.error('Error adding portfolio item:', err);
      alert('Failed to add portfolio item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        const success = await deletePortfolioItem(id);
        
        if (success) {
          // Remove the deleted item from the state
          setPortfolioItems(portfolioItems.filter(item => item.id !== id));
        } else {
          alert('Failed to delete portfolio item. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting portfolio item:', err);
        alert('Failed to delete portfolio item. Please try again.');
      }
    }
  };

  const toggleFeatured = async (id: string) => {
    if (!id) return;
    
    try {
      const item = portfolioItems.find(item => item.id === id);
      
      if (!item) return;
      
      const newFeaturedStatus = !item.featured;
      const success = await togglePortfolioItemFeatured(id, newFeaturedStatus);
      
      if (success) {
        // Update the item in the state
        setPortfolioItems(portfolioItems.map(item =>
          item.id === id ? { ...item, featured: newFeaturedStatus } : item
        ));
      } else {
        alert('Failed to update portfolio item. Please try again.');
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
      alert('Failed to update portfolio item. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-900">Portfolio Management</h2>
          <p className="text-red-600">Manage your portfolio projects and showcase items</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Portfolio Item
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
          <span className="ml-2 text-red-600">Loading portfolio items...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Portfolio Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Add New Portfolio Item</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Project Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Image URL</label>
              <input
                type="url"
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={newItem.technologies}
                onChange={(e) => setNewItem({ ...newItem, technologies: e.target.value })}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Portfolio Item
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio Grid */}
      {!loading && portfolioItems.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No portfolio items found. Add your first item to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
            <img
              src={item["Image URL"]}
              alt={item["Project Title"]}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-600 font-medium">{item["Category"]}</span>
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className={`${item.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                  title={item.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star className="h-4 w-4" fill={item.featured ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">{item["Project Title"]}</h3>
              <p className="text-red-600 text-sm mb-4">{item["Description"]}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {item["Technologies (comma-separated)"]?.split(',').map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-500">{item.displayDate}</span>
                <div className="flex space-x-2">
                  <button className="text-yellow-600 hover:text-yellow-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};