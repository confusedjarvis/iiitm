'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Building, 
  Tag, 
  User, 
  Eye, 
  Download,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';

// Extended mock data with more variety
const mockQuestions = [
  {
    id: '1',
    title: 'Two Sum Problem - Google Technical Round',
    description: 'Detailed explanation of the Two Sum problem as asked in Google\'s technical interview. Includes follow-up questions about time complexity optimization.',
    company: 'Google',
    year: 2024,
    uploadType: 'text',
    uploaderName: 'Rajesh Kumar',
    status: 'approved',
    tags: ['Arrays', 'Hash Table', 'Two Pointers'],
    category: 'Data Structures',
    interviewRound: 'Technical Round 2',
    difficulty: 'Easy',
    viewCount: 1250,
    createdAt: '2024-01-15',
    questionText: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target...',
  },
  {
    id: '2',
    title: 'System Design: Design WhatsApp',
    description: 'Complete system design question asked in Microsoft senior software engineer interview. Covers scalability, real-time messaging, and database design.',
    company: 'Microsoft',
    year: 2024,
    uploadType: 'pdf',
    uploaderName: 'Priya Sharma',
    status: 'approved',
    tags: ['System Design', 'Scalability', 'Real-time'],
    category: 'System Design',
    interviewRound: 'Technical Round 3',
    difficulty: 'Hard',
    viewCount: 890,
    createdAt: '2024-01-10',
    fileName: 'whatsapp-system-design.pdf',
  },
  {
    id: '3',
    title: 'Binary Tree Level Order Traversal',
    description: 'Tree traversal problem from Amazon interview with multiple follow-up questions about space optimization and iterative vs recursive approaches.',
    company: 'Amazon',
    year: 2023,
    uploadType: 'text',
    uploaderName: 'Amit Singh',
    status: 'approved',
    tags: ['Trees', 'BFS', 'Queue'],
    category: 'Algorithms',
    interviewRound: 'Technical Round 1',
    difficulty: 'Medium',
    viewCount: 567,
    createdAt: '2023-12-20',
    questionText: 'Given the root of a binary tree, return the level order traversal of its nodes values...',
  },
  {
    id: '4',
    title: 'Behavioral: Tell me about a challenging project',
    description: 'Behavioral interview questions from Netflix focusing on leadership, teamwork, and problem-solving skills. Includes the STAR method framework.',
    company: 'Netflix',
    year: 2024,
    uploadType: 'text',
    uploaderName: 'Sneha Patel',
    status: 'approved',
    tags: ['Behavioral', 'Leadership', 'STAR Method'],
    category: 'Behavioral',
    interviewRound: 'HR Round',
    difficulty: 'Medium',
    viewCount: 432,
    createdAt: '2024-01-05',
    questionText: 'Tell me about a time when you had to work on a challenging project with tight deadlines...',
  },
  {
    id: '5',
    title: 'LRU Cache Implementation',
    description: 'Design and implement an LRU (Least Recently Used) cache as asked in Facebook interview. Discusses O(1) time complexity requirements.',
    company: 'Facebook',
    year: 2023,
    uploadType: 'text',
    uploaderName: 'Rohit Agarwal',
    status: 'approved',
    tags: ['Design', 'Hash Table', 'Linked List'],
    category: 'Design',
    interviewRound: 'Technical Round 2',
    difficulty: 'Hard',
    viewCount: 723,
    createdAt: '2023-11-15',
    questionText: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache...',
  },
  {
    id: '6',
    title: 'Database Design: E-commerce Platform',
    description: 'Database schema design question from Flipkart interview covering normalization, indexing, and query optimization for an e-commerce platform.',
    company: 'Flipkart',
    year: 2024,
    uploadType: 'pdf',
    uploaderName: 'Vikash Kumar',
    status: 'approved',
    tags: ['Database', 'SQL', 'Normalization'],
    category: 'Database Design',
    interviewRound: 'Technical Round 1',
    difficulty: 'Medium',
    viewCount: 345,
    createdAt: '2024-01-08',
    fileName: 'ecommerce-db-design.pdf',
  },
];

const categories = [
  'All Categories',
  'Data Structures',
  'Algorithms',
  'System Design',
  'Database Design',
  'Behavioral',
  'Design',
];

const companies = [
  'All Companies',
  'Google',
  'Microsoft',
  'Amazon',
  'Facebook',
  'Netflix',
  'Flipkart',
  'Apple',
  'Uber',
  'Salesforce',
];

const years = [
  'All Years',
  '2024',
  '2023',
  '2022',
  '2021',
];

