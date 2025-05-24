import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, ListGroup, Row, Col } from 'react-bootstrap';
import Modal from 'react-modal';
import Picker from 'emoji-picker-react';
import Particles from '@tsparticles/react';
import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import './Chatbot.css';

// Bind modal to app element for accessibility
Modal.setAppElement('#root');

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);

    // Add a welcome message with an emoji and image
    useEffect(() => {
        setMessages([
            {
                role: 'assistant',
                content: 'Hello! I’m VIGNAN JnanaMitra, here to assist you. What would you like to talk about? 😊',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    }, []);

    // Scroll to the bottom of the chat whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!userInput) return;

        const newUserMessage = {
            role: 'user',
            content: userInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        setShowEmojiPicker(false);

        try {
            const response = await axios.post('http://localhost:8003/api/chat', {
                messages: messages,
                new_message: userInput
            });

            let imageUrl = '';
            if (userInput.toLowerCase().includes('france')) {
                imageUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
            }

            const newBotMessage = {
                role: 'assistant',
                content: userInput.toLowerCase().includes('france') ? `${response.data.message} 🇫🇷` : response.data.message,
                image: imageUrl,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages((prev) => [...prev, newBotMessage]);
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message;
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Error: ${errorMessage} 😓`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: 'Chat cleared! How can I assist you now? 😊',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    const toggleTheme = () => {
        setIsDarkTheme((prev) => !prev);
    };

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedImage('');
    };

    const onEmojiClick = (emojiObject) => {
        setUserInput((prev) => prev + emojiObject.emoji);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Message copied to clipboard!');
    };

    // Particle effect initialization
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        console.log(container);
    }, []);

    // Generate random stars
    const generateStars = () => {
        const stars = [];
        for (let i = 0; i < 50; i++) {
            const style = {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
            };
            stars.push(<div key={i} className="star" style={style}></div>);
        }
        return stars;
    };

    return (
        <Container className={`chat-container ${isDarkTheme ? 'dark-theme' : ''}`}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 60,
                    particles: {
                        number: {
                            value: 50,
                            density: {
                                enable: true,
                                area: 800,
                            },
                        },
                        color: {
                            value: "#ffffff",
                        },
                        shape: {
                            type: "circle",
                        },
                        opacity: {
                            value: 0.5,
                            random: true,
                        },
                        size: {
                            value: 3,
                            random: true,
                        },
                        move: {
                            enable: true,
                            speed: 1,
                            direction: "none",
                            random: false,
                            straight: false,
                            outModes: "out",
                            bounce: false,
                        },
                    },
                    detectRetina: true,
                }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
            />
            <div className="stars">{generateStars()}</div>

            <h2 className="text-center mb-4 title">VIGNAN JnanaMitra</h2>

            <Card className="chat-card">
                <Card.Body>
                    <Card.Title>Chat with VIGNAN JnanaMitra</Card.Title>
                    <Row className="mb-3">
                        <Col className="text-end">
                            <div className="tooltip">
                                <Button variant="outline-danger" size="sm" onClick={handleClearChat}>
                                    Clear Chat
                                </Button>
                                <span className="tooltip-text">Reset the conversation</span>
                            </div>
                        </Col>
                    </Row>
                    <ListGroup variant="flush" className="chat-messages">
                        {messages.map((msg, index) => (
                            <ListGroup.Item key={index} className="border-0">
                                <Row className={msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}>
                                    <Col xs="auto">
                                        {msg.role === 'assistant' && (
                                            <img
                                                src="https://img.icons8.com/color/48/000000/bot.png"
                                                alt="Bot Avatar"
                                                className="avatar"
                                            />
                                        )}
                                    </Col>
                                    <Col xs="auto" className="p-0">
                                        <div className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                                            <strong>{msg.role === 'user' ? 'You' : 'VIGNAN JnanaMitra'}:</strong> {msg.content}
                                            <div className="message-timestamp">{msg.timestamp}</div>
                                            {msg.image && (
                                                <img
                                                    src={msg.image}
                                                    alt="Chat Image"
                                                    className="chat-image mt-2"
                                                    onClick={() => openModal(msg.image)}
                                                />
                                            )}
                                            <button
                                                className="copy-button"
                                                onClick={() => copyToClipboard(msg.content)}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </Col>
                                    {msg.role === 'user' && (
                                        <Col xs="auto">
                                            <img
                                                src="https://img.icons8.com/color/48/000000/user.png"
                                                alt="User Avatar"
                                                className="avatar"
                                            />
                                        </Col>
                                    )}
                                </Row>
                            </ListGroup.Item>
                        ))}
                        {isLoading && (
                            <ListGroup.Item className="border-0">
                                <Row className="justify-content-start">
                                    <Col xs="auto">
                                        <img
                                            src="https://img.icons8.com/color/48/000000/bot.png"
                                            alt="Bot Avatar"
                                            className="avatar"
                                        />
                                    </Col>
                                    <Col xs="auto" className="p-0">
                                        <div className="message-bubble bot-message typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}
                        <div ref={messagesEndRef} />
                    </ListGroup>
                    <div className="scroll-to-bottom" onClick={scrollToBottom}>
                        <img
                            src="https://img.icons8.com/fluency/48/000000/down.png"
                            alt="Scroll to Bottom"
                        />
                    </div>
                </Card.Body>
            </Card>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '0',
                        border: 'none',
                        background: 'transparent'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    }
                }}
            >
                <img src={selectedImage} alt="Large View" className="modal-image" />
                <Button variant="danger" onClick={closeModal} className="mt-3">
                    Close
                </Button>
            </Modal>

            <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="mt-4">
                <Form.Group className="d-flex position-relative">
                    <button
                        type="button"
                        className="emoji-button"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                    >
                        😊
                    </button>
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                    <Form.Control
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                        style={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px' }}
                    />
                    <div className="tooltip">
                        <Button variant="primary" className="ms-2" onClick={handleSendMessage} disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </Button>
                        <span className="tooltip-text">Send your message</span>
                    </div>
                </Form.Group>
            </Form>

            <div className="fab" onClick={toggleTheme}>
                <img
                    src={isDarkTheme ? 'https://img.icons8.com/fluency/48/000000/sun.png' : 'https://img.icons8.com/fluency/48/000000/moon.png'}
                    alt="Theme Toggle"
                />
            </div>
        </Container>
    );
};

export default Chatbot;