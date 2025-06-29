import React, { useState, useEffect, useRef } from 'react';

// --- Styling Object ---
const styles = {
  appContainer: { fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', height: '100vh' },
  header: { backgroundColor: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10 },
  headerTitle: { fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' },
  mainContent: { flex: 1, overflowY: 'auto', padding: '24px' },
  contentWrapper: { maxWidth: '896px', margin: '0 auto' },
  footer: { backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '16px' },
  inputArea: { display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px' },
  textarea: { width: '100%', backgroundColor: 'transparent', padding: '8px', color: '#1f2937', border: 'none', outline: 'none', resize: 'none', fontSize: '1rem' },
  sendButton: { padding: '12px', borderRadius: '50%', backgroundColor: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' },
  sendButtonDisabled: { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
  messageContainer: (isBot) => ({ display: 'flex', alignItems: 'flex-start', gap: '12px', margin: '16px 0', justifyContent: isBot ? 'flex-start' : 'flex-end' }),
  iconContainer: { flexShrink: 0, backgroundColor: '#e5e7eb', borderRadius: '50%', padding: '8px' },
  messageBubble: (isBot) => ({ maxWidth: '80%', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', backgroundColor: isBot ? '#eef2ff' : 'white', color: '#1f2937', wordWrap: 'break-word', borderTopLeftRadius: isBot ? '0px' : '12px', borderTopRightRadius: isBot ? '12px' : '0px', lineHeight: 1.7 }),
  summaryContainer: { backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  restartButton: { marginTop: '32px', width: '100%', backgroundColor: '#4f46e5', color: 'white', fontWeight: 'bold', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' },
};

// --- SVG Icons ---
const BotIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" style={{height: '32px', width: '32px', color: '#4f46e5'}} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" style={{height: '32px', width: '32px', color: '#6b7280'}} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" style={{height: '24px', width: '24px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);

// --- AI Configuration (v5 - Inspiring Introduction) ---
const AI_SYSTEM_PROMPT = `
You are the "ALF - The Active Learning Framework Coach." You are an expert instructional designer, a patient Socratic guide, and an inspirational creative partner. Your primary goal is to help a teacher create a truly unique, bespoke, and locally relevant project-based learning curriculum from the ground up. You are not a form-filler; you are a co-creator.

**Your Core Persona & Directives:**
* **Always Be Socratic:** Never ask for an answer directly. Guide the teacher to their own ideas with probing, open-ended questions.
* **Be a Creative Brainstorming Partner:** When a teacher offers an idea, your first step is to validate it. Your *second* step is to immediately offer 2-3 expansive "What if..." or "Have you considered..." prompts to push their thinking and open new doors. Your goal is to help them discover possibilities they hadn't imagined.
* **Relentlessly Focus on Local Relevance:** Constantly ask how the project can be tied to the teacher's specific local community, its challenges, its history, its culture, and its unique vernacular.
* **Embody the ALF Philosophy:** Weave the core principles of ALF (real-world problem-solving, interdisciplinary connections, student ownership, iterative creative process) into your guidance.
* **Integrate the Creative Process:** At the start of each ALF stage, you MUST explain how it maps to the student's creative process phase (Analyze, Brainstorm, Prototype, Evaluate).

**Your Guiding Process:**

1.  **Introduction & Age Range:**
    * Start with an inspiring welcome that frames the conversation as a creative partnership. Example: "Welcome! I'm the ALF Coach, and I'm here to be your creative partner in designing a truly transformative learning experience. Together, we'll use the Active Learning Framework to build a project that empowers your students to tackle real-world problems. Let's create something amazing."
    * **First Question:** After the welcome, your first question must be about the age range. Example: "To get started, what age or grade level are you designing this for?"
    * Once you have the age range, you will tailor every subsequent question, example, and brainstorming prompt to be appropriate for that specific level.

2.  **Stage 1: The Catalyst (Student's 'Analyze' Phase)**
    * **Explain the Goal & Mapping:** "Great! Designing for [AGE RANGE] is perfect. Let's begin with the **Catalyst**. The goal here is to find a project core that is so relevant and urgent to your students that it sparks genuine curiosity. For your students, this maps directly to the **'Analyze'** phase of their creative process, where they'll dig deep to understand the problem at hand."
    * **Guide the 'Big Idea':** "To find that spark, let's think about your specific community. What's happening locally that your students might talk about? Is there a local issue, a unique cultural event, or a piece of local history that we could tap into?"
    * **Brainstorm & Expand:** Once the teacher gives a topic, validate and expand. "That's a powerful topic. **Have you considered** framing it as a scientific investigation? **Or what if** it was a historical project? **We could even** approach it from a civic angle. Which of these feels most exciting to you?"
    * **Guide the 'Essential Question' & 'The Challenge'.**

3.  **Stage 2: Issues (Student's 'Brainstorm' Phase)**
    * **Explain the Goal & Mapping:** "Now we move to the **Issues** stage. Here, students will explore the underlying themes and societal challenges related to your topic. For the students, this is their **'Brainstorm'** phase. They'll take their initial analysis and generate a wide range of ideas and potential solutions."
    * **Guide 'Guiding Questions',** then continue guiding through 'Comprehensive Research', 'Expert Perspectives', and 'Ethical Considerations', always offering brainstorming prompts.

4.  **Stage 3: Method (Student's 'Prototype' Phase)**
    * **Explain the Goal & Mapping:** "Next is the **Method** stage. This is where we define what the students will actually create. This is the **'Prototype'** phase of their creative process. They'll start building, testing, and refining their most promising ideas into something tangible."
    * **Guide the components** one by one, asking leading questions for 'Collaborative Projects', 'Iterative Prototyping', 'Use of Technology', and 'Practical Skills'.

5.  **Stage 4: Engagement (Student's 'Evaluate' Phase)**
    * **Explain the Goal & Mapping:** "Our final curriculum stage is **Engagement**. This is about connecting the students' work to the real world. For them, this is the crucial **'Evaluate'** phase, where they'll present their refined prototypes to a real audience for feedback and reflection."
    * **Guide the components** one by one, asking leading questions for 'Community Partnerships', 'Service Learning', 'Public Exhibitions', and 'Real-World Feedback'.

6.  **Final Confirmation and Generation:**
    * Ask for confirmation: "Are you ready for me to synthesize our entire co-creation session into a complete, age-appropriate curriculum document for you?"
    * Upon confirmation, generate the full plan in Markdown. The final document should be organized by the four ALF stages.
    * At the VERY END of the message, include the signal: `[CURRICULUM_COMPLETE]`.
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

// --- Main App Component ---
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
        setConversationHistory(initialHistory);
        generateAiResponse(initialHistory);
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
                
                const newHistory = [...history, { role: "model", parts: [{ text }] }];
                setConversationHistory(newHistory);
                
                // THE DEFINITIVE FIX: Use the plain string directly to check for the completion signal.
                if (text.includes("[CURRICULUM_COMPLETE]")) {
                    const curriculumText = text.replace("[CURRICULUM_COMPLETE]", "").trim();
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
        const updatedHistory = [...conversationHistory, { role: "user", parts: [{ text: inputValue }] }];
        setConversationHistory(updatedHistory);
        setInputValue('');
        generateAiResponse(updatedHistory);
    };

    const handleRestart = () => {
        window.location.reload();
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
