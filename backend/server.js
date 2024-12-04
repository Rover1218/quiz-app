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

// Add category-specific fallback questions
const gadgetsFallbackQuestions = [
    {
        question_text: "Which company released the first portable MP3 player?",
        options: ["Apple", "Samsung", "Saehan", "Sony"],
        correct_option: 2
    },
    {
        question_text: "What year was the first iPhone released?",
        options: ["2005", "2006", "2007", "2008"],
        correct_option: 2
    },
    {
        question_text: "Which company invented the first wireless mouse?",
        options: ["Logitech", "Microsoft", "Apple", "HP"],
        correct_option: 0
    }
];

app.get('/questions', async (req, res) => {
    const {
        category = 9,
        difficulty = 'medium',
        amount = 10,
        type = 'multiple' // Add type parameter
    } = req.query;

    try {
        // Special handling for gadgets category
        if (category === '30') {
            // Try fetching from both gadgets and technology categories
            const responses = await Promise.all([
                axios.get('https://opentdb.com/api.php', {
                    params: {
                        amount: Math.ceil(amount / 2),
                        category: 30,
                        type,
                        difficulty
                    }
                }),
                axios.get('https://opentdb.com/api.php', {
                    params: {
                        amount: Math.floor(amount / 2),
                        category: 18, // Computer Science as fallback
                        type,
                        difficulty
                    }
                })
            ]);

            let allQuestions = [];
            responses.forEach(response => {
                if (response.data.response_code === 0) {
                    allQuestions = [...allQuestions, ...response.data.results];
                }
            });

            if (allQuestions.length === 0) {
                return res.json(gadgetsFallbackQuestions.slice(0, amount));
            }

            const questions = allQuestions.map(q => {
                const allOptions = type === 'boolean'
                    ? ['True', 'False']  // For true/false questions
                    : [...q.incorrect_answers, q.correct_answer];  // For multiple choice
                const shuffledOptions = type === 'boolean' ? allOptions : shuffle(allOptions);

                return {
                    question_text: he.decode(q.question),
                    options: shuffledOptions.map(opt => he.decode(opt)),
                    correct_option: shuffledOptions.indexOf(q.correct_answer)
                };
            });

            return res.json(questions);
        }

        // Regular category handling
        const response = await axios.get('https://opentdb.com/api.php', {
            params: {
                amount: amount,
                type: type, // Use the type parameter
                category: category,
                difficulty: difficulty
            }
        });

        if (response.data.response_code !== 0) {
            throw new Error('Failed to fetch questions from API');
        }

        const questions = response.data.results.map(q => {
            const allOptions = type === 'boolean'
                ? ['True', 'False']  // For true/false questions
                : [...q.incorrect_answers, q.correct_answer];  // For multiple choice
            const shuffledOptions = type === 'boolean' ? allOptions : shuffle(allOptions);

            return {
                question_text: he.decode(q.question),
                options: shuffledOptions.map(opt => he.decode(opt)),
                correct_option: shuffledOptions.indexOf(q.correct_answer)
            };
        });
        res.json(questions);
    } catch (error) {
        console.error('Error:', error);
        // Use gadgets fallback for category 30, general fallback for others
        const fallbackQuestions = category === '30' ?
            gadgetsFallbackQuestions : fallbackQuestions;
        res.json(fallbackQuestions.slice(0, amount));
    }
});

// Utility function to shuffle options
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
