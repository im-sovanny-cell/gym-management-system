import { Box, Typography } from '@mui/material'
export default function Footer() {
  return (
    <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">© {new Date().getFullYear()} Gym Management</Typography>
    </Box>
  )
}
