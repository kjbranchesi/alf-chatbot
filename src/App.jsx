import React, { useState, useEffect, useRef } from 'react';

// --- SVG Icons ---
const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

// --- AI Configuration ---
const AI_SYSTEM_PROMPT = `
You are the "ALF - The Active Learning Framework Coach," an expert curriculum designer. Your goal is to help a teacher create a project-based learning (PBL) curriculum using this framework.

Your process is as follows:
1.  **Introduction:** Start with a detailed introduction.
    * Welcome the user to the "ALF - The Active Learning Framework Coach."
    * Explain the framework's purpose: It is a strategic guide for designing innovative educational opportunities relevant to the evolving needs of society and the future workforce, emphasizing critical thinking, problem-solving, and adaptability.
    * Give credit: Mention that the framework was developed by Kyle Branchesi, Amanda O'Keefe, and Nakeia Medcalf, and the AI component was developed by Kyle Branchesi.
    * Explain the process: State that you will guide them through the four stages (Catalyst, Issues, Method, Engagement) to build a complete curriculum plan.
    * End the intro by asking for the first piece of information for the Catalyst stage.

2.  **Guided Inquiry with Explanations:** For each of the four stages, you MUST first provide a brief explanation of that stage's purpose before asking for the first component. Then, ask for the other components of that stage ONE AT A TIME. Be conversational.
    * **Catalyst Stage:** First, explain its purpose (to spark curiosity and motivation by connecting learning to real-world issues). Then ask for the 'Big Idea', then the 'Essential Question', then 'The Challenge'.
    * **Issues Stage:** First, explain its purpose (to explore the underlying themes and societal challenges through research). Then ask for 'Guiding Questions', then the 'Comprehensive Research' plan, then ideas for 'Expert Perspectives', and finally 'Ethical Considerations'.
    * **Method Stage:** First, explain its purpose (to define tangible project outputs through collaboration and iteration). Then ask about 'Collaborative Projects', 'Iterative Prototyping', 'Use of Technology', and 'Practical Skills'.
    * **Engagement Stage:** First, explain its purpose (to connect student projects to the community for real-world feedback and impact). Then ask about 'Community Partnerships', 'Service Learning', 'Public Exhibitions', and 'Real-World Feedback'.

3.  **Confirmation:** After gathering all information for all four stages, ask if the user is ready for you to generate the full curriculum plan.

4.  **Curriculum Generation:** Once confirmed, generate a complete, well-structured curriculum plan in Markdown format, organized by stage.

5.  **Completion Signal:** At the VERY END of the message containing the final curriculum plan, you MUST include the special signal: [CURRICULUM_COMPLETE]. Do not add any text after this signal.
`;


// --- React Components ---

