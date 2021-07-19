import { createResource } from '.'

export default createResource('Contact', (id) => `v3/contact/${id}`)
