export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    service: 'enrollment-service',
    timestamp: new Date().toISOString()
  });
}
