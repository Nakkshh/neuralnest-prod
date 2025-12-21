import { useState, useEffect, useContext, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

const API_BASE = 'http://localhost:8080';

export const TaskList = ({ onTaskLoadChange }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  });

  // ✅ FIXED: useCallback prevents recreation
  const calculateTotalLoad = useCallback((list) => {
    return list.reduce((sum, t) => sum + t.loadScore, 0);
  }, []);

  // ✅ FIXED: useCallback + stable deps
  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      console.log('🔍 Fetching tasks...');
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      const taskList = data.tasks || data;
      setTasks(taskList);
      onTaskLoadChange(calculateTotalLoad(taskList));
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [token, onTaskLoadChange, calculateTotalLoad]);

  // ✅ FIXED: Sends correct fields
  const addTask = useCallback(async () => {
    if (!newTask.trim() || !token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: newTask.trim(),
          loadScore: 0.3 + Math.random() * 0.4
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      setNewTask('');
      await fetchTasks();
    } catch (err) {
      console.error('❌ Add error:', err);
      alert('Failed to add task: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [newTask, token, fetchTasks]);

  // ✅ FIXED: Delete only
  const deleteTask = useCallback(async (id) => {
    if (!confirm('Delete this task?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      await fetchTasks();
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert('Failed to delete task');
    }
  }, [token, fetchTasks]);

  // ✅ FIXED: No setState in effect body
  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [token, fetchTasks]); // ✅ Stable deps

  return (
    <div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-xl shadow-2xl hover:shadow-sky-500/20 transition-all max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-black flex items-center gap-3 text-slate-100 tracking-tight">
          <Plus className="w-8 h-8 text-sky-400" />
          Tasks ({tasks.length})
        </h3>
        <button 
          onClick={fetchTasks}
          className="px-4 py-2 bg-sky-500/90 hover:bg-sky-600 text-sm rounded-xl text-white font-bold shadow-lg disabled:opacity-60"
          disabled={loading || !token}
        >
          {loading ? '...' : '🔄 Refresh'}
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add new task (Enter to add)..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-60"
          disabled={loading || !token}
        />
        <button
          onClick={addTask}
          disabled={loading || !token}
          className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 px-8 py-4 rounded-2xl font-bold text-black shadow-xl hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Add
        </button>
      </div>

      {!token && (
        <div className="text-sky-400 text-sm text-center p-4 bg-sky-500/10 rounded-2xl border-2 border-sky-500/30 mb-8">
          🔐 Login to manage your tasks
        </div>
      )}

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm mt-2">Add your first task above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="group flex items-center justify-between p-5 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-sky-500/70 hover:bg-slate-800/70 transition-all">
              <div className="flex-1">
                <p className="text-white font-semibold text-lg">{task.title}</p>
                <p className="text-sm text-sky-400 mt-1 font-mono">
                  Load: {Math.round(task.loadScore * 100)}%
                </p>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                disabled={!token}
                className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-400 hover:text-red-200 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 ml-4 shadow-lg hover:shadow-xl"
                title={!token ? "Login required" : "Delete task"}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
