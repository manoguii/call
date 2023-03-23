import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSetSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSetSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability, isLoading } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  function handleSelectTime(hr: number) {
    // Cria data com a hora e dia selecionado pelo usuário
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hr)
      .startOf('hour')
      .toDate()

    onSetSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          {isLoading ? (
            <div style={{ height: '100%' }}>
              <ThreeDots
                height="46"
                width="46"
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
            <TimePickerList>
              {availability?.possibleTimes.map((hr) => {
                return (
                  <TimePickerItem
                    key={hr}
                    onClick={() => handleSelectTime(hr)}
                    disabled={!availability.availableTimes.includes(hr)}
                  >
                    {String(hr).padStart(2, '0')}:00h
                  </TimePickerItem>
                )
              })}
            </TimePickerList>
          )}
        </TimePicker>
      )}
    </Container>
  )
}
