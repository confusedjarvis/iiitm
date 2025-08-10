import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  jsonb,
  primaryKey,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['alumni', 'moderator', 'general']);
export const questionStatusEnum = pgEnum('question_status', ['pending', 'approved', 'rejected']);
export const uploadTypeEnum = pgEnum('upload_type', ['text', 'pdf']);
export const progressStatusEnum = pgEnum('progress_status', ['not_attempted', 'attempted', 'completed', 'bookmarked']);
export const moderationStatusEnum = pgEnum('moderation_status', ['pending', 'approved', 'rejected']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('general').notNull(),
  linkedinProfile: varchar('linkedin_profile', { length: 500 }),
  linkedinData: jsonb('linkedin_data'), // Store LinkedIn verification data
  isVerified: boolean('is_verified').default(false),
  isEmailVerified: boolean('is_email_verified').default(false),
  avatar: varchar('avatar', { length: 500 }),
  institute: varchar('institute', { length: 255 }),
  graduationYear: integer('graduation_year'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Questions table - Enhanced with coding problems support
export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  company: varchar('company', { length: 255 }).notNull(),
  year: integer('year').notNull(),
  uploadType: uploadTypeEnum('upload_type').notNull(),
  questionText: text('question_text'),
  
  // Coding problem specific fields
  problemStatement: text('problem_statement'),
  inputFormat: text('input_format'),
  outputFormat: text('output_format'),
  constraints: text('constraints'),
  sampleInput: text('sample_input'),
  sampleOutput: text('sample_output'),
  difficulty: varchar('difficulty', { length: 50 }), // Easy, Medium, Hard
  timeLimit: integer('time_limit'), // in milliseconds
  memoryLimit: integer('memory_limit'), // in MB
  
  fileUrl: varchar('file_url', { length: 500 }),
  fileName: varchar('file_name', { length: 255 }),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  uploaderName: varchar('uploader_name', { length: 255 }).notNull(),
  status: questionStatusEnum('status').default('pending').notNull(),
  tags: jsonb('tags'), // Array of tags
  category: varchar('category', { length: 100 }), // DSA, System Design, etc.
  interviewRound: varchar('interview_round', { length: 100 }), // Technical, HR, etc.
  
  // Moderation
  moderatedBy: uuid('moderated_by').references(() => users.id),
  moderationNotes: text('moderation_notes'),
  moderatedAt: timestamp('moderated_at'),
  
  // Analytics
  viewCount: integer('view_count').default(0),
  attemptCount: integer('attempt_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User progress tracking
export const userProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  status: progressStatusEnum('status').default('not_attempted').notNull(),
  difficultyRating: integer('difficulty_rating'), // 1-5
  notes: text('notes'),
  timeSpent: integer('time_spent').default(0), // in minutes
  attempts: integer('attempts').default(0),
  lastAttempted: timestamp('last_attempted'),
  isBookmarked: boolean('is_bookmarked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Practice sessions for detailed tracking
export const practiceSessions = pgTable('practice_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  questionId: uuid('question_id').references(() => questions.id),
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
  timeSpent: integer('time_spent').default(0), // in seconds
  
  // Code submission tracking
  code: text('code'),
  language: varchar('language', { length: 50 }),
  isCorrect: boolean('is_correct'),
  testCasesPassed: integer('test_cases_passed'),
  totalTestCases: integer('total_test_cases'),
  
  notes: text('notes'),
  difficultyRating: integer('difficulty_rating'), // 1-5
  createdAt: timestamp('created_at').defaultNow(),
});

// Code submissions for Judge0 integration
export const codeSubmissions = pgTable('code_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  questionId: uuid('question_id').references(() => questions.id),
  sessionId: uuid('session_id').references(() => practiceSessions.id),
  
  code: text('code').notNull(),
  language: varchar('language', { length: 50 }).notNull(),
  languageId: integer('language_id').notNull(), // Judge0 language ID
  
  // Judge0 response data
  judge0Token: varchar('judge0_token', { length: 255 }),
  status: varchar('status', { length: 50 }),
  stdout: text('stdout'),
  stderr: text('stderr'),
  compileOutput: text('compile_output'),
  message: text('message'),
  time: varchar('time', { length: 50 }),
  memory: integer('memory'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// LinkedIn verification requests
export const linkedinVerifications = pgTable('linkedin_verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  linkedinProfile: varchar('linkedin_profile', { length: 500 }).notNull(),
  linkedinData: jsonb('linkedin_data'), // Raw LinkedIn API response
  
  // Verification details
  institute: varchar('institute', { length: 255 }),
  graduationYear: integer('graduation_year'),
  currentPosition: varchar('current_position', { length: 255 }),
  
  status: moderationStatusEnum('status').default('pending').notNull(),
  moderatedBy: uuid('moderated_by').references(() => users.id),
  moderationNotes: text('moderation_notes'),
  moderatedAt: timestamp('moderated_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Test cases for coding problems
export const testCases = pgTable('test_cases', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id),
  input: text('input').notNull(),
  expectedOutput: text('expected_output').notNull(),
  isPublic: boolean('is_public').default(false), // Whether to show to users
  points: integer('points').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Comments and discussions
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id),
  userId: uuid('user_id').references(() => users.id),
  content: text('content').notNull(),
  parentId: uuid('parent_id'), // For nested comments
  isApproved: boolean('is_approved').default(true),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// System notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // question_approved, verification_approved, etc.
  isRead: boolean('is_read').default(false),
  metadata: jsonb('metadata'), // Additional data like question_id, etc.
  createdAt: timestamp('created_at').defaultNow(),
});

// Analytics and metrics
export const analytics = pgTable('analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 50 }).notNull(), // view, attempt, bookmark, etc.
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  questions: many(questions),
  progress: many(userProgress),
  sessions: many(practiceSessions),
  submissions: many(codeSubmissions),
  verifications: many(linkedinVerifications),
  comments: many(comments),
  notifications: many(notifications),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  uploader: one(users, {
    fields: [questions.uploadedBy],
    references: [users.id],
  }),
  moderator: one(users, {
    fields: [questions.moderatedBy],
    references: [users.id],
  }),
  progress: many(userProgress),
  sessions: many(practiceSessions),
  submissions: many(codeSubmissions),
  testCases: many(testCases),
  comments: many(comments),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [userProgress.questionId],
    references: [questions.id],
  }),
}));

export const practiceSessionsRelations = relations(practiceSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [practiceSessions.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [practiceSessions.questionId],
    references: [questions.id],
  }),
  submissions: many(codeSubmissions),
}));

export const codeSubmissionsRelations = relations(codeSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [codeSubmissions.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [codeSubmissions.questionId],
    references: [questions.id],
  }),
  session: one(practiceSessions, {
    fields: [codeSubmissions.sessionId],
    references: [practiceSessions.id],
  }),
}));

export const testCasesRelations = relations(testCases, ({ one }) => ({
  question: one(questions, {
    fields: [testCases.questionId],
    references: [questions.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [comments.questionId],
    references: [questions.id],
  }),
}));

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
export type PracticeSession = typeof practiceSessions.$inferSelect;
export type NewPracticeSession = typeof practiceSessions.$inferInsert;
export type CodeSubmission = typeof codeSubmissions.$inferSelect;
export type NewCodeSubmission = typeof codeSubmissions.$inferInsert;
export type TestCase = typeof testCases.$inferSelect;
export type NewTestCase = typeof testCases.$inferInsert;