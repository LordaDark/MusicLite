import { useState, useEffect } from 'react';
import { searchYouTube } from '@/services/api';
import { Song } from '@/types';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Search YouTube
        const searchResults = await searchYouTube(query);
        setResults(searchResults);
        
        // Add to search history if it's a new search
        if (query.trim() && !searchHistory.includes(query.trim())) {
          setSearchHistory(prev => [query.trim(), ...prev].slice(0, 10));
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(searchTimeout);
  }, [query]);
  
  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };
  
  const clearHistory = () => {
    setSearchHistory([]);
  };
  
  const removeFromHistory = (term: string) => {
    setSearchHistory(prev => prev.filter(item => item !== term));
  };
  
  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    searchHistory,
    clearSearch,
    clearHistory,
    removeFromHistory,
  };
};

export default useSearch;