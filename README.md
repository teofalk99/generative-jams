# Generative Jams

Generative Jams is a web-based application that generates AI-powered image slideshows based on song lyrics. The project integrates a dynamic front-end built with React.js, a back-end server using Python's Quart framework, and a MySQL database for storing user feedback.

---

## 🚀 Features

### Frontend
- **Model Selection**: Switch between the FastFlux model by Runway and DALL-E 3 by OpenAI.
- **Image Generation**: Visualize AI-generated image slideshows tied to the mood and themes of song lyrics.
- **Audio Recording**: Record a short audio clip to identify songs via a Shazam-like API.
- **User Feedback**: Submit feedback on image quality and relevance through an interactive form.

### Backend
- **Image Generation API**: Uses OpenAI for prompt engineering and integrates with multiple image generation models (IGMs).
- **Shazam-like Audio Recognition**: Identifies songs from recorded audio and fetches lyrics.
- **Feedback Storage**: Saves user feedback and metadata into a MySQL database.

### Database
- A single-table MySQL database stores:
  - Execution time
  - Image quality and relevance ratings
  - Number of generated images and prompt words
  - Model used for image generation

---

## 🛠️ Technology Stack

### Frontend
- **React.js**: For creating a dynamic and interactive user interface.
  - Key components:
    - **ModelMenu**: Handles model selection and state management.
    - **ImageContainer**: Displays the slideshow of generated images.
    - **Recorder**: Captures audio for song recognition.
    - **FeedbackForm**: Collects user feedback on generated images.

### Backend
- **Quart**: Chosen for its asynchronous capabilities, facilitating fast API interactions.
- **OpenAI API**: Used for lyric-based prompt engineering.
- **Asyncio and Httpx**: Enables multithreading for simultaneous API calls.
- **Third-Party Libraries**:
  - Shazam-like audio recognition.
  - Genius API for fetching song lyrics.

### Database
- **MySQL**: Stores user feedback data in a single table for analysis.

---

## 📚 How It Works

1. **Record Audio**: Record a 5-second audio clip using the Recorder component.
2. **Song Identification**: The backend identifies the song title, artist, and lyrics using Shazam-like and Genius APIs.
3. **Image Generation**: 
   - Lyrics are split into segments and transformed into prompts.
   - The prompts are sent to an image generation model to produce visuals.
4. **Feedback Submission**: Users rate the quality and relevance of the generated images.
5. **Feedback Storage**: Metadata and feedback are stored in the MySQL database.

---

# Setup Instructions for Generative Jams

This guide provides step-by-step instructions to set up and run the Generative Jams project.

## Prerequisites

Make sure the following are installed on your system before proceeding:

- **Node.js** (with npm)
- **Python** (version 3.8 or above) with pip
- **MySQL Server**

## Frontend Setup

The frontend is a React.js application. Follow these steps to set it up:

1. Navigate to the `gjams-react/` directory:
   ```bash
   cd gjams-react
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm
   ```
The frontend will run locally at http://localhost:3000.

base for the Generative Jams project.

## Backend Setup

The backend is powered by a Quart server in Python. Set it up as follows:

1. Navigate to the `quart/` directory:
   ```bash
   cd quart
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
3. Start the Quart server:
   ```bash
   python app.py
   ```

The backend will run locally at http://localhost:3001.


## Database Setup

1. Create a new MySQL database.

2. Inside the database, create a table with the following schema:

   ```sql
   CREATE TABLE results (
       ID INT PRIMARY KEY AUTO_INCREMENT,
       exec_time DECIMAL(18,12),
       img_quality INT,
       img_relevance INT,
       model VARCHAR(100),
       num_images INT,
       num_words INT
   );
   ```

## 3. Update the Backend Configuration

Update the backend configuration file with your MySQL credentials:

- Host
- Username
- Password
- Database name

Ensure that the configuration file points to the correct database.

## 4. Start the MySQL Server

Make sure your MySQL server is running and accessible to the backend. You can start the MySQL server using your system's service manager or command-line tools.


## Start the Project

1. **Start the MySQL Server**

   Ensure your MySQL server is running and the database is properly set up.

2. **Start the Backend Server**

   Navigate to the `quart/` directory and start the Quart server:
   
   - Run the following command to start the backend server:
     ```bash
     python app.py
     ```

   The backend API will be accessible at `http://localhost:3001`.

3. **Start the Frontend Server**

   Navigate to the `gjams-react/` directory and start the React development server:
   
   - Run the following command to start the frontend server:
     ```bash
     npm start
     ```

   The frontend will be accessible at `http://localhost:3000`.

4. **Access the Application**

   Open your web browser and go to `http://localhost:3000` to use the application.
