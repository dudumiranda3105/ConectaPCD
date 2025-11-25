// Type declarations for recharts with React 19 compatibility
import { FC, ReactNode, SVGProps, CSSProperties } from 'react'

declare module 'recharts' {
  interface CommonProps {
    children?: ReactNode
    className?: string
    style?: CSSProperties
  }

  export interface XAxisProps extends CommonProps {
    dataKey?: string
    tickLine?: boolean
    axisLine?: boolean
    tickMargin?: number
    tick?: any
    angle?: number
    textAnchor?: string
    height?: number
    [key: string]: any
  }

  export interface YAxisProps extends CommonProps {
    tickLine?: boolean
    axisLine?: boolean
    tick?: any
    [key: string]: any
  }

  export interface LineProps extends CommonProps {
    dataKey?: string
    type?: string
    stroke?: string
    strokeWidth?: number
    dot?: any
    activeDot?: any
    name?: string
    [key: string]: any
  }

  export interface BarProps extends CommonProps {
    dataKey?: string
    fill?: string
    radius?: number[]
    maxBarSize?: number
    name?: string
    [key: string]: any
  }

  export interface TooltipProps extends CommonProps {
    contentStyle?: CSSProperties
    [key: string]: any
  }

  export interface LegendProps extends CommonProps {
    [key: string]: any
  }

  export interface CartesianGridProps extends CommonProps {
    strokeDasharray?: string
    vertical?: boolean
    stroke?: string
    [key: string]: any
  }

  export interface ResponsiveContainerProps extends CommonProps {
    width?: string | number
    height?: string | number
    [key: string]: any
  }

  export interface LineChartProps extends CommonProps {
    data?: any[]
    [key: string]: any
  }

  export interface BarChartProps extends CommonProps {
    data?: any[]
    [key: string]: any
  }

  export const LineChart: FC<LineChartProps>
  export const Line: FC<LineProps>
  export const BarChart: FC<BarChartProps>
  export const Bar: FC<BarProps>
  export const XAxis: FC<XAxisProps>
  export const YAxis: FC<YAxisProps>
  export const CartesianGrid: FC<CartesianGridProps>
  export const Tooltip: FC<TooltipProps>
  export const Legend: FC<LegendProps>
  export const ResponsiveContainer: FC<ResponsiveContainerProps>
}
