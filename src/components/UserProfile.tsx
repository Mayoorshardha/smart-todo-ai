import { useState } from 'react';
import { User, Save, Plus, X } from 'lucide-react';
import type { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  profile: UserProfileType;
  onProfileUpdate: (profile: UserProfileType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileType>(profile);
  const [newCategory, setNewCategory] = useState('');
  const [newRoutineTask, setNewRoutineTask] = useState('');
  const [newPriority, setNewPriority] = useState('');

  const handleSave = () => {
    onProfileUpdate(formData);
    setIsEditing(false);
  };

  const addItem = (
    value: string, 
    field: keyof Pick<UserProfileType, 'categories' | 'routineTasks' | 'priorities'>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), value.trim()]
      });
      setter('');
    }
  };

  const removeItem = (
    index: number,
    field: keyof Pick<UserProfileType, 'categories' | 'routineTasks' | 'priorities'>
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field]?.filter((_, i) => i !== index) || []
    });
  };

  if (!isEditing) {
    return (
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Profile: {profile.name || 'Anonymous'}</h3>
          </div>
          <button onClick={() => setIsEditing(true)} className="btn-primary text-sm">
            Edit Profile
          </button>
        </div>
        
        {profile.name && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Work Hours:</strong> {profile.workHours}
            </div>
            <div>
              <strong>Custom Categories:</strong> {profile.categories?.length || 0}
            </div>
            <div>
              <strong>Routine Tasks:</strong> {profile.routineTasks?.length || 0}
            </div>
            <div>
              <strong>Priority Keywords:</strong> {profile.priorities?.length || 0}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card mb-6 border-2 border-blue-300">
      <h3 className="text-lg font-semibold mb-4">Personalize Your AI Assistant</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name (optional)
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter your name..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Hours (helps with task timing)
          </label>
          <input
            type="text"
            value={formData.workHours}
            onChange={(e) => setFormData({...formData, workHours: e.target.value})}
            placeholder="e.g., 9-17, 8-16, flexible"
            className="input-field"
          />
        </div>

        {/* Custom Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Categories
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(newCategory, 'categories', setNewCategory)}
              placeholder="Add custom category..."
              className="input-field"
            />
            <button 
              onClick={() => addItem(newCategory, 'categories', setNewCategory)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.categories?.map((category, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {category}
                <button onClick={() => removeItem(index, 'categories')}>
                  <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Routine Tasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Routine Tasks (AI will suggest these)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newRoutineTask}
              onChange={(e) => setNewRoutineTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(newRoutineTask, 'routineTasks', setNewRoutineTask)}
              placeholder="e.g., Check emails, Daily standup, Workout..."
              className="input-field"
            />
            <button 
              onClick={() => addItem(newRoutineTask, 'routineTasks', setNewRoutineTask)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.routineTasks?.map((task, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-sm">
                {task}
                <button onClick={() => removeItem(index, 'routineTasks')}>
                  <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Priority Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Keywords (things that are always high priority for you)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(newPriority, 'priorities', setNewPriority)}
              placeholder="e.g., deadline, urgent, meeting, client..."
              className="input-field"
            />
            <button 
              onClick={() => addItem(newPriority, 'priorities', setNewPriority)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.priorities?.map((priority, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full text-sm">
                {priority}
                <button onClick={() => removeItem(index, 'priorities')}>
                  <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Profile
        </button>
        <button onClick={() => setIsEditing(false)} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserProfile;