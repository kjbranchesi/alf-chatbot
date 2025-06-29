import React, { useState, useEffect, useRef } from 'react';

// --- Styling Object ---
// All styles are defined here, no external CSS files needed.
const styles = {
  appContainer: {
    fontFamily: 'sans-serif',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    backgroundColor: 'white',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  contentWrapper: {
    maxWidth: '896px',
    margin: '0 auto',
  },
  footer: {
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '16px',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '8px',
  },
  textarea: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: '8px',
    color: '#1f2937',
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontSize: '1rem',
  },
  sendButton: {
    padding: '12px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  messageContainer: (isBot) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    margin: '16px 0',
    justifyContent: isBot ? 'flex-start' : 'flex-end',
  }),
  iconContainer: {
    flexShrink: 0,
    backgroundColor: '#e5e7eb',
    borderRadius: '50%',
    padding: '8px',
  },
  messageBubble: (isBot) => ({
    maxWidth: '80%',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    backgroundColor: isBot ? '#eef2ff' : 'white',
    color: '#1f2937',
    borderTopLeftRadius: isBot ? '0px' : '12px',
    borderTopRightRadius: isBot ? '12px' : '0px',
    lineHeight: 1.7
  }),
  summaryContainer: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  restartButton: {
    marginTop: '32px',
    width: '100%',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontWeight: 'bold',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

// --- SVG Icons ---
const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{height: '32px', width: '32px', color: '#4f46e5'}} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{height: '32px', width: '32px', color: '#6b7280'}} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{height: '24px', width: '24px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

// --- AI Configuration ---
const AI_SYSTEM_PROMPT = `
You are the "ALF - The Active Learning Framework Coach," an expert curriculum designer. Your goal is to help a teacher create a project-based learning (PBL) curriculum using this framework. Your responses should be formatted in Markdown.

Your process is as follows:
1.  **Introduction:** Start with a detailed introduction. Welcome the user, explain the framework's purpose, give credit to the developers, explain the process, and then ask for the 'Big Idea'.
2.  **Guided Inquiry with Explanations:** For each of the four stages, first explain the stage's purpose, then ask for the components ONE AT A TIME.
3.  **Confirmation:** After gathering all information, ask for confirmation to generate the plan.
4.  **Curriculum Generation:** Once confirmed, generate a complete curriculum plan in Markdown.
5.  **Completion Signal:** At the VERY END of the final curriculum plan, include the signal: [CURRICULUM_COMPLETE].
`;

// --- React Components (defined outside the main App component) ---
const ChatMessage = ({ message }) => {
    const { text, sender } = message;
    const isBot = sender === 'bot';

    const renderMarkdown = (text) => {
        let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return html.replace(/\n/g, '<br />');
    };

    return (
        <div style={styles.messageContainer(isBot)}>
            {isBot && <div style={styles.iconContainer}><BotIcon /></div>}
            <div style={styles.messageBubble(isBot)} dangerouslySetInnerHTML={{ __html: isBot ? renderMarkdown(text) : text }} />
            {!isBot && <div style={styles.iconContainer}><UserIcon /></div>}
        </div>
    );
};

const SummaryDisplay = ({ curriculumText, onRestart }) => {
    const renderMarkdown = (text) => {
         let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
         html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 1.25rem; font-weight: 600; color: #4f46e5; margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">$1</h2>');
         html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 1.875rem; font-weight: bold; color: #1f2937; margin-bottom: 8px;">$1</h1>');
         html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');
         html = html.replace(/^\* (.*$)/gim, '<li style="margin-left: 24px; list-style-type: disc; margin-bottom: 8px;">$1</li>');
         return html.replace(/\n/g, '<br />');
     };

    return (
        <div style={styles.summaryContainer}>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(curriculumText) }} />
            <button onClick={onRestart} style={styles.restartButton}>Start a New Plan</button>
        </div>
    );
};

// --- Main App Component (the single default export) ---
function App() {
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
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: history })
            });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
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
                 let errorMessage = "Sorry, I couldn't generate a response.";
                 if (result.candidates?.[0]?.finishReason === "SAFETY") {
                    errorMessage = "The response was blocked for safety reasons. Please rephrase your input.";
                 }
                 setMessages(prev => [...prev, { text: errorMessage, sender: 'bot', id: Date.now() }]);
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
            setMessages(prev => [...prev, { text: "Sorry, I encountered an error connecting to the AI. Please ensure your API key is set up correctly in your deployment environment.", sender: 'bot', id: Date.now() }]);
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
        <div style={styles.appContainer}>
             <header style={styles.header}>
                <h1 style={styles.headerTitle}>
                    ALF - The Active Learning Framework Coach
                </h1>
            </header>
             <main style={styles.mainContent}>
                <div style={styles.contentWrapper}>
                    {isFinished ? (
                        <SummaryDisplay curriculumText={finalCurriculum} onRestart={handleRestart} />
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <ChatMessage key={msg.id || index} message={msg} />
                            ))}
                            {isBotTyping && (
                                <div style={styles.messageContainer(true)}>
                                    <div style={styles.iconContainer}><BotIcon /></div>
                                    <div style={styles.messageBubble(true)}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                            <span style={{height: '8px', width: '8px', backgroundColor: '#818cf8', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out'}}></span>
                                            <span style={{height: '8px', width: '8px', backgroundColor: '#818cf8', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out .25s'}}></span>
                                            <span style={{height: '8px', width: '8px', backgroundColor: '#818cf8', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out .5s'}}></span>
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
                <footer style={styles.footer}>
                    <div style={styles.contentWrapper}>
                        <div style={styles.inputArea}>
                            <textarea
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                placeholder="Type your response here..."
                                style={styles.textarea}
                                disabled={isBotTyping}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isBotTyping}
                                style={{...styles.sendButton, ...(isBotTyping || !inputValue.trim() ? styles.sendButtonDisabled : {})}}
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </footer>
            )}
             <style>
                {`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
                `}
            </style>
        </div>
    );
}

export default App;

