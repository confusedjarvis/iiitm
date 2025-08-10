'use client';

import { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Save, 
  RotateCcw, 
  Settings, 
  ChevronDown,
  Clock,
  Memory,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supportedLanguages, type LanguageConfig } from '@/lib/services/judge0';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  questionId?: string;
  initialCode?: string;
  initialLanguage?: number;
  readOnly?: boolean;
  height?: string;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (languageId: number) => void;
}

interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  status: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}

export function CodeEditor({
  questionId,
  initialCode = '',
  initialLanguage = 71, // Python 3
  readOnly = false,
  height = '400px',
  onCodeChange,
  onLanguageChange,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');
  
  const editorRef = useRef<any>(null);
  const currentLanguage = supportedLanguages.find(lang => lang.id === selectedLanguage);

  // Fetch available languages
  const { data: languages } = useQuery(
    'languages',
    () => axios.get('/api/code/execute').then(res => res.data.languages),
    {
      initialData: supportedLanguages,
    }
  );

  // Execute code mutation
  const executeCodeMutation = useMutation(
    async (executeData: {
      code: string;
      languageId: number;
      input?: string;
      questionId?: string;
    }) => {
      const response = await axios.post('/api/code/execute', executeData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setExecutionResult(data.result);
        setOutput(data.result.stdout || data.result.stderr || data.result.compile_output || 'No output');
        setIsExecuting(false);
        
        if (data.result.status.id === 3) {
          toast.success('Code executed successfully!');
        } else if (data.result.status.id === 6) {
          toast.error('Compilation Error');
        } else {
          toast.error(`Execution failed: ${data.result.status.description}`);
        }
      },
      onError: (error: any) => {
        setIsExecuting(false);
        toast.error(error.response?.data?.error || 'Execution failed');
      },
    }
  );

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set up auto-completion and other editor features
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: fontSize,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  }, [onCodeChange]);

  const handleLanguageChange = (languageId: number) => {
    setSelectedLanguage(languageId);
    onLanguageChange?.(languageId);
    
    // Load boilerplate code for the new language
    const language = supportedLanguages.find(lang => lang.id === languageId);
    if (language?.boilerplate && !code.trim()) {
      setCode(language.boilerplate);
      onCodeChange?.(language.boilerplate);
    }
  };

  const executeCode = () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsExecuting(true);
    setOutput('Executing...');
    
    executeCodeMutation.mutate({
      code,
      languageId: selectedLanguage,
      input: input || undefined,
      questionId,
    });
  };

  const resetCode = () => {
    const language = supportedLanguages.find(lang => lang.id === selectedLanguage);
    const resetCode = language?.boilerplate || '';
    setCode(resetCode);
    onCodeChange?.(resetCode);
    setOutput('');
    setExecutionResult(null);
  };

  const saveCode = () => {
    // Implement save functionality
    toast.success('Code saved locally!');
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 3: return 'text-green-600'; // Accepted
      case 4: return 'text-red-600'; // Wrong Answer
      case 5: return 'text-yellow-600'; // Time Limit Exceeded
      case 6: return 'text-red-600'; // Compilation Error
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 3: return CheckCircle;
      case 4: 
      case 6: return XCircle;
      case 5: return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={readOnly}
            >
              {languages?.map((language: LanguageConfig) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Font Size */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Size:</span>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-xs text-gray-500 w-6">{fontSize}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {!readOnly && (
            <>
              <button
                onClick={resetCode}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={saveCode}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                title="Save Code"
              >
                <Save className="w-4 h-4" />
              </button>
              
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>{isExecuting ? 'Running...' : 'Run'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-b border-gray-200 bg-gray-50 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Theme:</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="vs">VS Code</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor and Output Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-2 bg-gray-100 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Code Editor</span>
          </div>
          <div className="flex-1">
            <Editor
              height={height}
              language={currentLanguage?.name.toLowerCase().split(' ')[0]}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              theme={theme}
              options={{
                readOnly,
                minimap: { enabled: false },
                fontSize,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* Input/Output Panel */}
        <div className="lg:w-1/3 flex flex-col border-l border-gray-200">
          {/* Input Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-2 bg-gray-100 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Input</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your program..."
              className="flex-1 p-3 resize-none focus:outline-none text-sm font-mono"
              disabled={readOnly}
            />
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col border-t border-gray-200">
            <div className="p-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Output</span>
              {executionResult && (
                <div className="flex items-center space-x-2">
                  {executionResult.time && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {executionResult.time}s
                    </span>
                  )}
                  {executionResult.memory && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <Memory className="w-3 h-3 mr-1" />
                      {(executionResult.memory / 1024).toFixed(1)}MB
                    </span>
                  )}
                  <div className={`flex items-center space-x-1 ${getStatusColor(executionResult.status.id)}`}>
                    {(() => {
                      const StatusIcon = getStatusIcon(executionResult.status.id);
                      return <StatusIcon className="w-3 h-3" />;
                    })()}
                    <span className="text-xs font-medium">
                      {executionResult.status.description}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 p-3 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto">
              <pre className="whitespace-pre-wrap">{output || 'Output will appear here...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}