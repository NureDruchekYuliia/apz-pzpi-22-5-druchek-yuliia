import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { agent } from '../../lib/api/agent';

interface Recommendation {
  title: string;
  description: string;
}

interface SleepRecord {
  id: string;
  date: string;
  sleepStart: string;
  sleepEnd: string;
  quality: number;
  avgNoiseLevel: number;
  avgLightLevel: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  sleepRecordId: string;
}

export default function SleepRecordDetailsDialog({ open, onClose, sleepRecordId }: Props) {
  const [record, setRecord] = useState<SleepRecord | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchDetails = async () => {
      try {
        const res = await agent.get(`/sleeprecord/${sleepRecordId}`);
        setRecord(res.data);

        const rec = await agent.get(`/sleeprecord/recommendations/${sleepRecordId}`);
        setRecommendations(rec.data);
      } catch (error) {
        console.error('Error loading details', error);
      }
    };

    fetchDetails();
  }, [open, sleepRecordId]);

  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sleep Record Details</DialogTitle>
      <DialogContent>
        <Typography>
          Date: {dayjs(record.date).format('DD.MM.YYYY')}
        </Typography>
        <Typography>
          Sleep Start: {dayjs(record.sleepStart).format('HH:mm')}
        </Typography>
        <Typography>
          Sleep End: {dayjs(record.sleepEnd).format('HH:mm')}
        </Typography>
        <Typography>Quality: {record.quality}/100</Typography>
        <Typography>Average Noise Level: {record.avgNoiseLevel.toFixed(1)} dB</Typography>
        <Typography>Average Light Level: {record.avgLightLevel.toFixed(1)} lx</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Recommendations</Typography>
        {recommendations.length === 0 ? (
          <Typography>No recommendations available</Typography>
        ) : (
          recommendations.map((rec, idx) => (
            <Box key={idx} mt={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {rec.title}
              </Typography>
              <Typography>{rec.description}</Typography>
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
