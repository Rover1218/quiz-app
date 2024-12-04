const express = require('express');
const cors = require('cors');
const axios = require('axios');
const he = require('he'); // Add this line to import 'he'
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Fallback questions in case API fails
const fallbackQuestions = [
    {
        question_text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct_option: 2
    },
    {
        question_text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct_option: 1
    },
    {
        question_text: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct_option: 1
    },
    {
        question_text: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct_option: 2
    }
];

app.get('/questions', async (req, res) => {
    try {
        const response = await axios.get('https://opentdb.com/api.php', {
            params: {
                amount: 10,
                type: 'multiple',
                category: 9, // General Knowledge
                difficulty: 'medium'
            }
        });

        if (response.data.response_code !== 0) {
            throw new Error('Failed to fetch questions from API');
        }

        const questions = response.data.results.map(q => {
            const allOptions = [...q.incorrect_answers, q.correct_answer];
            const shuffledOptions = shuffle(allOptions);

            return {
                question_text: he.decode(q.question), // Use 'he.decode' to decode HTML entities
                options: shuffledOptions.map(opt => he.decode(opt)),
                correct_option: shuffledOptions.indexOf(q.correct_answer)
            };
        });
        res.json(questions);
    } catch (error) {
        console.error('Error:', error);
        res.json(fallbackQuestions);
    }
});

// Utility function to shuffle options
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
