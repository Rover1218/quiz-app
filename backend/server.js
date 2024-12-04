const express = require('express');
const cors = require('cors');
const axios = require('axios');
const he = require('he'); // Add this line to import 'he'
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Add root route handler
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Quiz API Server</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7); }
                70% { box-shadow: 0 0 0 20px rgba(147, 51, 234, 0); }
                100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
            }
            .float { animation: float 3s ease-in-out infinite; }
            .pulse { animation: pulse 2s infinite; }
            .gradient-text {
                background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
        </style>
    </head>
    <body class="bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 min-h-screen">
        <div class="container mx-auto px-4 py-16">
            <div class="max-w-3xl mx-auto">
                <!-- Server Status Card -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 float">
                    <div class="flex items-center justify-center space-x-4">
                        <div class="h-4 w-4 bg-green-500 rounded-full pulse"></div>
                        <h1 class="text-4xl font-bold text-white">Server Active</h1>
                    </div>
                </div>

                <!-- Main Content Card -->
                <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
                    <h2 class="text-3xl font-bold text-white mb-6 gradient-text">Quiz API Endpoint</h2>
                    
                    <!-- API Info -->
                    <div class="bg-white/10 rounded-xl p-6 mb-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <span class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">GET</span>
                            <code class="text-purple-200">/questions</code>
                        </div>
                        
                        <!-- Collapsible Parameters Section -->
                        <div class="relative">
                            <button onclick="toggleParams()" class="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
                                <span class="text-sm font-semibold">View Parameters</span>
                                <i class="fas fa-chevron-down" id="paramIcon"></i>
                            </button>
                            
                            <div id="parameters" class="hidden mt-4 space-y-3 text-sm text-purple-200">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-white/5 p-3 rounded-lg">
                                        <span class="block text-purple-300">Category</span>
                                        <code>default: 9</code>
                                    </div>
                                    <div class="bg-white/5 p-3 rounded-lg">
                                        <span class="block text-purple-300">Difficulty</span>
                                        <code>default: medium</code>
                                    </div>
                                    <div class="bg-white/5 p-3 rounded-lg">
                                        <span class="block text-purple-300">Amount</span>
                                        <code>default: 10</code>
                                    </div>
                                    <div class="bg-white/5 p-3 rounded-lg">
                                        <span class="block text-purple-300">Type</span>
                                        <code>default: multiple</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Try It Section -->
                    <div class="bg-purple-900/50 rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-purple-200 mb-3">Try it out</h3>
                        <div class="bg-black/30 p-4 rounded-lg overflow-x-auto">
                            <code class="text-green-400 text-sm">
                                /questions?category=9&difficulty=medium&amount=10&type=multiple
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function toggleParams() {
                const params = document.getElementById('parameters');
                const icon = document.getElementById('paramIcon');
                params.classList.toggle('hidden');
                icon.classList.toggle('fa-chevron-up');
                icon.classList.toggle('fa-chevron-down');
            }
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

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
