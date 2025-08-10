import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export interface LanguageConfig {
  id: number;
  name: string;
  boilerplate?: string;
  comment?: string;
}

export const supportedLanguages: LanguageConfig[] = [
  { 
    id: 71, 
    name: 'Python 3.8.1',
    boilerplate: `# Write your solution here
def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
    comment: '#'
  },
  { 
    id: 63, 
    name: 'JavaScript (Node.js 12.14.0)',
    boilerplate: `// Write your solution here
function solution() {
    // Your code here
}

// Test your solution
console.log(solution());`,
    comment: '//'
  },
  { 
    id: 54, 
    name: 'C++ (GCC 9.2.0)',
    boilerplate: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Write your solution here
int main() {
    // Your code here
    return 0;
}`,
    comment: '//'
  },
  { 
    id: 50, 
    name: 'C (GCC 9.2.0)',
    boilerplate: `#include <stdio.h>
#include <stdlib.h>

// Write your solution here
int main() {
    // Your code here
    return 0;
}`,
    comment: '//'
  },
  { 
    id: 62, 
    name: 'Java (OpenJDK 13.0.1)',
    boilerplate: `public class Solution {
    // Write your solution here
    public static void main(String[] args) {
        // Your code here
    }
}`,
    comment: '//'
  },
  { 
    id: 51, 
    name: 'C# (Mono 6.6.0.161)',
    boilerplate: `using System;

public class Solution 
{
    // Write your solution here
    public static void Main() 
    {
        // Your code here
    }
}`,
    comment: '//'
  },
  { 
    id: 70, 
    name: 'Python 2.7.17',
    boilerplate: `# Write your solution here
def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print result`,
    comment: '#'
  },
  { 
    id: 72, 
    name: 'Ruby (2.7.0)',
    boilerplate: `# Write your solution here
def solution
    # Your code here
end

# Test your solution
puts solution`,
    comment: '#'
  },
  { 
    id: 73, 
    name: 'Rust (1.40.0)',
    boilerplate: `// Write your solution here
fn main() {
    // Your code here
    println!("Hello, World!");
}`,
    comment: '//'
  },
  { 
    id: 60, 
    name: 'Go (1.13.5)',
    boilerplate: `package main

import "fmt"

// Write your solution here
func main() {
    // Your code here
    fmt.Println("Hello, World!")
}`,
    comment: '//'
  },
];

export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface SubmissionResponse {
  token: string;
}

export interface SubmissionResult {
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
  token: string;
}

class Judge0Service {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = JUDGE0_API_URL;
    this.apiKey = JUDGE0_API_KEY || '';
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-RapidAPI-Key'] = this.apiKey;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    return headers;
  }

  async submitCode(submission: SubmissionRequest): Promise<SubmissionResponse> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/submissions?base64_encoded=false&wait=false`,
        submission,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw new Error('Failed to submit code for execution');
    }
  }

  async getSubmissionResult(token: string): Promise<SubmissionResult> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/submissions/${token}?base64_encoded=false`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting submission result:', error);
      throw new Error('Failed to get submission result');
    }
  }

  async executeCode(
    code: string, 
    languageId: number, 
    input?: string,
    timeLimit: number = 2,
    memoryLimit: number = 128000
  ): Promise<SubmissionResult> {
    const submission: SubmissionRequest = {
      source_code: code,
      language_id: languageId,
      stdin: input,
      cpu_time_limit: timeLimit,
      memory_limit: memoryLimit,
    };

    const { token } = await this.submitCode(submission);
    
    // Poll for result
    let result: SubmissionResult;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      result = await this.getSubmissionResult(token);
      attempts++;
    } while (result.status.id <= 2 && attempts < maxAttempts); // Status 1-2 are processing states

    return result;
  }

  async runTestCases(
    code: string,
    languageId: number,
    testCases: Array<{ input: string; expectedOutput: string }>
  ): Promise<Array<{
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed: boolean;
    error?: string;
    time?: string;
    memory?: number;
  }>> {
    const results = [];

    for (const testCase of testCases) {
      try {
        const result = await this.executeCode(code, languageId, testCase.input);
        
        const actualOutput = result.stdout?.trim() || '';
        const expectedOutput = testCase.expectedOutput.trim();
        const passed = actualOutput === expectedOutput && result.status.id === 3; // Status 3 is accepted

        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          passed,
          error: result.stderr || result.compile_output || result.message,
          time: result.time,
          memory: result.memory,
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  getLanguageById(id: number): LanguageConfig | undefined {
    return supportedLanguages.find(lang => lang.id === id);
  }

  getLanguageByName(name: string): LanguageConfig | undefined {
    return supportedLanguages.find(lang => 
      lang.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async getLanguages(): Promise<LanguageConfig[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/languages`,
        { headers: this.getHeaders() }
      );

      // Filter to only supported languages
      const allLanguages = response.data;
      return supportedLanguages.filter(lang => 
        allLanguages.some((apiLang: any) => apiLang.id === lang.id)
      );
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Return static list if API fails
      return supportedLanguages;
    }
  }
}

export const judge0Service = new Judge0Service();

// Status mappings
export const statusMappings: Record<number, string> = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error (SIGSEGV)',
  8: 'Runtime Error (SIGXFSZ)',
  9: 'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
};