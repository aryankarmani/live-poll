const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// GET /polls - Fetch all past poll questions with responses, sorted by most recent first
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .select('question options responses createdAt endedAt isActive')
      .lean();

    // Transform the data to include response counts for each option
    const pollsWithStats = polls.map(poll => {
      const optionStats = {};
      
      // Initialize counts for each option
      poll.options.forEach(option => {
        optionStats[option] = 0;
      });

      // Count responses for each option
      poll.responses.forEach(response => {
        if (optionStats.hasOwnProperty(response.answer)) {
          optionStats[response.answer]++;
        }
      });

      return {
        ...poll,
        optionStats,
        totalResponses: poll.responses.length
      };
    });

    res.json({
      success: true,
      data: pollsWithStats,
      count: pollsWithStats.length
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch polls',
      error: error.message
    });
  }
});

// GET /polls/:id - Fetch a specific poll by ID
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();
    
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Calculate option statistics
    const optionStats = {};
    poll.options.forEach(option => {
      optionStats[option] = 0;
    });

    poll.responses.forEach(response => {
      if (optionStats.hasOwnProperty(response.answer)) {
        optionStats[response.answer]++;
      }
    });

    const pollWithStats = {
      ...poll,
      optionStats,
      totalResponses: poll.responses.length
    };

    res.json({
      success: true,
      data: pollWithStats
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch poll',
      error: error.message
    });
  }
});

module.exports = router; 