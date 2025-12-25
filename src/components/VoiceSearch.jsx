import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';

const VoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice search:', transcript);

                // Navigate to products page with search query
                navigate(`/products?search=${encodeURIComponent(transcript)}`);
                setIsListening(false);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        }
    }, [navigate]);

    const toggleListening = () => {
        if (!recognition) {
            alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    return (
        <Tooltip title={isListening ? 'Listening...' : 'Voice Search'}>
            <IconButton
                onClick={toggleListening}
                sx={{
                    color: '#d4af37',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                        '0%': {
                            transform: 'scale(1)',
                            opacity: 1,
                        },
                        '50%': {
                            transform: 'scale(1.1)',
                            opacity: 0.8,
                        },
                        '100%': {
                            transform: 'scale(1)',
                            opacity: 1,
                        },
                    },
                }}
            >
                {isListening ? <MicOff /> : <Mic />}
            </IconButton>
        </Tooltip>
    );
};

export default VoiceSearch;
