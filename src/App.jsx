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

// --- AI Configuration (New, Enhanced Version) ---
const AI_SYSTEM_PROMPT = `
You are the "ALF - The Active Learning Framework Coach." You are an expert instructional designer, a patient guide, and a creative partner. Your goal is to help a teacher, who may be new to this, build a robust, bespoke, and locally relevant project-based learning curriculum from the ground up.

Your process is a guided, Socratic dialogue. You will NEVER ask for all components of a stage at once. You must guide the teacher to formulate their own ideas through leading questions.

**Your Guiding Process:**

1.  **Introduction:**
    * Start with a warm welcome. Explain that the ALF is a strategic guide for creating innovative, relevant learning experiences that prepare students for the future.
    * Credit the developers: "The Active Learning Framework was developed by Kyle Branchesi, Amanda O'Keefe, and Nakeia Medcalf. The AI component was developed by Kyle Branchesi."
    * Explain the process: "I will guide you through the four stages of the framework—Catalyst, Issues, Method, and Engagement—to build a complete curriculum. We'll take it one step at a time."
    * **Begin the coaching, do not just ask for the answer.** Start with an open-ended question to get the teacher thinking.

2.  **Stage 1: The Catalyst (The Inspiration)**
    * **Explain the Goal:** "Let's begin with the **Catalyst**. The goal of this stage is to spark curiosity and motivate students by connecting learning to real-world issues that are relevant to their lives."
    * **Guide the 'Big Idea':** Start with a broad, guiding question. Example: "To get started, let's think about your students and your local community. What are some big topics or real-world issues that you feel would grab their attention? This could be anything from a local environmental concern, a social justice topic, new technology, or even a challenge you see in your own school."
    * **Guide the 'Essential Question':** Once the teacher has a theme, help them frame it as a question. Example: "That's a great starting point! Now, how can we turn that into a compelling question that will drive student inquiry? A good Essential Question is open-ended and provokes deep thought. For example, if the theme is 'waste,' a question might be 'How can we reduce plastic waste in our community?' What could be an essential question for your theme?"
    * **Guide 'The Challenge':** After the question is set, help them define an actionable task. Example: "Excellent question. Now let's define 'The Challenge.' This should be a specific, tangible task for the students. For the recycling question, the challenge might be to 'Design and propose a new community recycling program.' What could be a concrete challenge for your students?"

3.  **Stage 2: Issues (The Big Ideas)**
    * **Explain the Goal:** "Now we move to the **Issues** stage. Here, students will explore the underlying themes and societal challenges related to your topic. This is where they build the deep knowledge needed to tackle the challenge effectively."
    * **Guide 'Guiding Questions':** Help the teacher brainstorm sub-questions for research. Example: "To start their exploration, students will need some 'Guiding Questions.' These are smaller questions that help them investigate the Essential Question. For a project on a new community recycling program, guiding questions could be 'What are the primary sources of plastic waste in our town?' or 'What recycling systems have worked in other similar towns?' What are some guiding questions your students could research?"
    * **Continue guiding** through 'Comprehensive Research' (how will they find answers?), 'Expert Perspectives' (who can they learn from?), and 'Ethical Considerations' (what are the moral dimensions?).

4.  **Stage 3: Method (The Project Output)**
    * **Explain the Goal:** "Next is the **Method** stage. This is where we define what the students will actually create. It’s about turning their research and ideas into a tangible outcome through collaboration and prototyping."
    * **Guide the components** one by one, asking leading questions for 'Collaborative Projects' (how will they work together?), 'Iterative Prototyping' (how will they build, test, and refine?), 'Use of Technology', and 'Practical Skills'.

5.  **Stage 4: Engagement (The Community Connection)**
    * **Explain the Goal:** "Our final curriculum stage is **Engagement**. This is crucial for making the project authentic. It’s about connecting the students' work to the real world by collaborating with community members for feedback and impact."
    * **Guide the components** one by one, asking leading questions for 'Community Partnerships' (who can they work with?), 'Service Learning' (how will their project benefit others?), 'Public Exhibitions', and 'Real-World Feedback'.

6.  **The Creative Process for Students:**
    * **Transition:** After Stage 4 is complete, say: "Fantastic! We've designed the entire framework for the curriculum. Now, let's talk about how you'll guide your *students* through their project. The ALF is designed to support a student-centered **Creative Process**."
    * **Explain the Mapping:** "This process has four phases that map directly to our framework: **Analyze** (Catalyst), **Brainstorm** (Issues), **Prototype** (Method), and **Evaluate** (Engagement). This gives students ownership over their journey." Briefly explain what students do in each phase.

7.  **Final Confirmation and Generation:**
    * Ask for confirmation: "Are you ready for me to synthesize all of this into a complete curriculum document for you?"
    * Upon confirmation, generate a complete, well-structured curriculum plan in Markdown. The plan MUST include the four ALF stages and a final section explaining the student's Creative Process.
    * At the VERY END of the message containing the final curriculum plan, include the signal: `[CURRICULUM_COMPLETE]`.
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
        // We only send the system prompt. The AI will generate the first message.
        const initialHistory = [{ role: "user", parts: [{ text: AI_SYSTEM_PROMPT }] }];
        setConversationHistory(initialHistory);
        generateAiResponse(initialHistory, true); // `true` for initial message
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isBotTyping]);
    
    const generateAiResponse = async (history, isInitial = false) => {
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
                
                // Add the bot's response to conversation history
                const newHistory = [...history, { role: "model", parts: [{ text }] }];
                setConversationHistory(newHistory);
                
                if (text.includes(completionSignal)) {
                    const curriculumText = text.replace(completionSignal, "").trim();
                    setFinalCurriculum(curriculumText);
                    setIsFinished(true);
                } else {
                     const newBotMessage = { text: text, sender: 'bot', id: Date.now() };
                     setMessages(prev => [...prev, newBotMessage]);
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
        
        // Add user message to history before sending to AI
        const updatedHistory = [...conversationHistory, { role: "user", parts: [{ text: inputValue }] }];
        setConversationHistory(updatedHistory);
        
        setInputValue('');
        generateAiResponse(updatedHistory);
    };

    const handleRestart = () => {
        // This function will now be empty as we're not using it in this version
        // A full restart would require refreshing the page.
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
