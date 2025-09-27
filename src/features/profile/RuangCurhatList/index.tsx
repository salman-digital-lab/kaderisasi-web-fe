"use client";

import {
  Paper,
  Stack,
  Text,
  Input,
  Select,
  Group,
  Pagination,
  Center,
  SimpleGrid,
  ThemeIcon,
  Title,
  Badge,
  Flex,
} from "@mantine/core";
import { IconSearch, IconHeart, IconFilter } from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { RuangCurhatData } from "@/types/model/ruangcurhat";
import RuangCurhatCard from "@/components/common/RuangCurhatCard";
import {
  PROBLEM_STATUS_RENDER,
  PROBLEM_STATUS_RENDER_COLOR,
} from "@/constants/render/ruangcurhat";

type RuangCurhatListProps = {
  data: RuangCurhatData[];
};

const ITEMS_PER_PAGE = 6;

export default function RuangCurhatList({ data }: RuangCurhatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Create filter options from available statuses
  const statusOptions = useMemo(() => {
    const uniqueStatuses = [...new Set(data.map(item => item.status))];
    return [
      { value: "all", label: "Semua Status" },
      ...uniqueStatuses.map(status => ({
        value: status.toString(),
        label: PROBLEM_STATUS_RENDER[status] || status
      }))
    ];
  }, [data]);

  // Filter data based on search query and status
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchQuery === "" || 
        item.problem_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.problem_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.handling_technic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || statusFilter === null || 
        item.status.toString() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  if (data.length === 0) {
    return (
      <Paper radius="md" withBorder p="lg">
        <Stack align="center" justify="center" h={200} gap="md">
          <ThemeIcon variant="light" color="pink" size="xl">
            <IconHeart size={28} />
          </ThemeIcon>
          <Title order={4} c="dimmed" ta="center">
            Belum Pernah Mengikuti Ruang Curhat
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            Anda belum pernah mendaftar untuk sesi ruang curhat. 
            Silakan kunjungi halaman konsultasi untuk memulai.
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper radius="md" withBorder p="lg">
      <Stack gap="lg">
        {/* Header with statistics */}
        <Group justify="space-between" wrap="wrap">
          <div>
            <Title order={4} mb="xs">
              Riwayat Ruang Curhat
            </Title>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Total: {data.length} sesi
              </Text>
              {filteredData.length !== data.length && (
                <>
                  <Text size="sm" c="dimmed">•</Text>
                  <Text size="sm" c="blue">
                    Ditemukan: {filteredData.length} sesi
                  </Text>
                </>
              )}
            </Group>
          </div>
          
          {/* Status badges summary */}
          <Group gap="xs" visibleFrom="sm">
            {statusOptions.slice(1).map(option => {
              const count = data.filter(item => item.status.toString() === option.value).length;
              if (count === 0) return null;
              
              const statusKey = parseInt(option.value) as keyof typeof PROBLEM_STATUS_RENDER_COLOR;
              
              return (
                <Badge
                  key={option.value}
                  variant="light"
                  color={PROBLEM_STATUS_RENDER_COLOR[statusKey] || "gray"}
                  size="sm"
                >
                  {option.label}: {count}
                </Badge>
              );
            })}
          </Group>
        </Group>

        {/* Filters */}
        <Group gap="md" wrap="wrap">
          <Input
            placeholder="Cari berdasarkan deskripsi, kategori, atau konselor..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1, minWidth: 250 }}
          />
          
          <Select
            placeholder="Filter Status"
            data={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
            leftSection={<IconFilter size={16} />}
            clearable
            style={{ minWidth: 180 }}
          />
        </Group>

        {/* Results */}
        {filteredData.length === 0 ? (
          <Stack align="center" justify="center" h={150} gap="md">
            <ThemeIcon variant="light" color="gray" size="lg">
              <IconSearch size={20} />
            </ThemeIcon>
            <Text size="md" c="dimmed" ta="center">
              Tidak ada hasil yang ditemukan
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Coba ubah kata kunci pencarian atau filter yang digunakan
            </Text>
          </Stack>
        ) : (
          <>
            {/* Cards Grid */}
            <SimpleGrid
              cols={{ base: 1, sm: 1, md: 1, lg: 2 }}
              spacing="md"
              verticalSpacing="md"
            >
              {paginatedData.map((item) => (
                <RuangCurhatCard key={item.id} data={item} />
              ))}
            </SimpleGrid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Center mt="md">
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={setCurrentPage}
                  size="sm"
                  siblings={1}
                  boundaries={1}
                />
              </Center>
            )}
          </>
        )}

        {/* Results summary */}
        {filteredData.length > 0 && (
          <Group justify="center" gap="xs">
            <Text size="xs" c="dimmed">
              Menampilkan {Math.min(ITEMS_PER_PAGE, filteredData.length - (currentPage - 1) * ITEMS_PER_PAGE)} dari {filteredData.length} hasil
            </Text>
            {currentPage > 1 && (
              <>
                <Text size="xs" c="dimmed">•</Text>
                <Text size="xs" c="dimmed">
                  Halaman {currentPage} dari {totalPages}
                </Text>
              </>
            )}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
