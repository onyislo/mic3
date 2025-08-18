import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  featured: boolean;
  createdAt: string;
}

export const AdminPortfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: '1',
      title: 'Research Grant Proposal',
      category: 'Grant Writing',
      description: 'Secured $500K research funding for university climate change study',
      image: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400',
      technologies: ['Research Analysis', 'Budget Planning', 'Compliance Review'],
      featured: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'AI Customer Service Bot',
      category: 'Service Automation',
      description: 'Automated customer service system reducing response time by 80%',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      technologies: ['Python', 'OpenAI API', 'Natural Language Processing'],
      featured: false,
      createdAt: '2024-01-10',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    technologies: '',
  });

  const categories = ['Grant Writing', 'Proofreading & Editing', 'Service Automation', 'Web Development'];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PortfolioItem = {
      id: Date.now().toString(),
      title: newItem.title,
      category: newItem.category,
      description: newItem.description,
      image: newItem.image,
      technologies: newItem.technologies.split(',').map(tech => tech.trim()),
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPortfolioItems([...portfolioItems, item]);
    setNewItem({ title: '', category: '', description: '', image: '', technologies: '' });
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    }
  };

  const toggleFeatured = (id: string) => {
    setPortfolioItems(portfolioItems.map(item =>
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-600 font-medium">{item.category}</span>
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className={`${item.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                  title={item.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star className="h-4 w-4" fill={item.featured ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">{item.title}</h3>
              <p className="text-red-600 text-sm mb-4">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {item.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-500">{item.createdAt}</span>
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