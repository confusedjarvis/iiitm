import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { judge0Service } from '@/lib/services/judge0';
import { db } from '@/lib/db';
import { codeSubmissions, practiceSessions } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      code, 
      languageId, 
      input, 
      questionId, 
      sessionId,
      timeLimit = 2,
      memoryLimit = 128000 
    } = await request.json();

    if (!code || !languageId) {
      return NextResponse.json(
        { error: 'Code and language ID are required' },
        { status: 400 }
      );
    }

    // Execute code using Judge0
    const result = await judge0Service.executeCode(
      code, 
      languageId, 
      input, 
      timeLimit, 
      memoryLimit
    );

    // Store submission in database
    const submissionData = {
      userId: session.user.id,
      questionId: questionId || null,
      sessionId: sessionId || null,
      code,
      language: judge0Service.getLanguageById(languageId)?.name || 'Unknown',
      languageId,
      judge0Token: result.token,
      status: result.status.description,
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      message: result.message,
      time: result.time,
      memory: result.memory,
    };

    const [submission] = await db
      .insert(codeSubmissions)
      .values(submissionData)
      .returning();

    return NextResponse.json({
      submissionId: submission.id,
      result: {
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
        message: result.message,
        status: result.status,
        time: result.time,
        memory: result.memory,
      },
    });
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}

// Get execution languages
export async function GET() {
  try {
    const languages = await judge0Service.getLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}