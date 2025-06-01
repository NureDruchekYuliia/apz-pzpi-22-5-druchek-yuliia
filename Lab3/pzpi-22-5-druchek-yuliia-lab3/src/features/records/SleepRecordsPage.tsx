import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { agent } from '../../lib/api/agent';

interface SleepRecord {
  id: string;
  date: string;
  sleepStart: string;
  sleepEnd: string;
  quality: number;
  avgNoiseLevel: number;
  avgLightLevel: number;
}

interface Recommendation {
  title: string;
  description: string;
}

export default function SleepRecordsPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SleepRecord | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const response = await agent.get('/sleeprecord');
        const sortedRecords = response.data.sort((a: SleepRecord, b: SleepRecord) => {
          const dateA = dayjs(a.date).valueOf();
          const dateB = dayjs(b.date).valueOf();
          return dateB - dateA || dayjs(b.sleepStart).valueOf() - dayjs(a.sleepStart).valueOf();
        });
        setRecords(sortedRecords);
      } catch (error) {
        console.error('Failed to load sleep records', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleAdd = () => navigate('/sleep-records/new');
  const handleEdit = (id: string) => navigate(`/sleep-records/${id}/edit`);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await agent.delete(`/sleeprecord/${id}`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setDetailsOpen(false);
    } catch (error) {
      console.error('Failed to delete record', error);
    }
  };

  const handleView = async (id: string) => {
    try {
      const [recordRes, recsRes] = await Promise.all([
        agent.get(`/sleeprecord/${id}`),
        agent.get(`/sleeprecord/recommendations/${id}`),
      ]);
      setSelectedRecord(recordRes.data);
      setRecommendations(recsRes.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error('Failed to load record details', error);
    }
  };

  const filteredRecords = selectedDate
    ? records.filter((r) => dayjs(r.date).isSame(selectedDate, 'day'))
    : records;

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          slotProps={{ textField: { size: 'small' } }}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add Record
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : filteredRecords.length === 0 ? (
        <Typography textAlign="center" mt={4}>No records found</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredRecords.map((record) => (
            <Grid item xs={12} md={6} lg={4} key={record.id}>
              <Card variant="outlined" sx={{ cursor: 'pointer' }} onClick={() => handleView(record.id)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {dayjs(record.date).format('YYYY-MM-DD')}
                  </Typography>
                  <Typography>Start: {dayjs(record.sleepStart).format('HH:mm')}</Typography>
                  <Typography>End: {dayjs(record.sleepEnd).format('HH:mm')}</Typography>
                  <Typography>Quality: {record.quality}/10</Typography>
                  <Typography>Noise: {record.avgNoiseLevel.toFixed(1)} dB</Typography>
                  <Typography>Light: {record.avgLightLevel.toFixed(1)} lx</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Details</DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <>
              <Typography>Date: {dayjs(selectedRecord.date).format('YYYY-MM-DD')}</Typography>
              <Typography>Start: {dayjs(selectedRecord.sleepStart).format('HH:mm')}</Typography>
              <Typography>End: {dayjs(selectedRecord.sleepEnd).format('HH:mm')}</Typography>
              <Typography>Quality: {selectedRecord.quality}/10</Typography>
              <Typography>Noise: {selectedRecord.avgNoiseLevel.toFixed(1)} dB</Typography>
              <Typography>Light: {selectedRecord.avgLightLevel.toFixed(1)} lx</Typography>

              <Box mt={2}>
                <Typography variant="h6">Recommendations</Typography>
                {recommendations.length === 0 ? (
                  <Typography>No recommendations available</Typography>
                ) : (
                  recommendations.map((rec, idx) => (
                    <Box key={idx} mt={1}>
                      <Typography fontWeight="bold">{rec.title}</Typography>
                      <Typography>{rec.description}</Typography>
                    </Box>
                  ))
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedRecord && (
            <>
              <Button color="primary" onClick={() => handleEdit(selectedRecord.id)}>Edit</Button>
              <Button color="error" onClick={() => handleDelete(selectedRecord.id)}>Delete</Button>
            </>
          )}
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
