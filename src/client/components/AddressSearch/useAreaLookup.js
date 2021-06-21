import axios from 'axios'
import { transformObjectToOption } from '../../../../../apps/transformers'

const UNITED_STATES_ID = '81756b9a-5d95-e211-a939-e4115bead28a'
const CANADA_ID = '5daf72a6-5d95-e211-a939-e4115bead28a'

function useAreaLookup(apiEndpoint, setUsStates, setCanadaProvinces) {
  const fetchData = async () => {
    const result = await axios(apiEndpoint)
    //'/api-proxy/v4/metadata/administrative-area')

    setUsStates(
      result.data
        .filter(
          (administrativeAreas) =>
            administrativeAreas.country.id === UNITED_STATES_ID
        )
        .map((states) => transformObjectToOption(states))
    )

    setCanadaProvinces(
      result.data
        .filter(
          (administrativeAreas) => administrativeAreas.country.id === CANADA_ID
        )
        .map((states) => transformObjectToOption(states))
    )
  }

  fetchData()
}

export default useAreaLookup
