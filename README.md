# AI-Driven Productivity and Task Management Platform

A task management platform built using **Angular** for the frontend and **Node.js** with **MongoDB** for the backend. The platform allows users to register, log in, add tasks, manage task duration, and receive news summaries based on their interests, powered by AI.

![Task Management Logo](frontend/src/assets/logo.png)

## Features

- **User Authentication**: Users can register, log in, and have their tasks and interests saved.
- **CRUD Operations**: Users can create, read, update, and delete tasks and interests.
- **Productivity-Optimized Scheduling**: Generates personalized task schedules based on productivity predictions using XGBoost.
- **AI-Powered News Summarization**: Provides concise news summaries relevant to user-defined interests, powered by Transformers.
- **Task Duration Management**: Tracks task duration, allowing users to mark tasks as complete.
- **Persistent Data**: User data is stored in MongoDB for persistent use across sessions.

## Tech Stack

- **Frontend**: Angular
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Machine Learning**: XGBoost for productivity-based scheduling
- **NLP Summarization**: Transformers for summarizing news articles
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Angular CLI](https://angular.io/cli)
- [Python 3](https://www.python.org/) and required packages for ML (if running the Flask API for ML integration)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/task-manager-platform.git
   cd task-manager-platform
