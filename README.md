# react-dynamic-lazy-virtual-scroll

React Dynamic Virtual Scroll is a lightweight and customizable library for efficiently rendering large lists in React applications. By utilizing the virtual scrolling technique, it renders only the visible items in the list, resulting in faster load times and smoother scrolling experiences.

### Installation

```js
npm install react-dynamic-lazy-virtual-scroll
```

No external dependencies so no need to worry about security and package size.

### Usage

- Import component.

  ```jsx
  import VirtualScroll from "react-dynamic-lazy-virtual-scroll";
  ```

- Add component:

  ```jsx
  <VirtualScroll
      className="List"
      minItemHeight={40}
      totalLength={100}
      renderItem={(rowIndex) => {
          return (
            <div className="List-item">
              <h3>List item: {rowIndex}</h3>
            </div>
          );
      }}
  />
  ```

### Props Table

| name          | type                            | required | default | description                                                  |
| ------------- | ------------------------------- | -------- | ------- | ------------------------------------------------------------ |
| minItemHeight | number                          | *        |         | Smallest item height to calculate placeholder spacing.       |
| totalLength   | number                          | *        |         | Total amount of items to be displayed.                       |
| renderItem    | (rowIndex) => React.ReactNode   | *        |         | Function to display items for specific index values. **Indexed at 0.** |
| length        | number                          |          | 30      | Total number of items to be rendered in the dom.             |
| buffer        | number                          |          | 10      | Total number of items to be displayed in the DOM before and after the required items. |
