/* =========================================
   BARCODE SCANNER - QuaggaJS Integration
   ========================================= */

let barcodeScanner = {
    isActive: false,
    onDetectionCallback: null
};

/**
 * Initialize and start the barcode scanner
 * @param {Function} onDetect - Callback function when barcode is detected
 */
function startBarcodeScanner(onDetect) {
    if (barcodeScanner.isActive) {
        console.log('Scanner already running');
        return;
    }

    barcodeScanner.onDetectionCallback = onDetect || handleBarcodeDetection;

    // Create scanner modal if doesn't exist
    if (!document.getElementById('barcode-scanner-modal')) {
        createScannerModal();
    }

    // Show modal
    const modal = document.getElementById('barcode-scanner-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize QuaggaJS
    initQuagga();
}

/**
 * Create scanner modal HTML
 */
function createScannerModal() {
    const modalHTML = `
        <div id="barcode-scanner-modal" class="barcode-modal">
            <div class="barcode-modal-content">
                <div class="barcode-header">
                    <h3><i class="fa-solid fa-barcode"></i> Scan Product Barcode</h3>
                    <button onclick="stopBarcodeScanner()" class="close-scanner">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                
                <div class="barcode-scanner-container">
                    <div id="barcode-viewport" class="viewport">
                        <video autoplay playsinline></video>
                        <div class="scan-line"></div>
                        <div class="scan-overlay">
                            <div class="scan-corner top-left"></div>
                            <div class="scan-corner top-right"></div>
                            <div class="scan-corner bottom-left"></div>
                            <div class="scan-corner bottom-right"></div>
                        </div>
                    </div>
                    
                    <div class="barcode-instructions">
                        <p><i class="fa-solid fa-camera"></i> Point your camera at a product barcode</p>
                        <p class="small-text">Position the barcode within the frame</p>
                    </div>
                    
                    <div id="barcode-result" class="barcode-result" style="display: none;">
                        <div class="result-icon">
                            <i class="fa-solid fa-check-circle"></i>
                        </div>
                        <p id="barcode-text">Barcode detected!</p>
                        <p id="barcode-action" class="small-text">Searching for product...</p>
                    </div>
                    
                    <div id="barcode-error" class="barcode-error" style="display: none;">
                        <i class="fa-solid fa-exclamation-circle"></i>
                        <p id="error-message">Camera access denied or not available</p>
                    </div>
                </div>
                
                <div class="barcode-footer">
                    <button onclick="stopBarcodeScanner()" class="btn-cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Initialize QuaggaJS barcode detection
 */
function initQuagga() {
    const viewport = document.getElementById('barcode-viewport');

    if (typeof Quagga === 'undefined') {
        showBarcodeError('Barcode scanner library not loaded. Please refresh the page.');
        return;
    }

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: viewport,
            constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: "environment", // Use back camera on mobile
                aspectRatio: { min: 1, max: 2 }
            }
        },
        decoder: {
            readers: [
                "ean_reader",      // EAN-13, EAN-8
                "ean_8_reader",
                "code_128_reader", // Code 128
                "code_39_reader",  // Code 39
                "upc_reader",      // UPC-A, UPC-E
                "upc_e_reader",
                "i2of5_reader"     // Interleaved 2 of 5
            ],
            debug: {
                drawBoundingBox: true,
                showFrequency: false,
                drawScanline: true,
                showPattern: false
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10,
        locate: true
    }, function (err) {
        if (err) {
            console.error('Quagga initialization error:', err);
            showBarcodeError('Failed to access camera. Please ensure camera permissions are granted.');
            return;
        }

        console.log("Barcode scanner initialized successfully");
        Quagga.start();
        barcodeScanner.isActive = true;

        // Add detection listener
        Quagga.onDetected(onBarcodeDetected);
    });
}

/**
 * Handle barcode detection
 */
function onBarcodeDetected(result) {
    if (!result || !result.codeResult) return;

    const code = result.codeResult.code;
    const format = result.codeResult.format;

    console.log(`Barcode detected: ${code} (${format})`);

    // Show result
    showBarcodeResult(code, format);

    // Stop scanner
    Quagga.stop();
    barcodeScanner.isActive = false;

    // Call callback function
    if (barcodeScanner.onDetectionCallback) {
        setTimeout(() => {
            barcodeScanner.onDetectionCallback(code, format);
        }, 1500); // Delay for user feedback
    }
}

/**
 * Default barcode detection handler - search for product
 */
async function handleBarcodeDetection(code, format) {
    try {
        // Close scanner modal
        stopBarcodeScanner();

        // Show loading toast
        showToast(`Searching for product with barcode: ${code}...`, 'fa-spinner fa-spin');

        // Search for product in backend using Railway API
        const backendURL = 'https://virtualmall-backend-production.up.railway.app';
        const response = await fetch(`${backendURL}/api/search/barcode/${code}`);

        if (response.ok) {
            const data = await response.json();

            if (data.success && data.product) {
                // Navigate to product page
                showToast(`Product found: ${data.product.name}`, 'fa-check-circle');
                setTimeout(() => {
                    window.location.href = `product.html?id=${data.product._id}`;
                }, 1000);
            } else {
                showToast('Product not found with this barcode', 'fa-exclamation-circle');
            }
        } else {
            // Fallback: For demo purposes, show all products if API not available
            console.log('API not available, showing fallback');
            showToast('Barcode scanned! (Demo mode - API not connected)', 'fa-info-circle');
            // Optionally navigate to search results
            // window.location.href = `category.html?barcode=${code}`;
        }
    } catch (error) {
        console.error('Barcode search error:', error);
        showToast('Error searching for product. Please try again.', 'fa-exclamation-circle');
    }
}

/**
 * Show barcode detection result
 */
function showBarcodeResult(code, format) {
    const resultDiv = document.getElementById('barcode-result');
    const barcodeText = document.getElementById('barcode-text');
    const barcodeAction = document.getElementById('barcode-action');

    barcodeText.textContent = `${format}: ${code}`;
    barcodeAction.textContent = 'Searching for product...';

    resultDiv.style.display = 'block';

    // Hide instructions
    document.querySelector('.barcode-instructions').style.display = 'none';
}

/**
 * Show barcode error
 */
function showBarcodeError(message) {
    const errorDiv = document.getElementById('barcode-error');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = message;
    errorDiv.style.display = 'block';

    // Hide viewport and instructions
    document.getElementById('barcode-viewport').style.display = 'none';
    document.querySelector('.barcode-instructions').style.display = 'none';
}

/**
 * Stop barcode scanner and cleanup
 */
function stopBarcodeScanner() {
    if (barcodeScanner.isActive) {
        Quagga.stop();
        barcodeScanner.isActive = false;
    }

    // Hide modal
    const modal = document.getElementById('barcode-scanner-modal');
    if (modal) {
        modal.classList.remove('active');
    }

    document.body.style.overflow = '';

    // Reset UI
    setTimeout(() => {
        if (document.getElementById('barcode-viewport')) {
            document.getElementById('barcode-viewport').style.display = 'block';
        }
        if (document.querySelector('.barcode-instructions')) {
            document.querySelector('.barcode-instructions').style.display = 'block';
        }
        if (document.getElementById('barcode-result')) {
            document.getElementById('barcode-result').style.display = 'none';
        }
        if (document.getElementById('barcode-error')) {
            document.getElementById('barcode-error').style.display = 'none';
        }
    }, 300);
}

/**
 * Check if device supports camera
 */
function checkCameraSupport() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Make functions globally available
window.startBarcodeScanner = startBarcodeScanner;
window.stopBarcodeScanner = stopBarcodeScanner;
window.checkCameraSupport = checkCameraSupport;

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && barcodeScanner.isActive) {
        stopBarcodeScanner();
    }
});

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('barcode-scanner-modal');
    if (modal && e.target === modal) {
        stopBarcodeScanner();
    }
});
