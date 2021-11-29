declare module "grid-styled" {
  import { Component } from 'react';
  type MarginPaddingSimpleValue = 0 | 1 | 2 | 3 | 4 | string;
  type TupleMarginPaddingValue =
    [MarginPaddingSimpleValue] |
    [MarginPaddingSimpleValue, MarginPaddingSimpleValue] |
    [MarginPaddingSimpleValue, MarginPaddingSimpleValue, MarginPaddingSimpleValue] |
    [MarginPaddingSimpleValue, MarginPaddingSimpleValue, MarginPaddingSimpleValue, MarginPaddingSimpleValue] |
    [MarginPaddingSimpleValue, MarginPaddingSimpleValue, MarginPaddingSimpleValue, MarginPaddingSimpleValue, MarginPaddingSimpleValue];
  type MarginPaddingValue = MarginPaddingSimpleValue | TupleMarginPaddingValue;
  type WidthSimpleValue = number | string;
  type TupleWidthSimpleValue =
    [WidthSimpleValue] |
    [WidthSimpleValue, WidthSimpleValue] |
    [WidthSimpleValue, WidthSimpleValue, WidthSimpleValue] |
    [WidthSimpleValue, WidthSimpleValue, WidthSimpleValue, WidthSimpleValue] |
    [WidthSimpleValue, WidthSimpleValue, WidthSimpleValue, WidthSimpleValue, WidthSimpleValue];
  type WidthValue = WidthSimpleValue | TupleWidthSimpleValue;
  export interface BoxProps extends React.HTMLProps<HTMLDivElement> {
    width?: WidthValue;
    m?: MarginPaddingValue;
    mt?: MarginPaddingValue;
    mr?: MarginPaddingValue;
    mb?: MarginPaddingValue;
    ml?: MarginPaddingValue;
    mx?: MarginPaddingValue;
    my?: MarginPaddingValue;
    p?: MarginPaddingValue;
    pt?: MarginPaddingValue;
    pr?: MarginPaddingValue;
    pb?: MarginPaddingValue;
    pl?: MarginPaddingValue;
    px?: MarginPaddingValue;
    py?: MarginPaddingValue;
  }

  export interface FlexProps {
    align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    order?: number;
    wrap?: boolean;
    column?: boolean;
  }

  export class Box extends Component<BoxProps, {}> { }

  export class Flex extends Component<BoxProps & FlexProps, {}> { }

  export class Grid extends Box{ }
}
