'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Play, 
  Book, 
  Clock, 
  Trophy, 
  Filter,
  Search,
  ArrowRight,
  Code2,
  Target,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { CodeEditor } from '@/components/code-editor';

// Mock data for demonstration
const mockQuestions = [
  {
    id: '1',
    title: 'Two Sum Problem',
    company: 'Google',
    year: 2024,
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    tags: ['Arrays', 'Hash Table'],
    solvedBy: 1250,
    successRate: 87
  },
  {
    id: '2',
    title: 'Binary Tree Level Order Traversal',
    company: 'Microsoft',
    year: 2024,
    difficulty: 'Medium',
    category: 'Trees',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
    tags: ['Tree', 'BFS', 'Queue'],
    solvedBy: 890,
    successRate: 73
  },
  {
    id: '3',
    title: 'LRU Cache Implementation',
    company: 'Amazon',
    year: 2023,
    difficulty: 'Hard',
    category: 'Design',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    tags: ['Design', 'Hash Table', 'Linked List'],
    solvedBy: 456,
    successRate: 45
  },
  {
    id: '4',
    title: 'Valid Parentheses',
    company: 'Facebook',
    year: 2024,
    difficulty: 'Easy',
    category: 'Stack',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    tags: ['Stack', 'String'],
    solvedBy: 2100,
    successRate: 92
  },
  {
    id: '5',
    title: 'Merge k Sorted Lists',
    company: 'Netflix',
    year: 2023,
    difficulty: 'Hard',
    category: 'Linked List',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
    tags: ['Linked List', 'Divide and Conquer', 'Heap'],
    solvedBy: 334,
    successRate: 38
  }
];

const categories = ['All', 'Arrays', 'Trees', 'Design', 'Stack', 'Linked List', 'Dynamic Programming'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const companies = ['All', 'Google', 'Microsoft', 'Amazon', 'Facebook', 'Netflix', 'Apple'];

export default function PracticePage() {
  const { data: session } = useSession();
  const [selectedQuestion, setSelectedQuestion] = useState(mockQuestions[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || question.difficulty === selectedDifficulty;
    const matchesCompany = selectedCompany === 'All' || question.company === selectedCompany;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesCompany;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Practice Coding Problems
            </h1>
            <p className="text-gray-600 mb-6">
              Solve real interview questions from top companies with our integrated code editor
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <Book className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{mockQuestions.length}</div>
                    <div className="text-sm text-gray-500">Problems Available</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Problems Solved</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">0h</div>
                    <div className="text-sm text-gray-500">Practice Time</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">0%</div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 h-[800px] flex flex-col">
              {/* Search and Filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Filters
                </button>
                
                {showFilters && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                      <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {companies.map(company => (
                          <option key={company} value={company}>{company}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <motion.div
                    key={question.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedQuestion(question)}
                    className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                      selectedQuestion.id === question.id 
                        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{question.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {question.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{question.company} • {question.year}</span>
                      <span>{question.successRate}% success</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {question.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{question.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Problem Details and Code Editor */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg border border-gray-200 h-[800px] flex flex-col">
              {/* Problem Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedQuestion.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Code2 className="w-4 h-4 mr-1" />
                        {selectedQuestion.company}
                      </span>
                      <span>{selectedQuestion.year}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                        {selectedQuestion.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {session ? (
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Play className="w-4 h-4 mr-2" />
                      Start Solving
                    </button>
                  ) : (
                    <Link 
                      href="/auth/signin"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign In to Practice
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </div>

                {/* Problem Description */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700">{selectedQuestion.description}</p>
                  
                  {/* Example - Mock data */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
                    <div className="bg-gray-50 p-3 rounded border text-sm font-mono">
                      <div><strong>Input:</strong> nums = [2,7,11,15], target = 9</div>
                      <div><strong>Output:</strong> [0,1]</div>
                      <div><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                    </div>
                  </div>

                  {/* Constraints */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Constraints:</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                      <li>2 ≤ nums.length ≤ 10⁴</li>
                      <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                      <li>-10⁹ ≤ target ≤ 10⁹</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1">
                {session ? (
                  <CodeEditor
                    questionId={selectedQuestion.id}
                    height="100%"
                    initialCode={`# ${selectedQuestion.title}
# Company: ${selectedQuestion.company} (${selectedQuestion.year})
# Difficulty: ${selectedQuestion.difficulty}

def solution():
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Sign In to Start Coding
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Access our advanced code editor with real-time execution
                      </p>
                      <Link
                        href="/auth/signin"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sign In Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        {!session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="max-w-3xl mx-auto text-center">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Unlock Full Practice Mode
              </h2>
              <p className="text-lg mb-6">
                Get access to our advanced code editor, progress tracking, and personalized recommendations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}