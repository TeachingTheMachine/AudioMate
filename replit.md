# Overview

This is a Text-to-Speech (TTS) API testing tool built as a full-stack web application. The application allows users to test and compare different TTS services by converting text to speech using various providers like OpenAI, Grok, Azure, Google Cloud, AWS Polly, and ElevenLabs. Users can input text, select voice settings, generate audio files, and review recent test results with playback functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite**: Fast build tool and dev server for optimal development experience
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Express.js**: Node.js web framework handling API routes and middleware
- **TypeScript**: Full type safety across the entire backend
- **Modular Storage**: Abstract storage interface with in-memory implementation, designed for easy database integration
- **TTS Integration**: Dedicated client modules for multiple TTS providers with unified interface
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Data Storage
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema Design**: Separate tables for users and TTS tests with proper relationships
- **Migration Support**: Drizzle Kit for database schema migrations
- **Fallback Storage**: In-memory storage implementation for development/testing

## API Design
- **RESTful Endpoints**: Clean API structure for TTS test operations
- **Request Validation**: Zod schemas for input validation and type safety
- **Response Formatting**: Consistent JSON response structure with proper error handling
- **Real-time Updates**: Polling-based updates for test status monitoring

## External Dependencies

### TTS Service Providers
- **OpenAI TTS API**: Primary TTS service with configurable voice and speed settings
- **Multiple Provider Support**: Architecture supports Grok, Azure Cognitive Services, Google Cloud TTS, AWS Polly, and ElevenLabs (implementations pending)

### Database Services
- **PostgreSQL**: Primary database with Neon Database serverless connector
- **Connection Pooling**: Optimized database connections for production use

### UI and Styling
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **TypeScript**: Comprehensive type checking across frontend and backend
- **ESBuild**: Fast bundling for production builds