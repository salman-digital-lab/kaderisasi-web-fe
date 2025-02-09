'use client'

import { useEffect, useState } from 'react'
import { getMonthlyLeaderboard, LeaderboardEntry } from '@/services/leaderboard'
import { IconUser } from '@tabler/icons-react'
import {
  Paper,
  Title,
  Select,
  Avatar,
  Text,
  Group,
  Stack,
  Pagination,
  Loader,
  Container,
  Alert,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import styles from './page.module.css'

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'))

  const fetchLeaderboard = async (page: number, month: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMonthlyLeaderboard(page, 10, month)
      setLeaderboard(response.data.data)
      setTotalItems(response.data.meta.total)
    } catch (error) {
      setError('Failed to load leaderboard data. Please try again later.')
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard(currentPage, selectedMonth)
  }, [currentPage, selectedMonth])

  // Generate last 12 months options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = dayjs().subtract(i, 'month')
    return {
      label: date.format('MMMM YYYY'),
      value: date.format('YYYY-MM')
    }
  })

  return (
    <Container size="md" py="xl">
      <Paper shadow="xs" p="md" withBorder>
        <Group justify="space-between" mb="lg">
          <Title order={2}>Monthly Leaderboard</Title>
          <Select
            value={selectedMonth}
            onChange={(value) => {
              if (value) {
                setSelectedMonth(value)
                setCurrentPage(1)
              }
            }}
            data={monthOptions}
            w={200}
            disabled={loading}
          />
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}

        {loading ? (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        ) : (
          <Stack gap="md">
            {leaderboard.map((entry, index) => (
              <Paper key={entry.id} shadow="xs" p="md" withBorder className={styles.leaderboardItem}>
                <Group>
                  <Text size="xl" fw={700} w={40} ta="center" c="dimmed">
                    {index + 1 + (currentPage - 1) * 10}
                  </Text>
                  <Group flex={1} gap="md">
                    <Avatar
                      src={entry.user.profile.picture}
                      alt={entry.user.profile.name}
                      size="md"
                      radius="xl"
                    >
                      <IconUser size={24} />
                    </Avatar>
                    <div>
                      <Text fw={500}>{entry.user.profile.name}</Text>
                      <Text size="sm" c="dimmed">
                        Level {entry.user.profile.level}
                      </Text>
                    </div>
                  </Group>
                  <Text fw={700} size="lg" c="blue">
                    {entry.score} points
                  </Text>
                </Group>
              </Paper>
            ))}

            {leaderboard.length === 0 && !error && (
              <Text c="dimmed" ta="center" py="xl">
                No leaderboard data available for this month.
              </Text>
            )}
          </Stack>
        )}

        {!loading && totalItems > 0 && (
          <Group justify="center" mt="xl">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={Math.ceil(totalItems / 10)}
            />
          </Group>
        )}
      </Paper>
    </Container>
  )
}

export default LeaderboardPage 
