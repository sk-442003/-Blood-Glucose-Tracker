const { getReport } = require('../services/reportService');

async function report(req, res) {
  const data = await getReport(req.user.id, req.params.type, req.query.date);
  res.json(data);
}

module.exports = { report };
