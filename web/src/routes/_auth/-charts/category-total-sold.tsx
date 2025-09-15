import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { categoryChartData } from './category-data'
import type { ChartConfig } from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const chartConfig = {
  totalSold: {
    label: 'Total Sold',
  },
  appetizer: {
    label: 'Appetizer',
    color: 'var(--chart-1)',
  },
  drink: {
    label: 'Drink',
    color: 'var(--chart-2)',
  },
  main: {
    label: 'Main',
    color: 'var(--chart-3)',
  },
  dessert: {
    label: 'Dessert',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig

export function CategoryTotalSold() {
  const [timeRange, setTimeRange] = React.useState('90d')

  const filteredData = categoryChartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2025-09-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Menu Items Sold - By Category</CardTitle>
          <CardDescription>Showing total sold per category</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAppetizer" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-appetizer)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-appetizer)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDrink" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-drink)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-drink)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMain" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-main)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-main)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDessert" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dessert)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dessert)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="drink"
              type="natural"
              fill="url(#fillDrink)"
              stroke="var(--color-drink)"
              stackId="a"
            />
            <Area
              dataKey="appetizer"
              type="natural"
              fill="url(#fillAppetizer)"
              stroke="var(--color-appetizer)"
              stackId="a"
            />
            <Area
              dataKey="main"
              type="natural"
              fill="url(#fillMain)"
              stroke="var(--color-main)"
              stackId="a"
            />
            <Area
              dataKey="dessert"
              type="natural"
              fill="url(#fillDessert)"
              stroke="var(--color-dessert)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
