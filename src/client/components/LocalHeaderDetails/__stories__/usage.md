# LocalHeaderDetails

### Description

Implementation of re-usable component for investment opportunities header details using React.

### Usage

```jsx
  <StyledHeaderDetails
    aria-label="local header details"
    data-auto-id="localHeaderDetails"
    role="region"
  >
    { Object.entries(items).map(item => {
      return (
        <StyledHeaderList key={item[0]}>
          <StyledHeaderListLabel>{item[0]}</StyledHeaderListLabel>
            { item[1][0].length ? <p>{item[1]}</p> : 
                <p>{item[1][0].label} -&nbsp;
                  <a href={item[1][0].value}>change</a>
                </p>
            }
        </StyledHeaderList>
        )
      })
    }
  </StyledHeaderDetails>
```

### Properties
| Prop            | Required | Default                                   | Type | Description |
| :-------------- | :------- | :---------------------------------------- | :--- | :---------- |
| `items` | true    | `` | Object | Contains the item collections |

