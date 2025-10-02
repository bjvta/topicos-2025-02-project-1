export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    service: 'subjects-service',
    timestamp: new Date().toISOString()
  });
}
