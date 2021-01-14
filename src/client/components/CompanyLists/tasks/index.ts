import { get, pick } from 'lodash'
import { apiProxyAxios } from '../../Task/utils'

import {CompanyListsResult, CompanyListResult} from '../../../../types/api/company-list'

import {CompanyListsTask, CompanyListTask} from '../types'

export const fetchCompanyLists: CompanyListsTask = () =>
  apiProxyAxios.get<CompanyListsResult>('v4/company-list').then((res) =>
    res.data.results.reduce(
      (acc, { id, name }) => ({
        ...acc,
        [id]: name,
      }),
      {}
    )
  )

export const fetchCompanyList: CompanyListTask = (id) =>
  apiProxyAxios.get<CompanyListResult>(`v4/company-list/${id}/item`).then((res) =>
    res.data.results.map(({ company: { id, name }, latest_interaction }) => ({
      id,
      name,
      ...pick(latest_interaction, ['date', 'subject']),
      interactionId: latest_interaction.id,
      ditParticipants: latest_interaction
        ?.dit_participants
        .map(({adviser, team}) => ({
          name: adviser.name,
          team: team.name,
        })),
    }))
  )
