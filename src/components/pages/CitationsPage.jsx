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
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/supabase';
import { citationFormats, exportFormats } from '../../lib/config';

const CitationsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [citations, setCitations] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(searchParams.get('query') || '');
  const [citationStyle, setCitationStyle] = useState('apa');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  
  // Citation expansion state
  const [expandedCitations, setExpandedCitations] = useState(new Set());
  const [selectedCitations, setSelectedCitations] = useState(new Set());
  
  // Export state
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadQueries();
      if (selectedQuery) {
        loadCitations(selectedQuery);
      }
    }
  }, [isAuthenticated, selectedQuery]);

  const loadQueries = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await db.getUserResearchQueries(user.id);
      if (error) throw error;
      setQueries(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCitations = async (queryId) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Get all user citations and filter by query_id
      const { data, error } = await db.getUserCitations(user.id);
      if (error) throw error;
      
      const queryCitations = data?.filter(citation => citation.query_id === queryId) || [];
      setCitations(queryCitations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    const authors = citation.authors?.join(', ') || 'Unknown Author';
    const year = citation.year || 'n.d.';
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
    return (
      citation.title?.toLowerCase().includes(searchLower) ||
      citation.authors?.some(author => author.toLowerCase().includes(searchLower)) ||
      citation.journal?.toLowerCase().includes(searchLower) ||
      citation.abstract?.toLowerCase().includes(searchLower) ||
      citation.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
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
        aValue = a.authors?.[0] || '';
        bValue = b.authors?.[0] || '';
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
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
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
              <p className="text-muted-foreground text-lg">
                Organize, format, and export your research citations
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
                      <label className="text-sm font-medium">Research Query</label>
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
                      <label className="text-sm font-medium">Citation Style</label>
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
                      <label className="text-sm font-medium">Sort By</label>
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
                      <label className="text-sm font-medium">Order</label>
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
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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

        {/* Citations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading citations...</p>
          </div>
        ) : filteredCitations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}
          >
            {filteredCitations.map((citation, index) => {
              const isExpanded = expandedCitations.has(citation.id);
              const isSelected = selectedCitations.has(citation.id);
              
              return (
                <motion.div
                  key={citation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`glass hover:glass-strong transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-primary/50' : ''
                  }`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCitationSelection(citation.id)}
                              className="rounded border-border"
                            />
                            <CardTitle className="text-lg leading-tight">
                              {citation.title}
                            </CardTitle>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {citation.authors?.slice(0, 3).join(', ')}
                              {citation.authors?.length > 3 && ' et al.'}
                            </div>
                            {citation.year && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {citation.year}
                              </div>
                            )}
                            {citation.journal && (
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {citation.journal}
                              </div>
                            )}
                          </div>

                          {citation.keywords && citation.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {citation.keywords.slice(0, 5).map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCitation(citation)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {citation.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(citation.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCitationExpansion(citation.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Formatted Citation */}
                      <div className="bg-muted/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Quote className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{citationStyle.toUpperCase()} Format</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {formatCitation(citation)}
                        </p>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <Separator />
                          
                          {citation.abstract && (
                            <div>
                              <h4 className="font-medium mb-2">Abstract</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {citation.abstract}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {citation.doi && (
                              <div>
                                <span className="font-medium">DOI:</span>
                                <p className="text-muted-foreground">{citation.doi}</p>
                              </div>
                            )}
                            {citation.volume && (
                              <div>
                                <span className="font-medium">Volume:</span>
                                <p className="text-muted-foreground">{citation.volume}</p>
                              </div>
                            )}
                            {citation.issue && (
                              <div>
                                <span className="font-medium">Issue:</span>
                                <p className="text-muted-foreground">{citation.issue}</p>
                              </div>
                            )}
                            {citation.pages && (
                              <div>
                                <span className="font-medium">Pages:</span>
                                <p className="text-muted-foreground">{citation.pages}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <Card className="glass-strong text-center">
            <CardContent className="pt-12 pb-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Citations Found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedQuery 
                  ? 'No citations found for the selected query. Try a different query or search term.'
                  : 'Start by submitting a research query to generate citations.'
                }
              </p>
              <Button 
                onClick={() => navigate('/research')}
                className="ice-gradient hover:opacity-90"
              >
                <Search className="h-4 w-4 mr-2" />
                Start Research
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {filteredCitations.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
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