const ChatMessage = ({ message }) => {
    const { text, sender } = message;
    const isBot = sender === 'bot';

    const renderMarkdown = (text) => {
        let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 mt-6 mb-3 border-b pb-2">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium">$1</strong>');
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/<\/li>(\n<br \/>)?<li>/g, '</li><li>');
        html = html.replace(/<li>/g, '<li class="list-disc ml-5">');
        return html.replace(/\n/g, '<br />');
    };

    return (
        <div className={`flex items-start gap-3 my-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
            {isBot && <div className="flex-shrink-0 bg-gray-200 rounded-full p-2"><BotIcon /></div>}
            <div className={`max-w-xl p-4 rounded-xl shadow ${isBot ? 'bg-indigo-50 text-gray-800 rounded-tl-none' : 'bg-white text-gray-800 rounded-br-none'}`}>
                 <div className="prose" dangerouslySetInnerHTML={{ __html: isBot ? renderMarkdown(text) : text }} />
            </div>
            {!isBot && <div className="flex-shrink-0 bg-gray-200 rounded-full p-2"><UserIcon /></div>}
        </div>
    );
};

const SummaryDisplay = ({ curriculumText, onRestart }) => {
    const renderMarkdown = (text) => {
        let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-indigo-600 mt-6 mb-3 border-b-2 border-indigo-200 pb-2">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-800 mb-2">$1</h1>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/<\/li>(\n<br \/>)?<li>/g, '</li><li>');
        html = html.replace(/<li>/g, '<li class="list-disc ml-6 mb-2 text-gray-700">');
        return html.replace(/\n/g, '<br />');
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in">
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(curriculumText) }}
            />
            <button
                onClick={onRestart}
                className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
                Start a New Plan
            </button>
        </div>
    );
};


export default function App() {
    const [messages, setMessages] = useState([]);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [finalCurriculum, setFinalCurriculum] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        const initialHistory = [{ role: "user", parts: [{ text: AI_SYSTEM_PROMPT }] }];
        const botGreeting = { role: "model", parts: [{ text: "Welcome to the ALF - The Active Learning Framework Coach!\n\nThis framework is a strategic guide for designing innovative educational opportunities that are relevant to the evolving needs of society and the future workforce. It emphasizes critical thinking, problem-solving, and adaptability.\n\nThe Active Learning Framework was developed by **Kyle Branchesi, Amanda O'Keefe, and Nakeia Medcalf**. The AI component was developed by **Kyle Branchesi**.\n\nI will guide you through four stages to build a complete curriculum plan: Catalyst, Issues, Method, and Engagement.\n\nLet's begin with the **Catalyst** stage, which is designed to spark curiosity and motivation. What is the **'Big Idea'** or overarching theme for your project?" }] };
        
        setConversationHistory([...initialHistory, botGreeting]);
        setMessages([{ text: botGreeting.parts[0].text, sender: 'bot', id: Date.now() }]);
        setIsBotTyping(false);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isBotTyping]);
    
    const generateAiResponse = async (history) => {
        setIsBotTyping(true);
        // Vite uses `import.meta.env.VITE_VARIABLE_NAME` to access environment variables
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: history })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API call failed with status: ${response.status}. Body: ${errorBody}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
                let text = result.candidates[0].content.parts[0].text;
                
                const completionSignal = "[CURRICULUM_COMPLETE]";
                if (text.includes(completionSignal)) {
                    const curriculumText = text.replace(completionSignal, "").trim();
                    setFinalCurriculum(curriculumText);
                    setIsFinished(true);
                } else {
                     const newBotMessage = { text: text, sender: 'bot', id: Date.now() };
                     setMessages(prev => [...prev, newBotMessage]);
                     setConversationHistory(prev => [...prev, { role: "model", parts: [{ text }] }]);
                }
            } else {
                 console.warn("No content received from AI. Full response:", result);
                 const blockReason = result.candidates?.[0]?.finishReason;
                 let errorMessage = "Sorry, I couldn't generate a response.";
                 if (blockReason === "SAFETY") {
                    errorMessage = "The response was blocked for safety reasons. Please rephrase your input.";
                 }
                 setMessages(prev => [...prev, { text: errorMessage, sender: 'bot', id: Date.now() }]);
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
            const errorMessage = { text: "Sorry, I encountered an error connecting to the AI. Please ensure your API key is set up correctly in your deployment environment.", sender: 'bot', id: Date.now() };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsBotTyping(false);
        }
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() || isBotTyping) return;

        const userMessage = { text: inputValue, sender: 'user', id: Date.now() };
        setMessages(prev => [...prev, userMessage]);

        const updatedHistory = [...conversationHistory, { role: "user", parts: [{ text: inputValue }] }];
        setConversationHistory(updatedHistory);
        
        setInputValue('');
        generateAiResponse(updatedHistory);
    };

    const handleRestart = () => {
        setMessages([]);
        setConversationHistory([]);
        setIsFinished(false);
        setFinalCurriculum('');
        setIsBotTyping(true);

        const initialHistory = [{ role: "user", parts: [{ text: AI_SYSTEM_PROMPT }] }];
        const botGreeting = { role: "model", parts: [{ text: "Welcome back! Let's create a new curriculum plan.\n\nTo begin, what is the **'Big Idea'** for this new project?" }] };
        
        setConversationHistory([...initialHistory, botGreeting]);
        setMessages([{ text: botGreeting.parts[0].text, sender: 'bot', id: Date.now() }]);
        setIsBotTyping(false);
    };

    return (
        <div className="font-sans bg-gray-100 flex flex-col h-screen">
             <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    ALF - The Active Learning Framework Coach
                </h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {isFinished ? (
                        <SummaryDisplay curriculumText={finalCurriculum} onRestart={handleRestart} />
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <ChatMessage key={msg.id || index} message={msg} />
                            ))}
                            {isBotTyping && (
                                <div className="flex items-start gap-3 my-4 justify-start">
                                    <div className="flex-shrink-0 bg-gray-200 rounded-full p-2"><BotIcon /></div>
                                    <div className="max-w-sm p-4 rounded-lg bg-indigo-50 rounded-tl-none shadow">
                                        <div className="flex items-center space-x-1">
                                            <span className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                            <span className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                            <span className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </>
                    )}
                </div>
            </main>

            {!isFinished && (
                <footer className="bg-white border-t p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center bg-gray-100 rounded-lg p-2">
                            <textarea
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                placeholder="Type your response here..."
                                rows="1"
                                className="w-full bg-transparent p-2 text-gray-800 focus:outline-none resize-none"
                                disabled={isBotTyping}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isBotTyping}
                                className="p-3 rounded-full bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </footer>
            )}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                .prose { line-height: 1.7; }
                .prose h1, .prose h2, .prose h3 { margin-bottom: 0.5em; }
            `}</style>
        </div>
    );
}
