# Interactive Quiz App

A modern, interactive quiz application built with **Node.js** and **Tailwind CSS** that fetches questions dynamically from the Open Trivia Database.

## 🚀 Features

- 🌐 **Dynamic Questions**: Fetch questions from the Open Trivia DB API.
- 🎨 **Beautiful UI**: Designed with Tailwind CSS for a clean, responsive layout.
- 🔊 **Sound Effects**: Engaging audio feedback for interactions.
- ✨ **Animations**: Smooth transitions and visual effects using animate.css.
- 📈 **Progress Tracking**: Visual progress bar and score updates in real-time.
- 🎉 **Confetti Celebration**: Celebrate correct answers with canvas-confetti.
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices.
- 🛡️ **Fallback Questions**: Loads local questions if the API is unavailable.
- ⚙️ **Customizable Settings**: Configure quiz parameters through an intuitive settings form
- 🔄 **Smart Question Fetching**: Enhanced logic for reliable question retrieval and caching

---

## 🛠️ Tech Stack

### **Frontend**
- **HTML**: Structure and content.
- **Tailwind CSS**: Styling and layout.
- **JavaScript**: Interactivity and dynamic rendering.

### **Backend**
- **Node.js**: Server-side environment.
- **Express.js**: Backend framework for routing and API integration.

### **APIs and Libraries**
- **Open Trivia Database**: Source of quiz questions.
- **animate.css**: Smooth animations.
- **canvas-confetti**: Fun confetti effects.
- **he**: Decodes HTML entities in API responses.
- **Font Awesome**: Icons for visual enhancements.

## 🚀 Installation & Setup

### Backend Setup

Clone the repository:

## 📱 User Guide

### Playing the Quiz
1. Start Quiz: Click "Start Quiz" to begin
2. Answer Questions: Select one option per question
3. Progress Tracking: 
   - Green progress bar shows completion
   - Score updates in real-time
   - Confetti appears for correct answers
4. Results: View final score and option to retry

### Features for Users
- **Question Types**: Multiple choice questions from various categories
- **Visual Feedback**:
  - Green highlight for correct answers
  - Red highlight for incorrect answers
  - Progress bar shows quiz completion
- **Score System**:
  - +1 point per correct answer
  - Real-time score updates
  - Final score display with percentage
- **Accessibility**:
  - Keyboard navigation support
  - Mobile-friendly interface
  - High contrast colors

### Customization Options
- Change theme colors via Tailwind classes
- Adjust question count in settings
- Toggle animations and effects
- **Sound Settings**:
  - Toggle sound effects on/off
  - Adjust sound volume
  - Choose different sound themes

### Quiz Settings Form
- **Category Selection**: Choose from 24+ topic categories
- **Difficulty Levels**: Easy, Medium, or Hard
- **Question Count**: Select 5-50 questions
- **Timer Options**: 
  - Enable/disable countdown timer
  - Set time per question (15-120 seconds)
- **Question Type**: 
  - Multiple Choice
  - True/False
  - Mixed

### Enhanced Question Fetching
- **Smart Caching**:
  - Questions cached for offline access
  - Automatic cache refresh every 24 hours
- **Failover Strategy**:
  - Primary: Open Trivia DB API
  - Secondary: Local backup questions
  - Tertiary: Generated questions
- **Rate Limiting**:
  - Intelligent API request management
  - Request throttling to prevent API abuse
- **Error Handling**:
  - Graceful degradation
  - User-friendly error messages
  - Automatic retry mechanism

## 🔧 Troubleshooting

### Common Issues
1. **Questions Not Loading**
   - Check internet connection
   - Verify backend server is running
   - Clear browser cache

2. **Visual Glitches**
   - Refresh the page
   - Update browser
   - Disable conflicting extensions

3. **Performance Issues**
   - Close unnecessary browser tabs
   - Clear browser cache
   - Check system resources

### Quick Fixes
- **Reset Quiz**: Click "Try Again" button
- **Server Issues**: Restart backend server
- **Display Problems**: Use browser refresh

## 💡 Tips
- Read questions carefully
- Use process of elimination
- Watch the timer (if enabled)
- Review answers before submitting
