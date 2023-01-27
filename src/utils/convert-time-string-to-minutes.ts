export function convertTimeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map((item) => Number(item))

  return hours * 60 + minutes
}
