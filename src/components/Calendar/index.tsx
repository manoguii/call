import { api } from '@/lib/axios'
import { getWeekDays } from '@/utils/get-week-days'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDays: number[]
}

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const previousMonthDate = currentDate.add(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  const shortWeekDay = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)

  const { data: blockedDates, isLoading } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: String(currentDate.get('month') + 1).padStart(2, '0'),
        },
      })

      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekday = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekday,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            // Data ja passou
            date.endOf('day').isBefore(new Date()) ||
            // Data bloqueada pelo usuário
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            // Data cheia
            blockedDates.blockedDays.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      {isLoading ? (
        <div style={{ height: '100%' }}>
          <ThreeDots
            height="56"
            width="56"
            color="#4fa94d"
            wrapperStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            visible={true}
          />
        </div>
      ) : (
        <CalendarBody>
          <thead>
            <tr>
              {shortWeekDay.map((weekDay) => {
                return <th key={weekDay}>{weekDay}.</th>
              })}
            </tr>
          </thead>

          <tbody>
            {calendarWeeks.map(({ week, days }) => {
              return (
                <tr key={week}>
                  {days.map(({ date, disabled }) => {
                    return (
                      <td key={date.toString()}>
                        <CalendarDay
                          onClick={() => onDateSelected(date.toDate())}
                          disabled={disabled}
                        >
                          {date.get('date')}
                        </CalendarDay>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </CalendarBody>
      )}
    </CalendarContainer>
  )
}
