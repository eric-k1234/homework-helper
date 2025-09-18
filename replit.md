# StudyHelper Platform

## Overview

StudyHelper is a collaborative learning platform designed to help students get help with their homework and academic questions. The platform allows users to post questions, receive answers from peers, and build a community around academic support. It features a gamification system with points, ranks, and achievements to encourage participation and quality contributions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Single-page application built with React and TypeScript for type safety
- **Vite**: Modern build tool for fast development and optimized production builds
- **Wouter**: Lightweight routing library for client-side navigation
- **TanStack Query**: Data fetching and state management for server state
- **Shadcn/ui Components**: Reusable UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling with custom design tokens

### Backend Architecture
- **Express.js**: RESTful API server handling authentication, questions, comments, and user management
- **TypeScript**: Type-safe server-side development
- **In-Memory Storage**: Development storage layer with plans for database integration
- **Session Management**: Express sessions for user authentication state
- **API Design**: RESTful endpoints organized by resource (auth, questions, comments, users)

### Database Schema Design
- **Drizzle ORM**: Type-safe database interactions with PostgreSQL
- **Users Table**: Stores user profiles with Firebase UID integration, points, ranks, and statistics
- **Questions Table**: Academic questions with metadata (subject, grade level, difficulty)
- **Comments Table**: Hierarchical comment system supporting replies and helpful marking
- **Achievements Table**: Gamification system tracking user accomplishments
- **Schema Sharing**: Common types shared between frontend and backend via shared directory

### Authentication System
- **Firebase Auth**: Third-party authentication provider supporting Google OAuth
- **Dual User System**: Firebase handles authentication, internal system manages user profiles
- **Session Persistence**: Server-side session management for API access
- **Protected Routes**: Client-side route protection based on authentication state

### State Management
- **TanStack Query**: Server state caching and synchronization
- **React Context**: Local component state where needed
- **Form State**: React Hook Form with Zod validation for type-safe form handling

## External Dependencies

### Authentication & Database
- **Firebase**: Authentication service with Google OAuth integration
- **Neon Database**: PostgreSQL hosting service for production database
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect

### UI & Styling
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Shadcn/ui**: Pre-built component library

### Development Tools
- **Vite**: Build tool with React plugin and development server
- **TypeScript**: Static type checking across the entire stack
- **Replit Plugins**: Development environment integration for runtime errors and debugging

### Core Libraries
- **TanStack Query**: Data fetching and caching
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation and schema definition
- **Wouter**: Lightweight routing
- **Date-fns**: Date manipulation utilities