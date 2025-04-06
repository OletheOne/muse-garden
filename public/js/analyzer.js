// Idea Analyzer - Evaluates and provides insights on generated ideas
class IdeaAnalyzer {
    constructor() {
        this.criteria = [
            'market potential',
            'implementation complexity',
            'originality',
            'scalability',
            'monetization potential'
        ];
    }
    
    analyzeIdea(ideaText) {
        // For our MVP, we'll use a simplified analysis algorithm
        // In a real product, this could connect to an API for more sophisticated analysis
        
        const scores = {};
        let feedback = [];
        
        // Generate pseudo-random but consistent scores for each idea
        // Using a hash of the idea text to ensure the same idea always gets the same scores
        const ideaHash = this.simpleHash(ideaText);
        
        this.criteria.forEach((criterion, index) => {
            // Generate a score between 1-10 based on the idea hash
            const score = 1 + Math.floor((parseInt(ideaHash.substring(index * 2, index * 2 + 2), 16) / 255) * 9);
            scores[criterion] = score;
            
            // Generate feedback based on scores
            if (score >= 8) {
                feedback.push(`Strong ${criterion}: This idea shows excellent promise in this area.`);
            } else if (score <= 3) {
                feedback.push(`Consider improving: The ${criterion} might need more development.`);
            }
        });
        
        // Calculate overall viability score (weighted average)
        const weights = {
            'market potential': 0.25,
            'implementation complexity': 0.15,
            'originality': 0.2,
            'scalability': 0.2,
            'monetization potential': 0.2
        };
        
        let overallScore = 0;
        for (const [criterion, score] of Object.entries(scores)) {
            overallScore += score * weights[criterion];
        }
        overallScore = Math.round(overallScore * 10) / 10;
        
        // Limit feedback to top 3 points
        if (feedback.length > 3) {
            feedback = feedback.slice(0, 3);
        }
        
        return {
            scores,
            overallScore,
            feedback
        };
    }
    
    // Simple string hashing function
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        // Convert to positive hex string
        return (hash >>> 0).toString(16).padStart(8, '0');
    }
    
    // Get recommendations for improvement
    getRecommendations(analysisResults) {
        const weakestCriterion = Object.entries(analysisResults.scores)
            .sort((a, b) => a[1] - b[1])[0][0];
            
        const recommendations = {
            'market potential': [
                "Research similar products and identify underserved customer segments",
                "Consider conducting brief user interviews to validate the market need",
                "Look for trends that indicate growing demand in this area"
            ],
            'implementation complexity': [
                "Break down the idea into smaller, manageable components",
                "Identify which parts could be built as a minimal viable product",
                "Consider using existing tools or platforms to simplify development"
            ],
            'originality': [
                "Research competitors to ensure your approach is truly unique",
                "Add an unexpected twist or feature to differentiate your idea",
                "Combine elements from different industries or domains"
            ],
            'scalability': [
                "Design with growth in mind from the beginning",
                "Consider how the infrastructure would handle increased usage",
                "Think about automating key processes to reduce scaling bottlenecks"
            ],
            'monetization potential': [
                "Explore different revenue models (subscription, freemium, one-time purchase)",
                "Identify the most valuable features customers would pay for",
                "Consider multiple income streams from the same product"
            ]
        };
        
        // Return recommendations for the weakest area
        return {
            focusArea: weakestCriterion,
            tips: recommendations[weakestCriterion]
        };
    }
}