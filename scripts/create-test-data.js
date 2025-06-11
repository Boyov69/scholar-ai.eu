#!/usr/bin/env node

/**
 * Scholar AI Test Data Creation Script
 * 
 * This script creates test data for local development including:
 * - Test users with different subscription tiers
 * - Sample research queries
 * - Mock citations
 * - Test workspaces
 * 
 * Usage: node scripts/create-test-data.js
 */

const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test users data
const testUsers = [
  {
    email: 'student@localhost.dev',
    password: 'TestPassword123!',
    userData: {
      full_name: 'Alex Student',
      role: 'student',
      institution: 'University of Scholar AI',
      department: 'Computer Science',
      subscription_tier: 'free',
      subscription_status: 'inactive'
    }
  },
  {
    email: 'researcher@localhost.dev',
    password: 'TestPassword123!',
    userData: {
      full_name: 'Dr. Sarah Researcher',
      role: 'researcher',
      institution: 'Scholar AI Research Institute',
      department: 'Artificial Intelligence',
      subscription_tier: 'advanced_ai',
      subscription_status: 'active'
    }
  },
  {
    email: 'professor@localhost.dev',
    password: 'TestPassword123!',
    userData: {
      full_name: 'Prof. Michael Academic',
      role: 'professor',
      institution: 'European University',
      department: 'Data Science',
      subscription_tier: 'ultra_intelligent',
      subscription_status: 'active'
    }
  },
  {
    email: 'admin@localhost.dev',
    password: 'TestPassword123!',
    userData: {
      full_name: 'Admin User',
      role: 'professor',
      institution: 'Scholar AI',
      department: 'Administration',
      subscription_tier: 'phd_level',
      subscription_status: 'active'
    }
  }
];

// Sample research queries
const sampleQueries = [
  {
    query: 'What are the latest developments in transformer architectures for natural language processing?',
    agent_type: 'crow',
    status: 'completed',
    results: {
      summary: 'Recent developments include GPT-4, Claude, and various efficiency improvements...',
      citations: ['Smith et al. 2024', 'Johnson & Lee 2024'],
      confidence: 0.92
    }
  },
  {
    query: 'How does machine learning impact academic research methodologies?',
    agent_type: 'falcon',
    status: 'completed',
    results: {
      summary: 'Machine learning is revolutionizing research methodologies across disciplines...',
      citations: ['Brown et al. 2024', 'Davis & Wilson 2024'],
      confidence: 0.88
    }
  },
  {
    query: 'Generate APA citations for recent AI ethics papers',
    agent_type: 'owl',
    status: 'completed',
    results: {
      citations: [
        'Anderson, K. (2024). Ethical considerations in AI development. Journal of AI Ethics, 15(3), 45-62.',
        'Thompson, L., & Garcia, M. (2024). Bias in machine learning algorithms. AI & Society, 28(2), 123-140.'
      ]
    }
  }
];

// Sample citations
const sampleCitations = [
  {
    title: 'Attention Is All You Need',
    authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.', 'Uszkoreit, J.'],
    publication_date: '2017-06-12',
    journal: 'Advances in Neural Information Processing Systems',
    doi: '10.48550/arXiv.1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
    tags: ['transformers', 'attention', 'nlp', 'deep learning']
  },
  {
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Devlin, J.', 'Chang, M.W.', 'Lee, K.', 'Toutanova, K.'],
    publication_date: '2018-10-11',
    journal: 'arXiv preprint',
    doi: '10.48550/arXiv.1810.04805',
    url: 'https://arxiv.org/abs/1810.04805',
    abstract: 'We introduce a new language representation model called BERT...',
    tags: ['bert', 'transformers', 'nlp', 'pre-training']
  },
  {
    title: 'GPT-4 Technical Report',
    authors: ['OpenAI'],
    publication_date: '2023-03-15',
    journal: 'arXiv preprint',
    doi: '10.48550/arXiv.2303.08774',
    url: 'https://arxiv.org/abs/2303.08774',
    abstract: 'We report the development of GPT-4, a large-scale, multimodal model...',
    tags: ['gpt-4', 'large language models', 'multimodal', 'ai']
  }
];

