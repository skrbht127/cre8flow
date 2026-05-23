# Overview
This repository contains a Vercel-based React application with a Supabase database. The application is a workflow management tool that utilizes LangChain and Groq for AI-powered features.

# Routing
The application uses React Router DOM for routing. The main routes are:
* `/workflow/:id`: a dynamic route for workflow pages

# API
The application has a serverless API endpoint at `/api/generate`, which handles requests for generating workflow data. The API uses LangChain and Groq to inject knowledge base context and return JSON data.

# Database
The application uses a Supabase database with two tables: `workflows` and `blocks`. The `workflows` table stores data for workflows, and the `blocks` table stores data for blocks associated with each workflow.

# Knowledge Base
The application has a structured JSON knowledge base in `src/lib/knowledge.ts`, which includes:
* **HOOK_FORMULAS**: 7 patterns for writing hooks
* **SHOT_TYPES**: 6 types of shots for video production
* **SCRIPT_STRUCTURES**: 4 structures for writing scripts
* **EDIT_PATTERNS**: 8 rules for editing video
* **PUBLISH_STRATEGIES**: 3 platforms for publishing video content

# Monetization Strategy
The application has a free tier and a pro tier. The free tier is limited to 3 workflows and AI-powered features for hooks and scripts only. The pro tier offers unlimited workflows, all 5 AI-powered features, export, custom pipeline, and personal style memory.

# Constraints
The application has the following constraints:
* No paid APIs (using Groq free tier only)
* No HuggingFace Spaces backend (due to cold start UX issues)
* No auth on MVP (feature depth first)
* Windows machine (using PowerShell)

# Decisions
The following decisions have been made for this project:
* Use Vercel over HuggingFace Spaces for the backend
* Use Groq as the primary language model
* Use Supabase for the database
* Implement a free tier and pro tier for monetization

# Project State
The project is currently in the development phase. The following features are currently implemented:
* Workflow management
* AI-powered generation for hooks and scripts
* Knowledge base
* Free tier and pro tier monetization strategy

## New Section
This is a new section that has been added to the MASTER_CONTEXT.md file.
