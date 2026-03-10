"use client";
import { useState, useEffect, useCallback } from "react";

export function useProjects(token) {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  /* ── LOAD all projects ── */
  const fetchProjects = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/projects", { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  /* ── CREATE project ── */
  const createProject = async (name) => {
    setError(null);
    try {
      const res  = await fetch("/api/projects", {
        method:  "POST",
        headers: authHeaders,
        body:    JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      setProjects(prev => [data.project, ...prev]);
      return data.project;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /* ── DELETE project ── */
  const deleteProject = async (projectId) => {
    setError(null);
    try {
      const res  = await fetch(`/api/projects/${projectId}`, {
        method:  "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete project");
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /* ── RENAME project ── */
  const renameProject = async (projectId, name) => {
    setError(null);
    try {
      const res  = await fetch(`/api/projects/${projectId}/rename`, {
        method:  "PATCH",
        headers: authHeaders,
        body:    JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rename project");
      setProjects(prev =>
        prev.map(p => p.id === projectId ? { ...p, name } : p)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /* ── DUPLICATE project ── */
  const duplicateProject = async (projectId) => {
    setError(null);
    try {
      const res  = await fetch(`/api/projects/${projectId}/save-as`, {
        method:  "POST",
        headers: authHeaders,
        body:    JSON.stringify({ name: "Copy" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to duplicate project");
      setProjects(prev => [data.project, ...prev]);
      return data.project;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    renameProject,
    duplicateProject,
  };
}