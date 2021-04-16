var whoami = require('../fixtures/whoami.json')

var defaultTeamId = whoami.dit_team.id
var defaultAdviserId = whoami.id

exports.whoami = function (req, res) {
  res.json(whoami)
}

exports.setWhoami = function (req, res) {
  if (req.body.id) {
    whoami.id = req.body.id
  }
  if (req.body.dit_team_id) {
    whoami.dit_team.id = req.body.dit_team_id
  }
  if (req.body.features) {
    whoami.features = req.body.features
  }
  res.json(whoami)
}

exports.resetWhoami = function (req, res) {
  whoami.id = defaultAdviserId
  whoami.dit_team.id = defaultTeamId
  whoami.features = []
  res.json(whoami)
}
