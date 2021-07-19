import { createResource } from '.'

export default createResource('Company', (id) => `v4/company/${id}`)
