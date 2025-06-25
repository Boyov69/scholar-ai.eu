// Academic tools configuration for Scholar-AI workspace
export const ACADEMIC_TOOLS = {
  discovery: [
    {
      id: 'feedly',
      name: 'Feedly',
      icon: '📰',
      description: 'RSS Feed Manager',
      configurable: true,
      config: {
        apiKey: '',
        categories: ['research', 'academia', 'science'],
        autoUpdate: true,
        notificationsEnabled: true
      }
    },
    {
      id: 'audemic',
      name: 'Audemic',
      icon: '🎧',
      description: 'Listen to Papers',
      configurable: true,
      config: {
        voiceType: 'natural',
        readingSpeed: 1.0,
        highlightText: true,
        downloadEnabled: true
      }
    },
    {
      id: 'zotero',
      name: 'Zotero',
      icon: '📚',
      description: 'Reference Manager',
      configurable: true,
      config: {
        syncEnabled: true,
        defaultCitationStyle: 'APA',
        groupsEnabled: true,
        autoImport: true
      }
    },
    {
      id: 'xmind',
      name: 'XMind',
      icon: '🧠',
      description: 'Mind Mapping',
      configurable: true,
      config: {
        autoLayout: true,
        saveInterval: 5,
        theme: 'academic',
        exportFormats: ['png', 'pdf']
      }
    }
  ],
  writing: [
    {
      id: 'writefull',
      name: 'Writefull',
      icon: '✏️',
      description: 'AI Proofreading',
      configurable: true,
      config: {
        checkGrammar: true,
        checkStyle: true,
        academicTone: true,
        realTimeCheck: false
      }
    },
    {
      id: 'phrasebank',
      name: 'Phrasebank',
      icon: '💬',
      description: 'Academic Phrases',
      configurable: true,
      config: {
        categories: ['introduction', 'methodology', 'results', 'discussion'],
        favoriteEnabled: true,
        customPhrases: true,
        disciplineSpecific: 'general'
      }
    },
    {
      id: 'linguee',
      name: 'Linguee',
      icon: '🌐',
      description: 'Translation',
      configurable: true,
      config: {
        primaryLanguage: 'en',
        secondaryLanguages: ['fr', 'de', 'es'],
        contextExamples: true,
        academicFocus: true
      }
    },
    {
      id: 'thesaurus',
      name: 'Thesaurus',
      icon: '📖',
      description: 'Synonyms',
      configurable: true,
      config: {
        academicLevel: 'advanced',
        contextAware: true,
        includeAntonyms: true,
        saveFavorites: true
      }
    }
  ],
  collaboration: [
    {
      id: 'authorea',
      name: 'Authorea',
      icon: '👥',
      description: 'Collaborative Writing',
      configurable: true,
      config: {
        autoSave: true,
        trackChanges: true,
        commentNotifications: true,
        citationStyle: 'APA'
      }
    },
    {
      id: 'overleaf',
      name: 'Overleaf',
      icon: '📄',
      description: 'LaTeX Editor',
      configurable: true,
      config: {
        autoCompile: true,
        spellCheck: true,
        theme: 'light',
        pdfPreview: true
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      description: 'Team Chat',
      configurable: true,
      config: {
        workspaceUrl: '',
        notifications: true,
        channels: ['general', 'research'],
        fileSharing: true
      }
    },
    {
      id: 'loom',
      name: 'Loom',
      icon: '📹',
      description: 'Video Messages',
      configurable: true,
      config: {
        hdRecording: true,
        maxDuration: 15,
        autoTranscribe: true,
        embedEnabled: true
      }
    }
  ],
  productivity: [
    {
      id: 'toggl',
      name: 'Toggl',
      icon: '⏱️',
      description: 'Time Tracking',
      configurable: true,
      config: {
        projectCategories: ['research', 'writing', 'meetings'],
        reminderInterval: 30,
        idleDetection: true,
        reportEnabled: true
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: '🌳',
      description: 'Focus App',
      configurable: true,
      config: {
        sessionDuration: 25,
        breakDuration: 5,
        allowedApps: [],
        soundEnabled: true
      }
    },
    {
      id: 'focusmate',
      name: 'Focusmate',
      icon: '👥',
      description: 'Virtual Coworking',
      configurable: true,
      config: {
        sessionDuration: 50,
        calendarSync: true,
        cameraEnabled: true,
        reminders: true
      }
    },
    {
      id: 'coldturkey',
      name: 'Cold Turkey',
      icon: '🦃',
      description: 'Website Blocker',
      configurable: true,
      config: {
        blockedSites: ['facebook.com', 'twitter.com'],
        scheduledBlocking: true,
        allowedTimePerDay: 30,
        strictMode: true
      }
    }
  ],
  project: [
    {
      id: 'trello',
      name: 'Trello',
      icon: '📋',
      description: 'Project Management',
      configurable: true,
      config: {
        defaultBoard: 'Research Project',
        labels: ['urgent', 'in-progress', 'completed'],
        notifications: true,
        dueReminders: true
      }
    },
    {
      id: 'todoist',
      name: 'Todoist',
      icon: '✅',
      description: 'Task Management',
      configurable: true,
      config: {
        priorityLevels: true,
        recurringTasks: true,
        projectCategories: ['research', 'writing', 'admin'],
        reminderTime: '09:00'
      }
    }
  ],
  transcription: [
    {
      id: 'otter',
      name: 'Otter',
      icon: '🎙️',
      description: 'AI Transcription',
      configurable: true,
      config: {
        language: 'en',
        speakerIdentification: true,
        keywordHighlighting: true,
        exportFormat: 'docx'
      }
    }
  ]
};

// Tool mapping per pipeline stage
export const STAGE_TOOL_MAPPING = {
  think: ['xmind', 'focusmate', 'forest', 'authorea'],
  query: ['xmind', 'feedly', 'audemic'],
  search: ['zotero', 'feedly', 'crow', 'falcon'],
  citation: ['zotero', 'writefull', 'phrasebank'],
  collaboration: ['authorea', 'overleaf', 'slack', 'loom'],
  test: ['overleaf', 'slack', 'loom', 'toggl'],
  ship: ['writefull', 'linguee', 'overleaf', 'todoist']
};

// Pipeline stages configuration
export const PIPELINE_STAGES = [
  { id: 'think', name: 'Think', icon: '💡', description: 'Analyze and synthesize' },
  { id: 'query', name: 'Query', icon: '🔍', description: 'Define your research question' },
  { id: 'search', name: 'Search', icon: '📚', description: 'Find relevant literature' },
  { id: 'citation', name: 'Citation', icon: '📝', description: 'Organize your references' },
  { id: 'collaboration', name: 'Collaboration', icon: '👥', description: 'Work with others' },
  { id: 'test', name: 'Test', icon: '🧪', description: 'Validate your findings' },
  { id: 'ship', name: 'Ship', icon: '🚀', description: 'Publish your research' }
];

export default {
  ACADEMIC_TOOLS,
  STAGE_TOOL_MAPPING,
  PIPELINE_STAGES
};