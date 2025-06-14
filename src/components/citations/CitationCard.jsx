import React, { useState } from 'react';
import { Trash2, ExternalLink, ChevronDown, ChevronUp, Edit3, Copy, BookOpen, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * 📚 Enhanced Citation Card Component
 * 
 * Features:
 * - Expand/collapse functionality
 * - Inline editing
 * - Delete with confirmation
 * - Copy citation formats
 * - External links (DOI, URL)
 * - Professional formatting
 */
export const CitationCard = ({ citation, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(citation);
  const [copySuccess, setCopySuccess] = useState('');

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this citation?')) {
      console.log('🗑️ CitationCard: Starting delete for citation:', citation.id);
      try {
        await onDelete(citation.id);
        console.log('✅ CitationCard: Delete completed successfully');
      } catch (err) {
        console.error('❌ CitationCard: Delete failed:', err);
      }
    }
  };

  const handleUpdate = async () => {
    await onUpdate(citation.id, editData);
    setIsEditing(false);
  };

  const copyToClipboard = async (text, format = 'APA') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${format} citation copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatCitation = (citation, style = 'apa') => {
    const authors = Array.isArray(citation.authors) 
      ? citation.authors.join(', ') 
      : citation.authors || 'Unknown Author';
    
    switch (style.toLowerCase()) {
      case 'apa':
        return `${authors} (${citation.year || 'n.d.'}). ${citation.title}. ${citation.journal || 'Unknown Journal'}${citation.volume ? `, ${citation.volume}` : ''}${citation.issue ? `(${citation.issue})` : ''}${citation.pages ? `, ${citation.pages}` : ''}${citation.doi ? `. https://doi.org/${citation.doi}` : ''}`;
      
      case 'mla':
        return `${authors}. "${citation.title}." ${citation.journal || 'Unknown Journal'}${citation.volume ? ` ${citation.volume}` : ''}${citation.issue ? `.${citation.issue}` : ''} (${citation.year || 'n.d.'}): ${citation.pages || 'n.p.'}. Web.`;
      
      case 'chicago':
        return `${authors}. "${citation.title}." ${citation.journal || 'Unknown Journal'}${citation.volume ? ` ${citation.volume}` : ''}${citation.issue ? `, no. ${citation.issue}` : ''} (${citation.year || 'n.d.'}): ${citation.pages || 'n.p.'}.`;
      
      default:
        return formatCitation(citation, 'apa');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="text-lg font-semibold"
                  placeholder="Citation title"
                />
                <Input
                  value={Array.isArray(editData.authors) ? editData.authors.join(', ') : editData.authors}
                  onChange={(e) => setEditData({...editData, authors: e.target.value.split(', ')})}
                  placeholder="Authors (comma separated)"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={editData.journal || ''}
                    onChange={(e) => setEditData({...editData, journal: e.target.value})}
                    placeholder="Journal"
                  />
                  <Input
                    type="number"
                    value={editData.year || ''}
                    onChange={(e) => setEditData({...editData, year: parseInt(e.target.value)})}
                    placeholder="Year"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                  {citation.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {Array.isArray(citation.authors) ? citation.authors.join(', ') : citation.authors}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {citation.journal && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{citation.journal}</span>
                    </div>
                  )}
                  {citation.year && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{citation.year}</span>
                    </div>
                  )}
                  {citation.created_at && (
                    <span className="text-xs">
                      Added {formatDate(citation.created_at)}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-blue-600"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(formatCitation(citation))}
              className="text-gray-400 hover:text-green-600"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* External Links */}
        {(citation.doi || citation.url) && (
          <div className="flex items-center gap-3 mt-3">
            {citation.doi && (
              <a
                href={`https://doi.org/${citation.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="h-3 w-3" />
                DOI
              </a>
            )}
            {citation.url && (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="h-3 w-3" />
                Full Text
              </a>
            )}
          </div>
        )}

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="mt-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              {copySuccess}
            </Badge>
          </div>
        )}
      </CardHeader>

      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Abstract */}
            {citation.abstract && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Abstract</h4>
                {isEditing ? (
                  <Textarea
                    value={editData.abstract || ''}
                    onChange={(e) => setEditData({...editData, abstract: e.target.value})}
                    placeholder="Abstract"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {citation.abstract}
                  </p>
                )}
              </div>
            )}

            {/* Publication Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Publication Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div><strong>Journal:</strong> {citation.journal || 'N/A'}</div>
                  <div><strong>Year:</strong> {citation.year || 'N/A'}</div>
                  <div><strong>Volume:</strong> {citation.volume || 'N/A'}</div>
                  <div><strong>Issue:</strong> {citation.issue || 'N/A'}</div>
                  <div><strong>Pages:</strong> {citation.pages || 'N/A'}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Identifiers</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div><strong>DOI:</strong> {citation.doi || 'N/A'}</div>
                  <div><strong>ID:</strong> {citation.id.substring(0, 8)}...</div>
                  {citation.metadata?.query_id && (
                    <div><strong>Query ID:</strong> {citation.metadata.query_id.toString().substring(0, 8)}...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {citation.tags && citation.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {citation.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Citation Formats */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Citation Formats</h4>
              <div className="space-y-3">
                {['APA', 'MLA', 'Chicago'].map((style) => (
                  <div key={style} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{style}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formatCitation(citation, style), style)}
                        className="text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {formatCitation(citation, style)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