const difficulties = [
  'All Difficulties',
  'Easy',
  'Medium',
  'Hard',
];

export default function QuestionsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCompany, setSelectedCompany] = useState('All Companies');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, most-viewed, company

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || question.category === selectedCategory;
    const matchesCompany = selectedCompany === 'All Companies' || question.company === selectedCompany;
    const matchesYear = selectedYear === 'All Years' || question.year.toString() === selectedYear;
    const matchesDifficulty = selectedDifficulty === 'All Difficulties' || question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesCompany && matchesYear && matchesDifficulty;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-viewed':
        return b.viewCount - a.viewCount;
      case 'company':
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewQuestion = (question: any) => {
    if (question.uploadType === 'text') {
      // Show question text in a modal or new page
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${question.title}</title>
              <style>
                body { 
                  font-family: system-ui, -apple-system, sans-serif; 
                  max-width: 800px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  line-height: 1.6; 
                }
                .header { 
                  border-bottom: 2px solid #e5e7eb; 
                  padding-bottom: 16px; 
                  margin-bottom: 24px; 
                }
                .meta { 
                  color: #6b7280; 
                  font-size: 14px; 
                  margin-bottom: 8px; 
                }
                .content { 
                  white-space: pre-wrap; 
                  font-size: 16px;
                }
                .tags {
                  margin-top: 20px;
                  display: flex;
                  gap: 8px;
                  flex-wrap: wrap;
                }
                .tag {
                  background: #f3f4f6;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  color: #374151;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${question.title}</h1>
                <div class="meta">Company: ${question.company} | Year: ${question.year} | Round: ${question.interviewRound}</div>
                <div class="meta">Difficulty: ${question.difficulty} | Uploaded by: ${question.uploaderName}</div>
                <div class="meta">Views: ${question.viewCount} | Date: ${new Date(question.createdAt).toLocaleDateString()}</div>
              </div>
              <div class="content">${question.questionText || question.description}</div>
              <div class="tags">
                ${question.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Interview Questions
            </h1>
            <p className="text-gray-600 mb-6">
              Explore real interview questions shared by verified IIIT Manipur alumni
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{mockQuestions.length}</div>
                    <div className="text-sm text-gray-500">Total Questions</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <Building className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{new Set(mockQuestions.map(q => q.company)).size}</div>
                    <div className="text-sm text-gray-500">Companies</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <User className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{new Set(mockQuestions.map(q => q.uploaderName)).size}</div>
                    <div className="text-sm text-gray-500">Contributors</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{mockQuestions.reduce((sum, q) => sum + q.viewCount, 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Views</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-viewed">Most Viewed</option>
                <option value="company">By Company</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'All Categories' || selectedCompany !== 'All Companies' || selectedYear !== 'All Years' || selectedDifficulty !== 'All Difficulties' || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                </span>
              )}
              {selectedCategory !== 'All Categories' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All Categories')} className="ml-2 text-green-600 hover:text-green-800">×</button>
                </span>
              )}
              {selectedCompany !== 'All Companies' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {selectedCompany}
                  <button onClick={() => setSelectedCompany('All Companies')} className="ml-2 text-purple-600 hover:text-purple-800">×</button>
                </span>
              )}
              {selectedYear !== 'All Years' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  {selectedYear}
                  <button onClick={() => setSelectedYear('All Years')} className="ml-2 text-orange-600 hover:text-orange-800">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedQuestions.length} of {mockQuestions.length} questions
          </p>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedQuestions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {question.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {question.company}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {question.year}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {question.uploadType === 'text' ? (
                    <button
                      onClick={() => handleViewQuestion(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Question"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                  
                  <Link
                    href={`/practice?question=${question.id}`}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Practice This Question"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {question.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {question.tags.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                    +{question.tags.length - 4} more
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span className="font-medium text-blue-600">{question.uploaderName}</span>
                    <span className="mx-2">•</span>
                    <span>{question.interviewRound}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {question.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {sortedQuestions.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new questions.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Practice Available Questions
              <Target className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}

        {/* Call to Action for Alumni */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Share Your Interview Experience
            </h2>
            <p className="text-lg mb-6">
              Help fellow students by sharing the questions you faced in your interviews. Your contribution can make a difference!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session?.user?.role === 'alumni' ? (
                <Link
                  href="/upload"
                  className="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Upload Questions
                </Link>
              ) : (
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Become a Contributor
                </Link>
              )}
              <Link
                href="/verify"
                className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors"
              >
                Verify as Alumni
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}