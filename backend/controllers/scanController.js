const { getTrainByNumber } = require('../dataLoader');

// @desc    Process QR Scan
// @route   POST /api/scan
// @access  Public
const processScan = async (req, res) => {
    try {
        const { qrString } = req.body;
        const qrData = qrString; // Map qrString to qrData for existing logic

        if (!qrData) {
            return res.status(400).json({ success: false, error: 'No QR data provided' });
        }

        // Assumption: QR data contains the train number directly or a string like "TRAIN:12345"
        // We will try to extract a 5-digit number
        const trainNumberMatch = qrData.match(/\b\d{5}\b/);

        if (!trainNumberMatch) {
            return res.status(400).json({ success: false, error: 'Invalid QR Code: Could not extract train number' });
        }

        const trainNumber = trainNumberMatch[0];
        console.log(`Scanned Train Number: ${trainNumber}`);

        const train = getTrainByNumber(trainNumber);

        if (!train) {
            return res.status(404).json({
                success: false,
                error: 'Train not found',
                scannedNumber: trainNumber
            });
        }

        // Return train details
        res.json({
            success: true,
            data: train
        });

    } catch (error) {
        console.error('Error processing scan:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    processScan
};
