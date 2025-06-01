import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { agent } from '../../lib/api/agent';

interface SleepRecordFormData {
  date: Dayjs | null;
  sleepStart: Dayjs | null;
  sleepEnd: Dayjs | null;
  quality: number | '';
}

export default function SleepFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';

  const [formData, setFormData] = useState<SleepRecordFormData>({
    date: dayjs(),
    sleepStart: dayjs(),
    sleepEnd: dayjs(),
    quality: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || isNew) return;
    setLoading(true);
    agent
      .get(`/sleeprecord/${id}`)
      .then(({ data }) => {
        setFormData({
          date: dayjs(data.date),
          sleepStart: dayjs(data.sleepStart),
          sleepEnd: dayjs(data.sleepEnd),
          quality: data.quality,
        });
      })
      .catch((err) => console.error('Failed to load record', err))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleChange = (field: keyof SleepRecordFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () =>
    formData.date &&
    formData.sleepStart &&
    formData.sleepEnd &&
    typeof formData.quality === 'number' &&
    formData.quality >= 1 &&
    formData.quality <= 10;

  const handleSubmit = async () => {
    if (!validate()) {
      alert('Please fill out all fields correctly');
      return;
    }

    const payload = {
      date: formData.date!.format('YYYY-MM-DD'),
      sleepStart: formData.sleepStart!.format('YYYY-MM-DDTHH:mm'),
      sleepEnd: formData.sleepEnd!.format('YYYY-MM-DDTHH:mm'),
      quality: formData.quality,
    };

    try {
      if (!isNew) {
        await agent.patch(`/sleeprecord/${id}`, payload);
      } else {
        await agent.post('/sleeprecord', payload);
      }
      navigate('/sleep-records');
    } catch (error) {
      console.error('Error saving record', error);
      alert('Failed to save record');
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>{isNew ? 'Add Sleep Record' : 'Edit Sleep Record'}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(val) => handleChange('date', val)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="Sleep Start"
              value={formData.sleepStart}
              onChange={(val) => handleChange('sleepStart', val)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="Sleep End"
              value={formData.sleepEnd}
              onChange={(val) => handleChange('sleepEnd', val)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TextField
              label="Sleep Quality (1-10)"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={formData.quality}
              onChange={(e) => {
                const val = Number(e.target.value);
                handleChange('quality', val >= 1 && val <= 10 ? val : '');
              }}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate('/sleep-records')}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {isNew ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
