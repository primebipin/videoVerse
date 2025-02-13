import RunwayML from '@runwayml/sdk';

const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY
});

export const checkVideoStatus = async (req, res) => {
  const { taskId } = req.params;

  try {
    const status = await client.getTaskStatus(taskId);
    
    if (status.state === 'completed') {
      res.json({
        status: 'completed',
        videoUrl: status.output.url
      });
    } else if (status.state === 'processing') {
      res.json({
        status: 'processing',
        progress: status.progress * 100
      });
    } else {
      res.json({
        status: 'failed',
        error: status.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check video status',
      details: error.message
    });
  }
}; 