const axios = require('axios')

export function updateProjectStage({ values }) {
  return axios.post('/api-proxy/v3/investment/{id}/update-stage', {
    stage: {
      id: values.projectStage,
    },
  })
}
