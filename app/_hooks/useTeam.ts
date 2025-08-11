import { useState, useEffect, useMemo, useCallback } from 'react';
import { TeamMember, FilterState, Department } from '@/types/index';
import { setInStorage, getFromStorage } from '@/utils/api';

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data from localStorage or API
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get data from localStorage first
        const stored = await getFromStorage<TeamMember[]>('team-dashboard-members');
        if (stored) {
          setMembers(stored);
          setLoading(false);
          return;
        }

        // If no localStorage data, fetch from API
        const response = await fetch('/api/team');
        if (!response.ok) throw new Error('Failed to fetch team data');
        const data = await response.json();

        // Save to localStorage and state
        setInStorage('team-dashboard-members', data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error loading team data';
        setError(message);
        console.error('Error loading team data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const updateMember = useCallback(
    async (id: string, updates: Partial<TeamMember>) => {
      const originalMembers = [...members];
      try {
        const updatedMembers = members.map((member) =>
          member.id === id ? { ...member, ...updates } : member
        );

        await setInStorage('team-dashboard-members', updatedMembers);
        setMembers(updatedMembers);

        // Make API request
        const response = await fetch('/api/team', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        });

        if (!response.ok) throw new Error('Failed to update team member');

        // Get the response data
        const updatedMember = await response.json();

        // Validate the response
        if (!updatedMember || !updatedMember.id) {
          throw new Error('Invalid response from server');
        }
      } catch (err) {
        // Revert both state and localStorage on error
        await setInStorage('team-dashboard-members', originalMembers);
        setMembers(originalMembers);

        const message = err instanceof Error ? err.message : 'Error updating team member';
        setError(message);
        throw err;
      }
    },
    [members]
  );

  // Get member by ID
  const getMemberById = useCallback(
    (id: string) => {
      return members.find((member) => member.id === id);
    },
    [members]
  );

  return {
    members,
    loading,
    error,
    updateMember,
    getMemberById,
    setError,
  };
}

export function useTeamFilters(members: TeamMember[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: 'all',
  });

  // Filter members based on current filters
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDepartment =
        filters.department === 'all' || member.department === filters.department;

      return matchesSearch && matchesDepartment;
    });
  }, [members, filters]);

  // Get available departments
  const departments = useMemo(() => {
    const uniqueDepartments = Array.from(new Set(members.map((member) => member.department)));
    return uniqueDepartments.sort();
  }, [members]);

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateDepartment = useCallback((department: Department | 'all') => {
    setFilters((prev) => ({ ...prev, department }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', department: 'all' });
  }, []);

  return {
    filters,
    filteredMembers,
    departments,
    updateSearch,
    updateDepartment,
    clearFilters,
  };
}
