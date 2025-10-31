import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const DashboardHistory = ({ userId, onLoadDashboard, colorTheme, currentDashboardId }) => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (userId) {
      loadDashboards();
    }
  }, [userId]);

  useEffect(() => {
    // Listen for dashboard save events
    const handleDashboardSaved = () => {
      if (userId) {
        loadDashboards();
      }
    };

    window.addEventListener('dashboardSaved', handleDashboardSaved);
    return () => window.removeEventListener('dashboardSaved', handleDashboardSaved);
  }, [userId]);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const { data: files, error } = await supabase.storage
        .from('files')
        .list(`dashboards/${userId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      const dashboardList = files.map(file => ({
        name: file.name,
        path: `dashboards/${userId}/${file.name}`,
        createdAt: file.created_at,
        id: file.id,
      }));

      setDashboards(dashboardList);
    } catch (error) {
      console.error('Error loading dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDashboard = async (path) => {
    try {
      const { data: fileData, error } = await supabase.storage
        .from('files')
        .download(path);

      if (error) throw error;

      const text = await fileData.text();
      const dashboard = JSON.parse(text);

      onLoadDashboard(dashboard, path);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      alert('Failed to load dashboard');
    }
  };

  const handleDeleteDashboard = async (path, name) => {
    if (!window.confirm(`Delete dashboard "${name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('files')
        .remove([path]);

      if (error) throw error;

      setDashboards(dashboards.filter(d => d.path !== path));
      alert('Dashboard deleted successfully!');
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      alert('Failed to delete dashboard');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-4 border-b" style={{ borderColor: colorTheme.border }}>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          Loading dashboards...
        </div>
      </div>
    );
  }

  if (dashboards.length === 0) {
    return null;
  }

  return (
    <div className="border-b" style={{ borderColor: colorTheme.border }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">
            Dashboard History ({dashboards.length})
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="max-h-64 overflow-y-auto">
          {dashboards.map((dashboard, index) => (
            <div
              key={dashboard.id || index}
              className={`flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors border-t ${
                currentDashboardId === dashboard.path ? 'bg-gray-700' : ''
              }`}
              style={{ borderColor: colorTheme.border }}
            >
              <button
                onClick={() => handleLoadDashboard(dashboard.path)}
                className="flex-1 text-left"
              >
                <p className={`text-sm font-medium ${
                  currentDashboardId === dashboard.path ? 'text-green-400' : 'text-white'
                }`}>
                  Dashboard {dashboards.length - index}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(dashboard.createdAt)}
                </p>
              </button>
              <button
                onClick={() => handleDeleteDashboard(dashboard.path, `Dashboard ${dashboards.length - index}`)}
                className="text-red-400 hover:text-red-300 transition-colors p-2"
                title="Delete dashboard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHistory;
