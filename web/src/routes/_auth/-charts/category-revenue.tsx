import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

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

export function CategoryRevenue() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('appetizer')

  const total = React.useMemo(
    () => ({
      appetizer: categoryChartData.reduce(
        (acc, curr) => acc + curr.appetizer,
        0,
      ),
      main: categoryChartData.reduce((acc, curr) => acc + curr.main, 0),
      dessert: categoryChartData.reduce((acc, curr) => acc + curr.dessert, 0),
      drink: categoryChartData.reduce((acc, curr) => acc + curr.drink, 0),
    }),
    [],
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 lg:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 lg:!py-0">
          <CardTitle>Menu Revenue - By Category</CardTitle>
          <CardDescription className="md:hidden xl:inline">
            Showing total revenue for the menu items
          </CardDescription>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {['appetizer', 'main', 'dessert', 'drink'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left border-l lg:border-t-0 lg:px-8 lg:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold lg:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 md:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={categoryChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
