"use client";

import React from "react";
import { Paper, Title, Text, Stack, ThemeIcon, Group, Box } from "@mantine/core";
import { IconClipboardList } from "@tabler/icons-react";
import { RegistrationInfo } from "@/types/model/club";

interface ClubRegistrationInfoProps {
  registrationInfo?: RegistrationInfo;
}

const ClubRegistrationInfo: React.FC<ClubRegistrationInfoProps> = ({
  registrationInfo,
}) => {
  if (!registrationInfo?.registration_info || registrationInfo.registration_info.trim() === "") {
    return null;
  }

  return (
    <Paper 
      p="xl" 
      radius="md" 
      shadow="sm"
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-cyan-0) 100%)',
        border: '2px solid var(--mantine-color-blue-2)',
      }}
    >
      <Stack gap="md">
        <Group gap="sm" align="center">
          <ThemeIcon size="lg" variant="light" color="blue">
            <IconClipboardList size={20} />
          </ThemeIcon>
          <Title order={3} c="blue.8">
            Registration Information
          </Title>
        </Group>
        
        <Paper p="lg" radius="sm" bg="white" shadow="xs">
          <Box
            style={{
              '& p': { marginBottom: '1rem' },
              '& h1, & h2, & h3, & h4, & h5, & h6': { marginBottom: '0.5rem', marginTop: '1rem' },
              '& ul, & ol': { marginBottom: '1rem', paddingLeft: '1.5rem' },
              '& li': { marginBottom: '0.25rem' },
              '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px' },
              '& blockquote': { 
                borderLeft: '4px solid #228be6', 
                paddingLeft: '1rem', 
                marginLeft: 0, 
                fontStyle: 'italic',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px'
              },
              '& a': {
                color: '#228be6',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'none'
                }
              },
              '& strong, & b': {
                fontWeight: 600
              },
              '& em, & i': {
                fontStyle: 'italic'
              },
              '& code': {
                backgroundColor: '#f1f3f4',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              },
              '& pre': {
                backgroundColor: '#f1f3f4',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                '& code': {
                  backgroundColor: 'transparent',
                  padding: 0
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: registrationInfo.registration_info }}
          />
        </Paper>
      </Stack>
    </Paper>
  );
};

export default ClubRegistrationInfo;
