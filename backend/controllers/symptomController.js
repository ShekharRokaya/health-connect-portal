const symptomDatabase = require('../data/symptomData');

const checkSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms || symptoms.trim() === '') {
            return res.status(400).json({ message: 'Please describe your symptoms' });
        }

        const input = symptoms.toLowerCase();
        const results = [];

        for (const entry of symptomDatabase) {
            let matchCount = 0;
            const matchedKeywords = [];

            for (const keyword of entry.keywords) {
                if (input.includes(keyword.toLowerCase())) {
                    matchCount++;
                    matchedKeywords.push(keyword);
                }
            }

            if (matchCount > 0) {
                const confidence = Math.min(Math.round((matchCount / 3) * 100), 98);
                results.push({
                    specialization: entry.specialization,
                    description: entry.description,
                    confidence,
                    matchedKeywords,
                    matchCount
                });
            }
        }

        // Sort by confidence (highest first)
        results.sort((a, b) => b.confidence - a.confidence);

        // If no matches, suggest General Physician
        if (results.length === 0) {
            results.push({
                specialization: 'General Physician',
                description: 'General health and primary care doctor',
                confidence: 50,
                matchedKeywords: ['general checkup'],
                matchCount: 1
            });
        }

        res.json({ results, analyzedText: symptoms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { checkSymptoms };
