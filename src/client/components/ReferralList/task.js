export default () =>
  new Promise((resolve) =>
    setTimeout(resolve, 1000, [
      {
        id: '1234',
        title: 'Andy to Lou',
        companyName: 'Google',
        date: '1979-11-18',
        sendingAdviser: {
          name: 'Andy Pipkin',
        },
        receivingAdviser: {
          name: 'Lou Todd',
        },
      },
      {
        id: '1234',
        title: 'Lou to Andy',
        companyName: 'Amazon',
        date: '1979-11-18',
        sendingAdviser: {
          name: 'Lou Todd',
        },
        receivingAdviser: {
          name: 'Andy Pipkin',
        },
      },
    ])
  )
