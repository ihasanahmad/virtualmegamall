import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from 'quagga';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import { Close, CameraAlt } from '@mui/icons-material';
import axios from 'axios';

const BarcodeScanner = ({ open, onClose }) => {
    const [scanning, setScanning] = useState(false);
    const [manualBarcode, setManualBarcode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const startScanner = () => {
        setScanning(true);
        setError('');

        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    target: document.querySelector('#barcode-scanner'),
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: 'environment',
                    },
                },
                decoder: {
                    readers: ['ean_reader', 'upc_reader', 'code_128_reader'],
                },
            },
            (err) => {
                if (err) {
                    console.error(err);
                    setError('Camera access denied or not available');
                    setScanning(false);
                    return;
                }
                Quagga.start();
            }
        );

        Quagga.onDetected(handleDetected);
    };

    const stopScanner = () => {
        if (scanning) {
            Quagga.stop();
            setScanning(false);
        }
    };

    const handleDetected = async (result) => {
        const barcode = result.codeResult.code;
        console.log('Barcode detected:', barcode);
        stopScanner();
        await searchProduct(barcode);
    };

    const searchProduct = async (barcode) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/products/barcode/${barcode}`
            );

            if (response.data.success && response.data.data) {
                onClose();
                navigate(`/products/${response.data.data._id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Product not found with this barcode');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualBarcode.trim()) {
            searchProduct(manualBarcode.trim());
        }
    };

    const handleClose = () => {
        stopScanner();
        setManualBarcode('');
        setError('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #d4af37',
                },
            }}
        >
            <DialogTitle sx={{ color: '#d4af37', display: 'flex', justifyContent: 'space-between', align Items: 'center' }}>
                Scan Product Barcode
                <IconButton onClick={handleClose} sx={{ color: '#d4af37' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                        <CircularProgress sx={{ color: '#d4af37' }} />
                        <Typography sx={{ color: '#fff', ml: 2 }}>Searching for product...</Typography>
                    </Box>
                )}

                {!scanning && !loading && (
                    <>
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<CameraAlt />}
                                onClick={startScanner}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    color: '#1a1a1a',
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: '#c19b2a' },
                                }}
                                fullWidth
                            >
                                Open Camera Scanner
                            </Button>
                        </Box>

                        <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', mb: 2 }}>
                            OR enter barcode manually
                        </Typography>

                        <Box component="form" onSubmit={handleManualSubmit}>
                            <TextField
                                fullWidth
                                label="Barcode Number"
                                value={manualBarcode}
                                onChange={(e) => setManualBarcode(e.target.value)}
                                placeholder="Enter barcode (e.g., 1234567890123)"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#d4af37' },
                                        '&:hover fieldset': { borderColor: '#d4af37' },
                                        '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#d4af37' },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    color: '#d4af37',
                                    borderColor: '#d4af37',
                                    '&:hover': { borderColor: '#c19b2a' },
                                }}
                                disabled={!manualBarcode.trim()}
                            >
                                Search
                            </Button>
                        </Box>
                    </>
                )}

                {scanning && (
                    <Box>
                        <Typography variant="body2" sx={{ color: '#d4af37', mb: 2, textAlign: 'center' }}>
                            Point camera at barcode...
                        </Typography>
                        <Box
                            id="barcode-scanner"
                            sx={{
                                width: '100%',
                                height: 400,
                                backgroundColor: '#000',
                                borderRadius: 2,
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={stopScanner}
                            fullWidth
                            sx={{
                                mt: 2,
                                color: '#f44336',
                                borderColor: '#f44336',
                                '&:hover': { borderColor: '#d32f2f' },
                            }}
                        >
                            Stop Scanner
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BarcodeScanner;
