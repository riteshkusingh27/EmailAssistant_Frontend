import React, { useState } from 'react'
import './App.css'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';    

function App() {
  
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleGenerateReply = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('https://emailassistantapi-production.up.railway.app/api/v1/generate-mail', {emailContent, tone});
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate reply. Please try again later.');
    }
    finally{
      setLoading(false);
    }

  }

  return (
    <Container maxWidth="sm" className="App">
    <Typography variant="h5" gutterBottom align="center"> Email Replier</Typography>
    <Box>
      <Typography variant="h5" gutterBottom>Original Email </Typography>
      <TextField
      autoComplete="on"
         fullWidth
         multiline
         rows={8}
         color="primary"
         variant="outlined"
         label="Original Email content"
         value={emailContent}
         onChange={(e) => setEmailContent(e.target.value)}
         sx={{ mb: 2 }}
         />
       <FormControl fullWidth sx={{ mb: 2 }}>
         <InputLabel id="tone-select-label">Tone</InputLabel>
         <Select
          value={tone || ''}
          label="Tone (Optional)"
          onChange={(e) => setTone(e.target.value)}
         >
           <MenuItem value="friendly">Friendly</MenuItem>
           <MenuItem value="professional">Professional</MenuItem>
           <MenuItem value="formal">Formal</MenuItem>
           <MenuItem value="casual">Casual</MenuItem>
         </Select>
     </FormControl>
    <Button variant="contained" onClick={handleGenerateReply} disabled={!emailContent || loading} fullWidth >{loading? <CircularProgress size={24} /> : "Generate Reply"}</Button>
    </Box>
    {error && (
      <Typography color="error" variant="body1" align="center" sx={{ mt: 2 }}>
        {error}
      </Typography>
    )}
    {
      generatedReply && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Generated Reply</Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            value={generatedReply}
            onChange={(e) => setGeneratedReply(e.target.value)}
          />
          <Button variant="outlined" onClick={() => navigator.clipboard.writeText(generatedReply) && alert('Copied to clipboard!')} sx={{ mt: 2 }}>
            Copy to Clipboard
          </Button>
        </Box>
      )
    }
    </Container>
  )
}

export default App
