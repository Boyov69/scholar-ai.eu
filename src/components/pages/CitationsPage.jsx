import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import {
  BookOpen,
  Download,
  Share,
  Search,
  Filter,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  FileText,
  Calendar,
  Users,
  Quote,
  ChevronDown,
  ChevronUp,
  Star,
  Bookmark,
  Tag,
  SortAsc,
  SortDesc,
  Grid,
  List,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/supabase';
import { citationFormats, exportFormats } from '../../lib/config';
import { CitationCard } from '../citations/CitationCard';

const CitationsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [citations, setCitations] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(searchParams.get('query') || '');
  const [citationStyle, setCitationStyle] = useState('apa');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(true); // Show comprehensive features by default
  
  // Citation expansion state
  const [expandedCitations, setExpandedCitations] = useState(new Set());
  const [selectedCitations, setSelectedCitations] = useState(new Set());
  
  // Export state
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadQueries();
      // Load all citations by default, or filter by selected query
      loadCitations(selectedQuery || 'all');
    }
  }, [isAuthenticated, selectedQuery]);

  // Add global refresh function for research page to trigger
  useEffect(() => {
    window.citationsPageRefresh = () => {
      console.log('🔄 Citations page refresh triggered from research completion');
      console.log('💾 Checking window storage for recent citations...');
      if (window.recentCitations && window.recentCitations.length > 0) {
        console.log('💾 Found recent citations in window storage:', window.recentCitations.length);
        setCitations(window.recentCitations);
      } else {
        loadCitations(selectedQuery || 'all');
      }
    };

    return () => {
      delete window.citationsPageRefresh;
    };
  }, [selectedQuery]);

  // Check if the selected query exists in the queries list
  useEffect(() => {
    if (selectedQuery && selectedQuery !== 'all' && queries.length > 0) {
      const queryExists = queries.find(q => q.id === selectedQuery);
      if (!queryExists) {
        console.warn('⚠️ Selected query not found in user queries, showing all citations');
        setSelectedQuery('all');
      }
    }
  }, [selectedQuery, queries]);

  const loadQueries = async () => {
    if (!user?.id) return;

    try {
      console.log('📋 Loading research queries for user:', user.id);
      const { data, error } = await db.getUserResearchQueries(user.id);
      if (error) throw error;
      console.log('📋 Found queries:', data?.length || 0);
      setQueries(data || []);
    } catch (err) {
      console.error('❌ Error loading queries:', err);
      setError(err.message);
    }
  };

  const loadCitations = async (queryId) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('🔍 Loading citations for user:', user.id, 'query:', queryId);

      // 🚀 ENHANCED: Check window storage first for recent citations
      if (window.recentCitations && window.recentCitations.length > 0) {
        console.log('💾 Found recent citations in window storage:', window.recentCitations.length);
        console.log('🔍 Window citations sample:', window.recentCitations[0]);

        if (queryId && queryId !== 'all') {
          // Filter by query_id if specified
          const queryCitations = window.recentCitations.filter(citation => {
            const matches = citation.metadata?.query_id === queryId || citation.query_id === queryId;
            console.log('🔍 Citation match check:', {
              citationId: citation.id,
              citationQueryId: citation.query_id,
              metadataQueryId: citation.metadata?.query_id,
              targetQueryId: queryId,
              matches
            });
            return matches;
          });
          console.log('🎯 Filtered window citations for query:', queryId, '- Found:', queryCitations.length, 'citations');

          if (queryCitations.length === 0) {
            console.log('⚠️ No matching citations found. Available query IDs:',
              window.recentCitations.map(c => c.query_id || c.metadata?.query_id).filter(Boolean)
            );
          }

          setCitations(queryCitations);
          setLoading(false);
          return;
        } else {
          // Show all window citations
          console.log('📚 Showing all window citations:', window.recentCitations.length);
          setCitations(window.recentCitations);
          setLoading(false);
          return;
        }
      } else {
        console.log('❌ No window citations found');
      }

      // Fallback to database if no window citations
      console.log('💾 No window citations found, loading from database...');
      const { data, error } = await db.getUserCitations(user.id);
      if (error) throw error;

      console.log('📚 All user citations:', data?.length || 0, 'citations found');

      if (queryId && queryId !== 'all') {
        // Filter by query_id if specified
        const queryCitations = data?.filter(citation =>
          citation.metadata?.query_id === queryId ||
          citation.query_id === queryId
        ) || [];
        console.log('🎯 Filtered citations for query:', queryId, '- Found:', queryCitations.length, 'citations');

        if (queryCitations.length === 0) {
          console.log('⚠️ No citations found for query:', queryId);
          console.log('📋 Available query IDs in citations:',
            data?.map(c => c.metadata?.query_id || c.query_id).filter(Boolean)
          );
        }

        setCitations(queryCitations);
      } else {
        // Show all citations
        console.log('📚 Showing all citations:', data?.length || 0);
        setCitations(data || []);
      }

      // Emergency fallback: if still no citations, create demo citations
      if ((!data || data.length === 0) && (!window.recentCitations || window.recentCitations.length === 0)) {
        console.log('🚨 Emergency fallback: Creating demo citations');
        const demoCitations = [
          {
            id: 'demo-citation-1',
            title: 'Demo Research Paper: AI in Academic Research',
            authors: ['Dr. Demo Author', 'Prof. Example Scholar'],
            journal: 'Demo Journal of Research',
            year: 2024,
            doi: '10.1000/demo.citation.001',
            url: 'https://example.com/demo-paper-1',
            abstract: 'This is a demonstration citation to show how the citation system works. In a real scenario, this would be replaced with actual research papers.',
            tags: ['Demo', 'AI Research'],
            user_id: user.id,
            created_at: new Date().toISOString(),
            metadata: {
              source_type: 'demo',
              note: 'This is a demonstration citation'
            }
          },
          {
            id: 'demo-citation-2',
            title: 'Example Study: Research Methodology in Digital Age',
            authors: ['Dr. Sample Researcher'],
            journal: 'Example Research Quarterly',
            year: 2024,
            doi: '10.1000/demo.citation.002',
            url: 'https://example.com/demo-paper-2',
            abstract: 'Another demonstration citation showing the citation management capabilities of Scholar AI.',
            tags: ['Demo', 'Methodology'],
            user_id: user.id,
            created_at: new Date().toISOString(),
            metadata: {
              source_type: 'demo',
              note: 'This is a demonstration citation'
            }
          }
        ];
        setCitations(demoCitations);
        console.log('✅ Demo citations created:', demoCitations.length);
      }

    } catch (err) {
      console.error('❌ Citation loading error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete Citation Function
  const deleteCitation = async (citationId) => {
    try {
      console.log('🗑️ CitationsPage: Starting delete for citation:', citationId);
      console.log('📊 Current citations count:', citations.length);

      const { error } = await db.deleteCitation(citationId);

      if (error) {
        console.error('❌ Database delete failed:', error);
        throw new Error(error.message || 'Failed to delete citation');
      }

      console.log('✅ Database delete successful, updating frontend state...');

      // Remove from local state
      const updatedCitations = citations.filter(c => c.id !== citationId);
      console.log('📊 Updated citations count:', updatedCitations.length);
      setCitations(updatedCitations);

      setSelectedCitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(citationId);
        return newSet;
      });

      console.log('✅ Frontend state updated successfully');
      setError(null); // Clear any previous errors
      setSuccessMessage('Citation deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error('❌ Delete citation error:', err);
      setError(err.message);
    }
  };

  // ✏️ Update Citation Function
  const updateCitation = async (citationId, updateData) => {
    try {
      console.log('✏️ Updating citation:', citationId, updateData);
      const { data, error } = await db.updateCitation(citationId, updateData);

      if (error) {
        throw new Error(error.message || 'Failed to update citation');
      }

      // Update local state
      setCitations(citations.map(c =>
        c.id === citationId ? { ...c, ...updateData } : c
      ));

      console.log('✅ Citation updated successfully');
    } catch (err) {
      console.error('❌ Update citation error:', err);
      setError(err.message);
    }
  };

  const toggleCitationExpansion = (citationId) => {
    const newExpanded = new Set(expandedCitations);
    if (newExpanded.has(citationId)) {
      newExpanded.delete(citationId);
    } else {
      newExpanded.add(citationId);
    }
    setExpandedCitations(newExpanded);
  };

  const toggleCitationSelection = (citationId) => {
    const newSelected = new Set(selectedCitations);
    if (newSelected.has(citationId)) {
      newSelected.delete(citationId);
    } else {
      newSelected.add(citationId);
    }
    setSelectedCitations(newSelected);
  };

  const selectAllCitations = () => {
    if (selectedCitations.size === filteredCitations.length) {
      setSelectedCitations(new Set());
    } else {
      setSelectedCitations(new Set(filteredCitations.map(c => c.id)));
    }
  };

  const formatCitation = (citation, style = citationStyle) => {
    // Handle authors field properly - could be array, string, or null
    let authors = 'Unknown Author';
    if (citation.authors) {
      if (typeof citation.authors === 'string') {
        authors = citation.authors;
      } else if (Array.isArray(citation.authors)) {
        authors = citation.authors.join(', ');
      }
    }

    // Extract year from publication_date if year field doesn't exist
    const year = citation.year ||
                 (citation.publication_date ? new Date(citation.publication_date).getFullYear() : 'n.d.');
    const title = citation.title || 'Untitled';
    const journal = citation.journal || '';
    const volume = citation.volume || '';
    const issue = citation.issue || '';
    const pages = citation.pages || '';
    const doi = citation.doi || '';
    const url = citation.url || '';

    switch (style) {
      case 'apa':
        return `${authors} (${year}). ${title}. ${journal}${volume ? `, ${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `, ${pages}` : ''}. ${doi ? `https://doi.org/${doi}` : url}`;
      
      case 'mla':
        return `${authors}. "${title}" ${journal}${volume ? ` ${volume}` : ''}${issue ? `.${issue}` : ''} (${year})${pages ? `: ${pages}` : ''}. Web.`;
      
      case 'chicago':
        return `${authors}. "${title}" ${journal}${volume ? ` ${volume}` : ''}${issue ? `, no. ${issue}` : ''} (${year})${pages ? `: ${pages}` : ''}. ${doi ? `https://doi.org/${doi}` : url}.`;
      
      case 'harvard':
        return `${authors}, ${year}. ${title}. ${journal}${volume ? `, ${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `, pp.${pages}` : ''}.`;
      
      case 'ieee':
        return `${authors}, "${title}," ${journal}${volume ? `, vol. ${volume}` : ''}${issue ? `, no. ${issue}` : ''}${pages ? `, pp. ${pages}` : ''}, ${year}.`;
      
      case 'vancouver':
        return `${authors}. ${title}. ${journal}. ${year}${volume ? `;${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `:${pages}` : ''}.`;
      
      default:
        return `${authors} (${year}). ${title}. ${journal}.`;
    }
  };

  const copyCitation = async (citation) => {
    const formatted = formatCitation(citation);
    try {
      await navigator.clipboard.writeText(formatted);
      // Show success feedback
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

  const exportCitations = async () => {
    if (selectedCitations.size === 0) {
      setError('Please select citations to export');
      return;
    }

    try {
      setExportLoading(true);
      const citationsToExport = citations.filter(c => selectedCitations.has(c.id));
      
      // Create export content based on format
      let content = '';
      let filename = '';
      
      switch (exportFormat) {
        case 'pdf':
          // Generate PDF content
          content = citationsToExport.map(c => formatCitation(c)).join('\n\n');
          filename = `citations_${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        
        case 'bibtex':
          content = citationsToExport.map(c => {
            const id = c.title?.replace(/\s+/g, '').substring(0, 20) || 'citation';
            return `@article{${id}${c.year || ''},
  title={${c.title || ''}},
  author={${c.authors?.join(' and ') || ''}},
  journal={${c.journal || ''}},
  volume={${c.volume || ''}},
  number={${c.issue || ''}},
  pages={${c.pages || ''}},
  year={${c.year || ''}},
  doi={${c.doi || ''}},
  url={${c.url || ''}}
}`;
          }).join('\n\n');
          filename = `citations_${new Date().toISOString().split('T')[0]}.bib`;
          break;
        
        case 'word':
          content = citationsToExport.map(c => formatCitation(c)).join('\n\n');
          filename = `citations_${new Date().toISOString().split('T')[0]}.docx`;
          break;
        
        case 'latex':
          content = `\\begin{thebibliography}{${citationsToExport.length}}\n\n` +
                   citationsToExport.map((c, i) => `\\bibitem{ref${i+1}} ${formatCitation(c)}`).join('\n\n') +
                   '\n\n\\end{thebibliography}';
          filename = `citations_${new Date().toISOString().split('T')[0]}.tex`;
          break;
        
        default:
          content = citationsToExport.map(c => formatCitation(c)).join('\n\n');
          filename = `citations_${new Date().toISOString().split('T')[0]}.txt`;
      }

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setExportLoading(false);
    }
  };

  // Filter and sort citations
  const filteredCitations = citations.filter(citation => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();

    // Handle authors field properly
    const authorsMatch = citation.authors ?
      (Array.isArray(citation.authors) ?
        citation.authors.some(author => author.toLowerCase().includes(searchLower)) :
        citation.authors.toLowerCase().includes(searchLower)
      ) : false;

    // Handle tags/keywords field properly
    const tagsMatch = (citation.keywords || citation.tags) ?
      (citation.keywords || citation.tags).some(tag => tag.toLowerCase().includes(searchLower)) : false;

    return (
      citation.title?.toLowerCase().includes(searchLower) ||
      authorsMatch ||
      citation.journal?.toLowerCase().includes(searchLower) ||
      citation.abstract?.toLowerCase().includes(searchLower) ||
      tagsMatch
    );
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title || '';
        bValue = b.title || '';
        break;
      case 'year':
        aValue = a.year || 0;
        bValue = b.year || 0;
        break;
      case 'journal':
        aValue = a.journal || '';
        bValue = b.journal || '';
        break;
      case 'authors':
        aValue = Array.isArray(a.authors) ? a.authors[0] || '' : a.authors || '';
        bValue = Array.isArray(b.authors) ? b.authors[0] || '' : b.authors || '';
        break;
      default: // relevance
        aValue = a.created_at || '';
        bValue = b.created_at || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="glass-strong max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4 text-white">Sign In Required</h2>
            <p className="text-gray-300 mb-6">
              Please sign in to access your research citations and manage your bibliography.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="ice-gradient hover:opacity-90"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold ice-gradient-text mb-2">
                Citation Manager
              </h1>
              <p className="text-gray-300 text-lg">
                {selectedQuery && selectedQuery !== 'all'
                  ? `Showing citations for: ${queries.find(q => q.id === selectedQuery)?.title || 'Selected Query'}`
                  : 'Organize, format, and export your research citations'
                }
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="border-primary/30"
              >
                {viewMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-primary/30"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Research Query</label>
                      <Select value={selectedQuery} onValueChange={setSelectedQuery}>
                        <SelectTrigger>
                          <SelectValue placeholder="All queries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All queries</SelectItem>
                          {queries.map(query => (
                            <SelectItem key={query.id} value={query.id}>
                              {query.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Citation Style</label>
                      <Select value={citationStyle} onValueChange={setCitationStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apa">APA</SelectItem>
                          <SelectItem value="mla">MLA</SelectItem>
                          <SelectItem value="chicago">Chicago</SelectItem>
                          <SelectItem value="harvard">Harvard</SelectItem>
                          <SelectItem value="ieee">IEEE</SelectItem>
                          <SelectItem value="vancouver">Vancouver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                          <SelectItem value="journal">Journal</SelectItem>
                          <SelectItem value="authors">Authors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Order</label>
                      <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="w-full justify-start border-primary/30"
                      >
                        {sortOrder === 'asc' ? (
                          <SortAsc className="h-4 w-4 mr-2" />
                        ) : (
                          <SortDesc className="h-4 w-4 mr-2" />
                        )}
                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search citations by title, author, journal, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={selectAllCitations}
                className="border-primary/30"
                disabled={filteredCitations.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {selectedCitations.size === filteredCitations.length ? 'Deselect All' : 'Select All'}
              </Button>
              
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="bibtex">BibTeX</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                  <SelectItem value="latex">LaTeX</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={exportCitations}
                disabled={selectedCitations.size === 0 || exportLoading}
                className="ice-gradient hover:opacity-90"
              >
                <Download className="h-4 w-4 mr-2" />
                Export ({selectedCitations.size})
              </Button>
            </div>
          </div>
        </motion.div>

        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Citations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-300">Loading citations...</p>
          </div>
        ) : filteredCitations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}
          >
            {filteredCitations.map((citation, index) => (
              <motion.div
                key={citation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CitationCard
                  citation={citation}
                  onDelete={deleteCitation}
                  onUpdate={updateCitation}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="glass-strong text-center">
            <CardContent className="pt-12 pb-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-white">No Citations Found</h3>
              <p className="text-gray-300 mb-6">
                {selectedQuery && selectedQuery !== 'all'
                  ? 'No citations found for this specific research query. The query may not have generated citations yet, or they may have been processed differently.'
                  : 'Start by submitting a research query to generate citations.'
                }
              </p>
              <div className="flex gap-3 justify-center">
                {selectedQuery && selectedQuery !== 'all' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedQuery('all');
                      loadCitations('all');
                    }}
                    className="border-primary/30"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Citations
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/research')}
                  className="ice-gradient hover:opacity-90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Start New Research
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {filteredCitations.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-400">
            Showing {filteredCitations.length} of {citations.length} citations
            {selectedCitations.size > 0 && (
              <span className="ml-2">• {selectedCitations.size} selected</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitationsPage;