async function createTestData() {
  console.log('🧪 Creating test data for Scholar AI localhost...\n');

  try {
    const createdUsers = [];

    // Create test users
    console.log('👥 Creating test users...');
    for (const testUser of testUsers) {
      console.log(`   Creating user: ${testUser.email}`);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: testUser.userData.full_name
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error(`   ❌ Failed to create user ${testUser.email}:`, authError.message);
        continue;
      }

      const userId = authData.user?.id;
      if (!userId) continue;

      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...testUser.userData,
          email: testUser.email
        });

      if (profileError) {
        console.error(`   ❌ Failed to update profile for ${testUser.email}:`, profileError.message);
        continue;
      }

      createdUsers.push({ ...testUser, userId });
      console.log(`   ✅ Created user: ${testUser.email}`);
    }

    // Create workspaces
    console.log('\n🏢 Creating test workspaces...');
    const workspaces = [];
    for (const user of createdUsers) {
      const workspaceName = `${user.userData.full_name}'s Research Space`;
      
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name: workspaceName,
          description: `Personal research workspace for ${user.userData.full_name}`,
          owner_id: user.userId,
          settings: {
            theme: 'dark',
            notifications: true,
            collaboration: true
          }
        })
        .select()
        .single();

      if (workspaceError) {
        console.error(`   ❌ Failed to create workspace for ${user.email}:`, workspaceError.message);
        continue;
      }

      workspaces.push({ ...workspace, ownerEmail: user.email });
      console.log(`   ✅ Created workspace: ${workspaceName}`);
    }

    // Create research queries
    console.log('\n🔍 Creating sample research queries...');
    for (const user of createdUsers.slice(0, 2)) { // Only for first 2 users
      for (const query of sampleQueries) {
        const { error: queryError } = await supabase
          .from('research_queries')
          .insert({
            user_id: user.userId,
            workspace_id: workspaces.find(w => w.owner_id === user.userId)?.id,
            ...query,
            metadata: {
              created_by: user.userData.full_name,
              test_data: true
            }
          });

        if (queryError) {
          console.error(`   ❌ Failed to create query for ${user.email}:`, queryError.message);
          continue;
        }
      }
      console.log(`   ✅ Created queries for: ${user.email}`);
    }

    // Create citations
    console.log('\n📚 Creating sample citations...');
    for (const user of createdUsers.slice(0, 3)) { // Only for first 3 users
      for (const citation of sampleCitations) {
        const { error: citationError } = await supabase
          .from('citations')
          .insert({
            user_id: user.userId,
            workspace_id: workspaces.find(w => w.owner_id === user.userId)?.id,
            ...citation,
            notes: `Added by ${user.userData.full_name} for testing`,
            metadata: {
              imported_by: user.userData.full_name,
              test_data: true
            }
          });

        if (citationError) {
          console.error(`   ❌ Failed to create citation for ${user.email}:`, citationError.message);
          continue;
        }
      }
      console.log(`   ✅ Created citations for: ${user.email}`);
    }

    // Create usage tracking data
    console.log('\n📊 Creating usage tracking data...');
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    for (const user of createdUsers) {
      const usageData = {
        user_id: user.userId,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        queries_used: Math.floor(Math.random() * 20) + 5,
        collaborators_count: Math.floor(Math.random() * 3) + 1,
        storage_used_mb: Math.floor(Math.random() * 500) + 100,
        workspaces_count: 1,
        citations_count: Math.floor(Math.random() * 15) + 5
      };

      const { error: usageError } = await supabase
        .from('usage_tracking')
        .upsert(usageData);

      if (usageError) {
        console.error(`   ❌ Failed to create usage data for ${user.email}:`, usageError.message);
        continue;
      }

      console.log(`   ✅ Created usage data for: ${user.email}`);
    }

    // Create notifications
    console.log('\n🔔 Creating sample notifications...');
    for (const user of createdUsers) {
      const notifications = [
        {
          user_id: user.userId,
          type: 'welcome',
          title: 'Welcome to Scholar AI!',
          message: 'Your account has been created successfully. Start exploring our AI-powered research tools.',
          metadata: { test_data: true }
        },
        {
          user_id: user.userId,
          type: 'subscription',
          title: 'Subscription Active',
          message: `Your ${user.userData.subscription_tier} subscription is now active.`,
          metadata: { test_data: true }
        }
      ];

      for (const notification of notifications) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notification);

        if (notificationError) {
          console.error(`   ❌ Failed to create notification for ${user.email}:`, notificationError.message);
        }
      }
      console.log(`   ✅ Created notifications for: ${user.email}`);
    }

    console.log('\n🎉 TEST DATA CREATION COMPLETE!');
    console.log('================================');
    console.log('\n👥 Test Users Created:');
    createdUsers.forEach(user => {
      console.log(`   📧 ${user.email} (${user.userData.subscription_tier})`);
      console.log(`   🔑 Password: ${user.password}`);
    });

    console.log('\n🌐 Access your local app at: http://localhost:5173');
    console.log('🗄️  Access Supabase Studio at: http://localhost:54323');
    console.log('\n🧪 Ready for testing and development!');

  } catch (error) {
    console.error('\n❌ Error creating test data:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createTestData().catch(console.error);
}

module.exports = { createTestData };
