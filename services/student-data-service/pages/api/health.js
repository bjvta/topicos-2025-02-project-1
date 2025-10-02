export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    service: 'student-data-service',
    timestamp: new Date().toISOString()
  });
}
