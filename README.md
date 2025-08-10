# 🎯 Interview Prep Platform - IIIT Manipur

A comprehensive interview preparation platform where **alumni can share real interview questions** and **students can practice coding** with an integrated Judge0 code editor. Built with Next.js, PostgreSQL, and modern web technologies.

## ✨ Features

### For Students
- 🔍 **Browse Questions**: Access real interview questions from top companies
- 💻 **Live Code Editor**: Practice coding with Judge0 integration (10+ languages)
- 📊 **Progress Tracking**: Track your practice sessions and improvements
- 🏷️ **Smart Filtering**: Filter by company, year, difficulty, and categories
- 📱 **Responsive Design**: Works seamlessly on all devices

### For Alumni
- 📝 **Question Upload**: Share interview experiences in text or PDF format
- 🔗 **LinkedIn Verification**: Verify alumni status through LinkedIn integration
- 👥 **Community Impact**: Help fellow students with authentic questions

### For Moderators
- ✅ **Content Moderation**: Review and approve submitted questions
- 👤 **Alumni Verification**: Verify alumni status and manage permissions
- 📈 **Analytics Dashboard**: Monitor platform usage and engagement

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL (Vercel Postgres)
- **Authentication**: NextAuth.js with LinkedIn OAuth
- **Code Execution**: Judge0 API integration
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-prep-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the following variables:
   ```env
   # Database (Get from Vercel Postgres)
   POSTGRES_URL=your_postgres_url
   POSTGRES_PRISMA_URL=your_postgres_prisma_url
   POSTGRES_URL_NO_SSL=your_postgres_url_no_ssl
   POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
   
   # Authentication
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # LinkedIn OAuth (for alumni verification)
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   
   # Judge0 API (for code execution)
   JUDGE0_API_KEY=your_rapidapi_key
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The platform uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: User accounts with roles (alumni, moderator, general)
- **questions**: Interview questions with metadata and content
- **user_progress**: Track user practice sessions and progress
- **practice_sessions**: Detailed session tracking with code submissions
- **code_submissions**: Judge0 integration for code execution
- **linkedin_verifications**: Alumni verification through LinkedIn
- **test_cases**: Test cases for coding problems
- **comments**: Discussion system for questions

## 🔧 Configuration

### Judge0 Setup
1. Get a RapidAPI key from [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Add the key to your environment variables
3. The platform supports 10+ programming languages including Python, JavaScript, C++, Java, etc.

### LinkedIn OAuth Setup
1. Create a LinkedIn app at [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Add your domain to authorized redirect URLs
3. Set the redirect URL to: `{your_domain}/api/auth/callback/linkedin`
4. Add the client ID and secret to your environment variables

### Vercel Postgres Setup
1. Create a new Vercel project
2. Add Vercel Postgres from the integrations tab
3. Copy the database environment variables to your `.env.local`

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically with each push

3. **Set up database**
   ```bash
   # Run migrations in Vercel
   npm run db:migrate
   ```

### Environment Variables for Production
Make sure to add all environment variables in your Vercel dashboard:
- Database credentials from Vercel Postgres
- NextAuth secret (generate a secure random string)
- LinkedIn OAuth credentials
- Judge0 API key

## 👥 User Roles

### General Users
- Can browse and practice with approved questions
- Can track their progress and performance
- Can request alumni verification

### Alumni (Verified)
- All general user permissions
- Can upload new interview questions
- Questions go through moderation before approval

### Moderators
- All user permissions
- Can approve/reject submitted questions
- Can verify alumni status
- Access to analytics and user management

## 🎨 Features Highlights

### Advanced Code Editor
- **Monaco Editor**: VS Code-like editing experience
- **Multiple Languages**: Python, JavaScript, C++, Java, C#, Go, Rust, Ruby
- **Live Execution**: Real-time code execution with Judge0
- **Custom Test Cases**: Run code against multiple test cases
- **Performance Metrics**: Execution time and memory usage tracking

### Smart Question Management
- **Duplicate Detection**: Automatic detection and merging of similar questions
- **Category Classification**: AI-powered categorization of questions
- **Advanced Search**: Filter by company, year, difficulty, tags, and categories
- **Progress Tracking**: Detailed analytics of user practice sessions

### Alumni Verification System
- **LinkedIn Integration**: Verify alumni status through LinkedIn profiles
- **Manual Review**: Moderators can manually verify users
- **Institute Validation**: Check for IIIT Manipur affiliation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- IIIT Manipur alumni community
- Judge0 for code execution infrastructure
- Vercel for hosting and database services
- All contributors and testers

---

**Built with ❤️ for the IIIT Manipur community**